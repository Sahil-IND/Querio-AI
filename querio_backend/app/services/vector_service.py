"""
Vector Service
Handles vector storage and retrieval using ChromaDB (local).
"""

from typing import List, Dict, Any
import logging
from pathlib import Path
import chromadb
import logging


BASE_DIR = Path(__file__).resolve().parents[2]  # project root
CHROMA_DIR = BASE_DIR / "data" / "chroma"
logger = logging.getLogger("rag_app.vector_service")

class VectorService:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path="data/chroma"
        )

        self.collection = self.client.get_or_create_collection(
            name="documents"
        )

        print("📦 Chroma collection count:", self.collection.count())


    def add_documents(
        self,
        chunks: List[Dict[str, Any]],
        embeddings: List[List[float]],
        filename: str,
        namespace: str = "default"  # kept for compatibility
    ):
        """
        Store document chunks with embeddings in ChromaDB.
        """
        if len(chunks) != len(embeddings):
            raise ValueError(
                f"Mismatch: {len(chunks)} chunks but {len(embeddings)} embeddings"
            )

        ids = []
        documents = []
        metadatas = []

        for chunk, embedding in zip(chunks, embeddings):
            vector_id = f"{filename}_{chunk['chunk_index']}"

            ids.append(vector_id)
            documents.append(chunk["text"])

            metadatas.append({
                "filename": filename,
                "chunk_index": chunk["chunk_index"],
                "token_count": chunk["token_count"],
                "start_char": chunk.get("start_char", 0),
                "end_char": chunk.get("end_char", 0),
                "headings": " > ".join(chunk.get("headings", [])) if chunk.get("headings") else "",
                "page_numbers": ",".join(map(str, chunk.get("page_numbers", []))) if chunk.get("page_numbers") else ""
            })


        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        # logger.info(f"Added {len(ids)} chunks to ChromaDB")
        print("📦 Count after add:", self.collection.count())

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 3,
        namespace: str = "default",  # ignored, for compatibility
        filter_dict: Dict[str, Any] | None = None
    ) -> Dict[str, Any]:
        """
        Search for similar vectors in ChromaDB.
        """
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=filter_dict
        )

        chunks = []
        for i in range(len(results["ids"][0])):
            chunks.append({
                "id": results["ids"][0][i],
                "score": results["distances"][0][i],
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i]
            })

        return {
            "chunks": chunks,
            "total_found": len(chunks)
        }

    def get_index_stats(self) -> Dict[str, Any]:
        """
        Get basic statistics about the ChromaDB collection.
        """
        count = self.collection.count()
        return {
            "total_vector_count": count,
            "collection_name": self.collection.name
        }

    def delete_by_filename(self, filename: str):
        """
        Delete all vectors associated with a filename.
        """
        self.collection.delete(
            where={"filename": filename}
        )

        logger.info(f"Deleted vectors for filename: {filename}")

    def delete_all_vectors(self) -> Dict[str, Any]:
        """
        Delete ALL vectors from the collection.
        """
        self.collection.delete(where={})


        logger.warning("Deleted ALL vectors from ChromaDB")

        return {
            "status": "success",
            "message": "All vectors deleted"
        }