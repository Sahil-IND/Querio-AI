class HybridService:
    def __init__(self, router, sql_service, rag_service):
        self.router = router
        self.sql_service = sql_service
        self.rag_service = rag_service

    def run(self, question: str):

        route = self.router.route(question)

        if route == "SQL":
            sql_result = self.sql_service.run(question)
            sql_result["mode"] = "SQL"
            return sql_result

        elif route == "DOCUMENTS":
            rag_result = self.rag_service.run(question)
            return {
                "question": question,
                "mode": "DOCUMENTS",
                "answer": rag_result
            }

        elif route == "HYBRID":
            sql_result = self.sql_service.run(question)
            rag_result = self.rag_service.run(question)

            return {
                "question": question,
                "mode": "HYBRID",
                "sql_part": sql_result,
                "document_part": rag_result
            }

        else:
            return {
                "error": "Routing failed"
            }