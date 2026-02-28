class HybridCombinerService:
    def __init__(self, llm_service):
        self.llm_service = llm_service

    def combine(
        self,
        question: str,
        sql_result: dict,
        rag_result: dict
    ) -> str:

        prompt = f"""
You are an intelligent business assistant.

User Question:
{question}

Database Result:
{sql_result}

Documentation Result:
{rag_result}

Instructions:
- Combine both results into ONE clear and professional answer.
- If database contains numbers, include them naturally.
- If documentation explains policies, summarize clearly.
- Do NOT mention SQL or internal system.
- Do NOT output JSON.
- Provide a clean, human-friendly response.
"""

        response = self.llm_service.generate_text(prompt)

        return response.strip()