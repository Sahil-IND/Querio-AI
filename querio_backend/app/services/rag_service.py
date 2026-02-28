"""
RAG (Retrieval-Augmented Generation) Service
Combines vector search with Ollama LLM generation to answer questions from documents.
"""

from typing import List, Dict, Any
import logging
import ollama

from app.services.vector_service import VectorService
from app.services.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)


class RAGService:
    """Service for Retrieval-Augmented Generation using Ollama."""

    def __init__(self, llm_model: str = "gemma2:9b"):
        """
        Initialize RAG service.
        """
        self.embedding_service = EmbeddingService()
        self.vector_service = VectorService()

        self.llm_model = llm_model
        self.temperature = 0.1

        logger.info(f"RAGService initialized with model: {self.llm_model}")

    def generate_answer(
        self,
        question: str,
        top_k: int = 3,
        include_sources: bool = True
    ) -> Dict[str, Any]:
        """
        Full RAG pipeline: retrieve relevant chunks and generate an answer.
        """
        try:
            # Step 1: Embed question
            query_embedding = self.embedding_service.generate_single_embedding(question)

            # Step 2: Vector search
            search_results = self.vector_service.search(
                query_embedding=query_embedding,
                top_k=top_k
            )

            chunks = search_results.get("chunks", [])

            if not chunks:
                return {
                    "question": question,
                    "answer": "I don't have enough information to answer that based on the uploaded documents.",
                    "sources": [],
                    "chunks_used": 0,
                    "model": self.llm_model
                }

            # Step 3: Build context
            context = self._build_context(chunks)

            # Step 4: Create prompt
            prompt = self._create_prompt(question, context)

            # Step 5: Generate answer using Ollama
            response = ollama.chat(
                model=self.llm_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful assistant that answers questions strictly "
                            "based on the provided context. "
                            "If the context does not contain enough information, say so clearly."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                options={"temperature": self.temperature}
            )

            answer = response["message"]["content"]

            result = {
                "question": question,
                "answer": answer,
                "chunks_used": len(chunks),
                "model": self.llm_model
            }

            if include_sources:
                result["sources"] = self._format_sources(chunks)

            return result

        except Exception as e:
            raise Exception(f"RAG pipeline failed: {str(e)}")

    def _build_context(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Build context string from retrieved chunks.
        """
        context_parts = []

        for i, chunk in enumerate(chunks, 1):
            metadata = chunk.get("metadata", {})
            filename = metadata.get("filename", "Unknown")
            text = chunk.get("text", "")
            score = chunk.get("score", 0.0)

            context_parts.append(
                f"[Source {i}: {filename} | relevance={score:.3f}]\n{text}\n"
            )

        return "\n".join(context_parts)

    def _create_prompt(self, question: str, context: str) -> str:
        """
        Create LLM prompt.
        """
        return f"""
Use the context below to answer the question.

If the answer is not present in the context, say:
"I don't have enough information based on the provided documents."

Context:
{context}

Question:
{question}

Answer:
""".strip()

    def _format_sources(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Format source metadata for output.
        """
        sources = []

        for chunk in chunks:
            metadata = chunk.get("metadata", {})
            sources.append({
                "filename": metadata.get("filename", "Unknown"),
                "chunk_index": metadata.get("chunk_index", 0),
                "relevance_score": chunk.get("score", 0.0),
                "preview": chunk.get("text", "")[:200] + "..."
            })

        return sources