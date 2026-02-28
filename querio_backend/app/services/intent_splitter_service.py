import json


class IntentSplitterService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def split(self, question: str):
        prompt = f"""
        You are an AI system that separates user questions into database queries and document questions.

        Instructions:
        1. If part of the question asks for counts, numbers, records, totals → that is SQL.
        2. If part of the question asks to explain policies, rules, descriptions → that is RAG.
        3. If both exist, split them clearly.
        4. If only one exists, set the other to null.

        Return STRICT JSON only.
        Do NOT add explanation.
        Do NOT wrap in markdown.

        Format:
        {{
          "sql_part": string or null,
          "rag_part": string or null
        }}

        Example:

        Question:
        "How many customers do we have and explain refund policy"

        Output:
        {{
          "sql_part": "How many customers do we have?",
          "rag_part": "Explain refund policy."
        }}

        Now process:

        Question:
        {question}
        """

        response = self.llm_service.generate_text(prompt)

        try:
            data = json.loads(response)
            return {
                "sql_part": data.get("sql_part"),
                "rag_part": data.get("rag_part")
            }
        except Exception:
            # Fallback safety
            return {
                "sql_part": question,
                "rag_part": None
            }