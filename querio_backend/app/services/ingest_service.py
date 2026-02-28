from typing import List
from pathlib import Path

from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService


class IngestService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.vector_service = VectorService()

    def ingest_text_file(self, file_path: str):
        """
        Ingest a plain text file into the vector store.
        """
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"{file_path} not found")

        text = path.read_text(encoding="utf-8")

        # Simple chunking (good enough for hackathon)
        chunks = self._chunk_text(text)

        texts = [chunk["text"] for chunk in chunks]

        embeddings = self.embedding_service.generate_embeddings(texts)

        self.vector_service.add_documents(
            chunks=chunks,
            embeddings=embeddings,
            filename=path.name
        )

        return {
            "filename": path.name,
            "chunks_indexed": len(chunks)
        }

    def _chunk_text(self, text: str, chunk_size: int = 500) -> List[dict]:
        """
        Very simple character-based chunking.
        """
        chunks = []
        start = 0
        index = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]

            chunks.append({
                "chunk_index": index,
                "text": chunk_text,
                "token_count": len(chunk_text),
                "start_char": start,
                "end_char": end
            })

            start = end
            index += 1

        return chunks