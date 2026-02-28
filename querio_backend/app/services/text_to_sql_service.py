import re
from difflib import get_close_matches

class TextToSQLService:
    def __init__(self, llm_service, db_executor, schema_service):
        self.llm_service = llm_service
        self.db_executor = db_executor
        self.schema_service = schema_service

    def _validate_sql(self, sql: str):
        """Validate SQL for safety - allows multiple SELECT statements"""
        sql_clean = sql.strip()
        
        # Split into individual statements
        statements = [s.strip() for s in sql_clean.split(';') if s.strip()]
        
        if not statements:
            raise ValueError("No SQL statements found")
        
        # Check each statement
        for i, stmt in enumerate(statements):
            stmt_upper = stmt.upper()
            
            # 1️⃣ Only allow SELECT statements
            if not stmt_upper.startswith("SELECT"):
                raise ValueError(f"Statement {i+1}: Only SELECT queries are allowed. Found: {stmt[:50]}")
            
            # 2️⃣ Prevent dangerous keywords
            dangerous_keywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'TRUNCATE']
            for keyword in dangerous_keywords:
                if keyword in stmt_upper:
                    raise ValueError(f"Statement {i+1}: Dangerous keyword detected: {keyword}")
        
        return sql_clean

    def _should_add_limit(self, sql: str) -> bool:
        """Intelligently determine if a LIMIT clause should be added"""
        # Split into statements
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        # If any statement is an aggregate, don't add limit to entire batch
        aggregate_functions = ['COUNT(', 'SUM(', 'AVG(', 'MIN(', 'MAX(']
        
        for stmt in statements:
            stmt_upper = stmt.upper()
            for agg in aggregate_functions:
                if agg in stmt_upper:
                    return False
        
        return True

    def _get_limit_value(self, sql: str, default_limit: int = 50) -> int:
        """Determine appropriate limit value based on query content"""
        # Split into statements
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        # Check if any statement has ORDER BY
        for stmt in statements:
            if 'ORDER BY' in stmt.upper():
                return 10
        
        return default_limit

    def _enforce_limit(self, sql: str, default_limit: int = 50):
        """Intelligently add LIMIT clause only when appropriate"""
        if not self._should_add_limit(sql):
            return sql
        
        limit_value = self._get_limit_value(sql, default_limit)
        
        # Split into statements
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        # Apply LIMIT to each statement that doesn't have it and isn't aggregate
        aggregate_functions = ['COUNT(', 'SUM(', 'AVG(', 'MIN(', 'MAX(']
        
        modified_statements = []
        for stmt in statements:
            stmt_upper = stmt.upper()
            
            # Skip if already has LIMIT
            if 'LIMIT' in stmt_upper:
                modified_statements.append(stmt)
                continue
            
            # Skip if aggregate
            is_aggregate = False
            for agg in aggregate_functions:
                if agg in stmt_upper:
                    is_aggregate = True
                    break
            
            if is_aggregate:
                modified_statements.append(stmt)
                continue
            
            # Add LIMIT
            stmt = stmt.rstrip(';')
            stmt += f" LIMIT {limit_value}"
            modified_statements.append(stmt)
        
        # Rejoin statements
        return '; '.join(modified_statements) + ';'
    
    def _clean_sql(self, sql: str) -> str:
        sql = sql.strip()

        # Remove markdown code blocks
        if sql.startswith("```"):
            sql = sql.replace("```sql", "").replace("```", "").strip()
        
        # Remove any explanatory text
        lines = sql.split('\n')
        sql_lines = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('--') and not line.startswith('/*'):
                sql_lines.append(line)
        
        return ' '.join(sql_lines).strip()

    def _fix_sql_with_schema(self, sql: str, schema_rows: list) -> str:
        """
        Fix SQL errors using actual database schema
        schema_rows: list of (table_name, column_name, data_type)
        """
        
        # Extract all valid table names from schema
        valid_tables = list(set([row[0] for row in schema_rows]))
        
        # Extract all valid column names from schema
        valid_columns = list(set([row[1] for row in schema_rows]))
        
        # Split into statements
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        corrected_statements = []
        fixes_made = []
        
        for statement in statements:
            corrected_stmt = statement
            
            # Find all words that might be table/column names
            words = re.findall(r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', corrected_stmt)
            
            # First pass: Fix table names
            for word in words:
                word_lower = word.lower()
                
                # Skip SQL keywords
                if word_lower in ['select', 'from', 'where', 'and', 'or', 'in', 'not', 'null', 
                                  'order', 'by', 'group', 'having', 'limit', 'asc', 'desc',
                                  'count', 'sum', 'avg', 'min', 'max', 'as', 'on', 'join',
                                  'inner', 'left', 'right', 'full', 'cross', 'distinct']:
                    continue
                
                # Check if this might be a misspelled table name
                if word not in valid_tables:
                    # Find close matches in valid tables (minimum 70% similarity)
                    matches = get_close_matches(word, valid_tables, n=1, cutoff=0.7)
                    if matches:
                        # Replace misspelled table name with correct one
                        corrected_stmt = corrected_stmt.replace(word, matches[0])
                        fixes_made.append(f"Table: '{word}' -> '{matches[0]}'")
            
            # Second pass: Fix column names (re-extract words after table fixes)
            words = re.findall(r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', corrected_stmt)
            
            for word in words:
                word_lower = word.lower()
                
                # Skip SQL keywords
                if word_lower in ['select', 'from', 'where', 'and', 'or', 'in', 'not', 'null', 
                                  'order', 'by', 'group', 'having', 'limit', 'asc', 'desc',
                                  'count', 'sum', 'avg', 'min', 'max', 'as', 'on', 'join']:
                    continue
                
                # Skip if it's now a valid table name
                if word in valid_tables:
                    continue
                
                # Check if this might be a misspelled column name
                if word not in valid_columns:
                    matches = get_close_matches(word, valid_columns, n=1, cutoff=0.7)
                    if matches:
                        # Replace misspelled column name
                        corrected_stmt = corrected_stmt.replace(word, matches[0])
                        fixes_made.append(f"Column: '{word}' -> '{matches[0]}'")
            
            corrected_statements.append(corrected_stmt)
        
        # Log fixes for debugging
        if fixes_made:
            print(f"SQL fixes applied: {', '.join(fixes_made)}")
        
        # Rejoin statements
        return '; '.join(corrected_statements) + (';' if corrected_statements else '')

    def _execute_multiple_statements(self, sql: str):
        """Execute multiple SQL statements and combine results"""
        statements = [s.strip() for s in sql.split(';') if s.strip()]
        
        all_results = []
        combined_results = {}
        
        for i, stmt in enumerate(statements):
            try:
                results = self.db_executor.execute(stmt)
                
                # For COUNT queries, store as a single value
                if 'COUNT(' in stmt.upper():
                    if results and len(results) > 0:
                        # Get the count value (first column of first row)
                        count_value = list(results[0].values())[0]
                        combined_results['count'] = count_value
                    else:
                        combined_results['count'] = 0
                
                # For LIST queries, store the rows
                elif 'ORDER BY' in stmt.upper() or 'SELECT' in stmt.upper():
                    if 'companies' in stmt.lower() and 'name' in stmt.lower():
                        combined_results['companies'] = results
                    else:
                        combined_results[f'results_{i}'] = results
                
                all_results.extend(results)
                
            except Exception as e:
                print(f"Error executing statement {i+1}: {e}")
                raise
        
        # If we have both count and companies, combine them in a special format
        if 'count' in combined_results and 'companies' in combined_results:
            return {
                "count": combined_results['count'],
                "companies": combined_results['companies'],
                "all_results": all_results
            }
        
        return all_results

    def run(self, question: str):
        try:
            schema = self.schema_service.fetch_schema()
            sql = self.llm_service.generate_sql(question, schema)
            
            sql = self._clean_sql(sql)
            
            # Fix SQL using actual schema (intelligent correction)
            sql = self._fix_sql_with_schema(sql, schema)
            
            sql = self._validate_sql(sql)
            sql = self._enforce_limit(sql)

            # Execute multiple statements if needed
            results = self._execute_multiple_statements(sql)

            return {
                "question": question,
                "sql": sql,
                "results": results,
                "row_count": len(results) if isinstance(results, list) else 1,
                "structured_results": results if not isinstance(results, dict) else results
            }
        except Exception as e:
            # Return error gracefully
            return {
                "question": question,
                "sql": f"-- Error: {str(e)}",
                "results": [],
                "row_count": 0,
                "error": str(e)
            }