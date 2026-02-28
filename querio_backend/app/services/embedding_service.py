"""
Embedding Service
Generates text embeddings using Ollama (local).
"""

from typing import List
import logging
import ollama

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for generating text embeddings using Ollama."""

    def __init__(self, model: str = "nomic-embed-text-v2-moe"):
        """
        Initialize the embedding service.

        Args:
            model: Ollama embedding model name
        """
        self.model = model
        self.dimensions = 768  # nomic-embed-text-v2-moe output size

        logger.info(f"EmbeddingService initialized with model: {self.model}")

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts.

        Args:
            texts: List of text strings

        Returns:
            List of embedding vectors
        """
        if not texts:
            return []

        embeddings = []

        for text in texts:
            try:
                response = ollama.embeddings(
                    model=self.model,
                    prompt=text
                )
                embeddings.append(response["embedding"])
            except Exception as e:
                raise Exception(f"Failed to generate embedding: {str(e)}")

        return embeddings

    def generate_single_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        """
        return self.generate_embeddings([text])[0]

    def get_embedding_dimension(self) -> int:
        """
        Get embedding dimension.
        """
        return self.dimensions