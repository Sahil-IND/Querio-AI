# from app.services.vector_service import VectorService

# vs = VectorService()

# chunks = [
#     {"text": "Refunds allowed within 30 days", "chunk_index": 0, "token_count": 6},
#     {"text": "Orders are processed daily", "chunk_index": 1, "token_count": 5},
# ]

# embeddings = [[0.1]*768, [0.2]*768]

# vs.add_documents(chunks, embeddings, filename="policy.pdf")

# result = vs.search([0.1]*768)
# print(result)



# from app.services.embedding_service import EmbeddingService

# embedder = EmbeddingService()

# vec = embedder.embed_text("Refund policy allows returns in 30 days")

# print(len(vec))
# print(vec[:5])


from app.services.rag_service import RAGService

rag = RAGService()

result = rag.generate_answer(
    "What is the refund policy?"
)

print(result)