import ollama
import re
import json
from typing import Dict, List, Optional, Tuple, Any

class OllamaLLMService:
    def __init__(self, model="gemma2:9b"):
        self.model = model
        self.max_retries = 2  # Number of retries for SQL generation
        
    def generate_text(self, prompt: str, system_prompt: str = "You are a helpful AI.") -> str:
        """Generate text with proper error handling"""
        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ]
            )
            return response["message"]["content"].strip()
        except Exception as e:
            print(f"Ollama API error: {e}")
            return ""

    def generate_sql(self, question: str, schema_rows: list) -> str:
        """
        Generate SQL with schema validation and self-correction
        schema_rows: list of (table_name, column_name, data_type)
        """
        
        # Build schema dictionary for validation
        schema_dict = self._build_schema_dict(schema_rows)
        valid_columns = self._get_all_column_names(schema_rows)
        table_names = list(schema_dict.keys())
        
        # Detect query type for better generation
        query_type = self._detect_query_type(question)
        
        # Check if multiple statements might be needed
        needs_multiple = self._needs_multiple_statements(question)
        
        # Try up to max_retries times
        for attempt in range(self.max_retries):
            sql = self._attempt_sql_generation(question, schema_rows, query_type, needs_multiple, attempt)
            
            # Clean SQL
            sql = self._clean_sql(sql)
            
            # Check syntax for each statement
            is_valid_syntax, syntax_error = self._validate_sql_syntax(sql)
            if not is_valid_syntax:
                print(f"Attempt {attempt + 1} syntax error: {syntax_error}")
                if attempt < self.max_retries - 1:
                    continue
            
            # Validate against schema
            is_valid_schema, schema_error = self._validate_sql_against_schema(
                sql, schema_dict, valid_columns, table_names
            )
            
            if is_valid_syntax and is_valid_schema:
                return sql
            
            print(f"Attempt {attempt + 1} failed: {schema_error if not is_valid_schema else syntax_error}")
        
        # If all attempts fail, use a safe fallback based on question
        return self._get_safe_fallback_query(question, table_names, query_type, needs_multiple)

    def _detect_query_type(self, question: str) -> str:
        """Detect the type of query from the question"""
        question_lower = question.lower()
        
        # Aggregate queries (SUM, COUNT, AVG, etc.)
        aggregate_keywords = [
            'total', 'sum', 'revenue', 'average', 'avg', 'mean',
            'how many', 'count', 'minimum', 'maximum', 'max', 'min'
        ]
        for keyword in aggregate_keywords:
            if keyword in question_lower:
                return "aggregate"
        
        # Top N list queries
        top_keywords = [
            'top', 'highest', 'lowest', 'best', 'worst',
            'most', 'least', 'largest', 'smallest'
        ]
        for keyword in top_keywords:
            if keyword in question_lower:
                return "top_list"
        
        # List/Show queries
        list_keywords = [
            'list', 'show', 'display', 'get', 'find',
            'what are', 'who are', 'which'
        ]
        for keyword in list_keywords:
            if keyword in question_lower:
                return "list"
        
        # Default
        return "regular"

    def _needs_multiple_statements(self, question: str) -> bool:
        """Determine if the question might need multiple SQL statements"""
        question_lower = question.lower()
        
        # Check for patterns that indicate multiple needs
        count_indicators = ['how many', 'count']
        list_indicators = ['list', 'names', 'show', 'who', 'which']
        
        has_count = any(ind in question_lower for ind in count_indicators)
        has_list = any(ind in question_lower for ind in list_indicators)
        
        # Also check for "and" connecting different requests
        if ' and ' in question_lower and has_count and has_list:
            return True
        
        return False

    def _build_schema_dict(self, schema_rows: list) -> Dict:
        """Build a dictionary of tables and their columns with types"""
        schema_dict = {}
        for table, column, dtype in schema_rows:
            if table not in schema_dict:
                schema_dict[table] = {}
            schema_dict[table][column] = dtype
        return schema_dict

    def _get_all_column_names(self, schema_rows: list) -> set:
        """Get set of all valid column names"""
        return {column for _, column, _ in schema_rows}

    def _create_schema_prompt(self, schema_rows: list) -> str:
        """Create a detailed schema prompt with examples"""
        schema_dict = self._build_schema_dict(schema_rows)
        
        prompt = "Database Schema:\n\n"
        
        for table, columns in schema_dict.items():
            prompt += f"Table: {table}\n"
            for col, dtype in columns.items():
                prompt += f"  - {col} ({dtype})\n"
            prompt += "\n"
        
        # Add relationship hints
        prompt += "Relationships:\n"
        if 'companies' in schema_dict:
            prompt += "- companies.id → users.company_id\n"
            prompt += "- companies.id → subscriptions.company_id\n"
            prompt += "- companies.id → invoices.company_id\n"
            prompt += "- companies.id → support_tickets.company_id\n"
        if 'users' in schema_dict:
            prompt += "- users.id → support_tickets.user_id\n"
        if 'subscriptions' in schema_dict:
            prompt += "- subscriptions.id → invoices.subscription_id\n"
        if 'products' in schema_dict:
            prompt += "- products.id → product_reviews.product_id\n"
            prompt += "- companies.id → product_reviews.company_id\n"
        
        return prompt

    def _attempt_sql_generation(self, question: str, schema_rows: list, query_type: str, needs_multiple: bool, attempt: int) -> str:
        """Attempt to generate SQL with different prompts based on attempt number"""
        
        schema_prompt = self._create_schema_prompt(schema_rows)
        
        # Determine if multiple statements are needed
        multiple_stmt_hint = ""
        if needs_multiple:
            multiple_stmt_hint = """
IMPORTANT: This question requires MULTIPLE SQL statements (e.g., one for COUNT and one for LIST).
Generate them separated by semicolons.
Example: 
  SELECT COUNT(*) FROM companies WHERE churn_risk > 0.5;
  SELECT name, churn_risk FROM companies WHERE churn_risk > 0.5 ORDER BY churn_risk DESC;
"""
        
        # Different prompts based on attempt number
        if attempt == 0:
            system_prompt = "You are a precise SQL generator. Generate ONLY the SQL query."
            
            # Add query type specific instructions
            if query_type == "aggregate":
                limit_instruction = "IMPORTANT: This is an AGGREGATE query (SUM, COUNT, AVG). Do NOT add LIMIT clause."
            elif query_type == "top_list":
                limit_instruction = "This is a TOP N list query. Use ORDER BY but do NOT add LIMIT (will be handled by application)."
            else:
                limit_instruction = "Do NOT add LIMIT clause (will be handled by application)."
            
            user_prompt = f"""
{schema_prompt}

Question: "{question}"
Query Type: {query_type}
{multiple_stmt_hint}

Generate SQL SELECT query/queries.

CRITICAL RULES:
- {limit_instruction}
- Use exact table and column names from the schema above
- If multiple statements needed, separate with semicolons
- Each statement must be a valid SELECT
- No UNION, no subqueries unless absolutely necessary
- Do NOT add LIMIT clause
- Return ONLY the SQL, no explanations, no markdown

SQL:"""
        
        elif attempt == 1:
            system_prompt = "You are an expert SQL developer. Be precise and simple."
            
            # Extract table names for reference
            table_names = list(set([t for t,_,_ in schema_rows]))
            
            user_prompt = f"""
Tables in database: {', '.join(table_names)}

Question: "{question}"
{multiple_stmt_hint}

Generate correct PostgreSQL query/queries.

RULES:
- Use exact table names from the list above
- Separate multiple statements with semicolons
- Do NOT add LIMIT clause
- Use appropriate JOINs if needed

SQL:"""
        
        else:
            # Final attempt - very simple
            system_prompt = "Generate simple SQL queries."
            table_names = list(set([t for t,_,_ in schema_rows[:5]]))
            user_prompt = f"""
For question: "{question}"
Generate SQL queries.

Available tables: {', '.join(table_names)}

SQL:"""

        response = ollama.chat(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            options={
                "temperature": 0,  # Zero temperature for consistent output
                "top_p": 1,
                "max_tokens": 300  # Increased for multiple statements
            }
        )
        
        return response["message"]["content"]

    def _clean_sql(self, sql: str) -> str:
        """Clean SQL from markdown and extra text"""
        # Remove markdown code blocks
        sql = re.sub(r'```sql\s*', '', sql)
        sql = re.sub(r'```\s*', '', sql)
        
        # Remove any explanatory text before or after
        lines = sql.split('\n')
        sql_lines = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('--') and not line.startswith('/*'):
                sql_lines.append(line)
        
        sql = ' '.join(sql_lines).strip()
        
        return sql

    def _validate_sql_syntax(self, sql: str) -> Tuple[bool, str]:
        """Basic syntax validation to catch common errors"""
        # Split into individual statements
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        if not statements:
            return False, "No SQL statements found"
        
        for i, stmt in enumerate(statements):
            stmt_upper = stmt.upper()
            
            # Check for basic structure
            if 'SELECT' not in stmt_upper:
                return False, f"Statement {i+1}: Missing SELECT keyword"
            
            if 'FROM' not in stmt_upper:
                return False, f"Statement {i+1}: Missing FROM clause"
            
            # Check for misplaced keywords
            select_pos = stmt_upper.find('SELECT')
            from_pos = stmt_upper.find('FROM')
            
            if from_pos < select_pos:
                return False, f"Statement {i+1}: FROM clause before SELECT"
            
            # Check for common malformed patterns
            if 'SELECT SELECT' in stmt_upper:
                return False, f"Statement {i+1}: Duplicate SELECT keyword"
            
            if 'FROM FROM' in stmt_upper:
                return False, f"Statement {i+1}: Duplicate FROM keyword"
        
        return True, ""

    def _validate_sql_against_schema(self, sql: str, schema_dict: Dict, valid_columns: set, table_names: list) -> Tuple[bool, str]:
        """Validate SQL against schema for all statements"""
        # Split into individual statements
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        all_invalid_columns = []
        
        for stmt in statements:
            stmt_lower = stmt.lower()
            
            # Extract table names used in this statement
            found_tables = []
            for table in table_names:
                if table in stmt_lower:
                    found_tables.append(table)
            
            if not found_tables:
                return False, f"No valid table found in statement: {stmt[:50]}"
            
            # Extract potential column names
            words = re.findall(r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', stmt)
            
            for word in words:
                # Skip SQL keywords
                if word.upper() in ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'IN', 'NOT', 'NULL', 
                                    'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'ASC', 'DESC',
                                    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AS', 'ON', 'JOIN',
                                    'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'DISTINCT']:
                    continue
                # Skip numbers
                if word.isdigit():
                    continue
                # Skip aggregate function names
                if word in ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX']:
                    continue
                # Check if it might be a column
                if word not in valid_columns and not any(table + '.' + word in stmt_lower for table in found_tables):
                    # Could be a table name
                    if word not in table_names:
                        all_invalid_columns.append(word)
        
        if all_invalid_columns:
            return False, f"Invalid columns: {', '.join(all_invalid_columns[:3])}"
        
        return True, ""

    def _get_safe_fallback_query(self, question: str, table_names: list, query_type: str, needs_multiple: bool) -> str:
        """Generate a safe fallback query based on question keywords"""
        question_lower = question.lower()
        
        # If multiple statements needed, provide both count and list
        if needs_multiple and 'companies' in table_names:
            has_count = any(word in question_lower for word in ['how many', 'count'])
            has_list = any(word in question_lower for word in ['list', 'names', 'show'])
            
            if has_count and has_list and 'churn' in question_lower:
                return """
SELECT COUNT(*) as high_risk_count FROM companies WHERE churn_risk > 0.3;
SELECT name, churn_risk FROM companies WHERE churn_risk > 0.3 ORDER BY churn_risk DESC;
"""
        
        # Count questions
        if any(word in question_lower for word in ['how many', 'count']):
            if 'high-risk' in question_lower or 'churn' in question_lower:
                if 'companies' in table_names:
                    return "SELECT COUNT(*) as high_risk_count FROM companies WHERE churn_risk > 0.3"
            elif 'companies' in table_names:
                return "SELECT COUNT(*) as company_count FROM companies"
            elif 'customers' in table_names:
                return "SELECT COUNT(*) as customer_count FROM customers"
        
        # List questions
        if any(word in question_lower for word in ['list', 'names', 'show']):
            if 'churn' in question_lower and 'companies' in table_names:
                return "SELECT name, churn_risk FROM companies WHERE churn_risk > 0.3 ORDER BY churn_risk DESC"
            elif 'companies' in table_names:
                return "SELECT name, country, plan FROM companies"
        
        # Revenue/SUM questions
        if any(word in question_lower for word in ['revenue', 'total', 'sum']):
            if 'invoices' in table_names:
                return "SELECT SUM(amount) as total_revenue FROM invoices"
        
        # Default fallback
        if 'companies' in table_names:
            return "SELECT name, country, plan FROM companies"
        else:
            return "SELECT 1 as result"

    def generate_answer(self, question: str, context: str, sources: list = None) -> str:
        """Generate a natural language answer with source attribution"""
        
        source_text = ""
        if sources:
            source_text = "\n\n**Sources:**\n"
            for i, source in enumerate(sources[:3], 1):
                filename = source.get('filename', 'Unknown')
                score = source.get('relevance_score', 0)
                source_text += f"{i}. {filename} (relevance: {score:.2f})\n"
        
        prompt = f"""Based on the following context, provide a comprehensive and helpful answer to the question.

Context:
{context}

Question: {question}

Instructions:
- Be concise but thorough
- Use natural language
- If the context doesn't contain the answer, say so
- Do not make up information

Answer:"""

        response = ollama.chat(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides accurate answers based only on the given context."},
                {"role": "user", "content": prompt}
            ],
            options={
                "temperature": 0.3,
                "top_p": 0.9,
                "max_tokens": 400
            }
        )
        
        return response["message"]["content"].strip()

    def split_intent(self, question: str) -> Dict[str, Optional[str]]:
        """Split question into SQL and RAG parts"""
        
        prompt = f"""You are an expert at analyzing questions and splitting them into two parts:
1. SQL part: Questions about structured data (numbers, counts, lists, names, aggregates)
2. RAG part: Questions about unstructured text (policies, explanations, descriptions, processes)

IMPORTANT: The SQL part may require MULTIPLE queries (e.g., both COUNT and LIST).
Keep ALL structured data requests in the SQL part.

Analyze this question and split it appropriately:

Question: "{question}"

Return ONLY in this JSON format:
{{"sql_part": "the sql query part or null", "rag_part": "the document search part or null"}}

Examples:
- "How many high-risk companies and their names and explain retention" -> 
  {{"sql_part": "How many high-risk companies and their names", "rag_part": "explain retention"}}
- "List companies with churn > 0.5 and describe support" ->
  {{"sql_part": "List companies with churn > 0.5", "rag_part": "describe support"}}
- "What is total revenue and explain pricing policy" ->
  {{"sql_part": "What is total revenue", "rag_part": "explain pricing policy"}}

Now process:"""

        response = self.generate_text(prompt, "You are a precise question analyzer. Return only valid JSON.")
        
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return {
                    "sql_part": data.get("sql_part"),
                    "rag_part": data.get("rag_part")
                }
        except Exception as e:
            print(f"Intent split error: {e}")
        
        # Fallback
        sql_indicators = ['how many', 'count', 'total', 'sum', 'revenue', 'average', 'list', 'show', 'top', 'names']
        rag_indicators = ['explain', 'describe', 'policy', 'process', 'tell me', 'what is', 'how does', 'strategy']
        
        has_sql = any(ind in question.lower() for ind in sql_indicators)
        has_rag = any(ind in question.lower() for ind in rag_indicators)
        
        return {
            "sql_part": question if has_sql else None,
            "rag_part": question if has_rag else None
        }
    

