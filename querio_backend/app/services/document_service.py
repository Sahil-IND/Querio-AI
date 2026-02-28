"""
Document Service
Handles document loading and chunking.
"""

import os
from typing import List, Dict
from pathlib import Path

from PyPDF2 import PdfReader


class DocumentService:
    def __init__(self, upload_dir: str = "data/uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)

    def save_file(self, filename: str, content: bytes) -> str:
        """
        Save uploaded file locally.
        """
        file_path = os.path.join(self.upload_dir, filename)
        with open(file_path, "wb") as f:
            f.write(content)
        return file_path

    def load_text(self, file_path: str) -> str:
        """
        Extract text from PDF or TXT.
        """
        if file_path.endswith(".txt"):
            return Path(file_path).read_text(encoding="utf-8")

        if file_path.endswith(".pdf"):
            reader = PdfReader(file_path)
            pages = [page.extract_text() or "" for page in reader.pages]
            return "\n".join(pages)

        raise ValueError("Unsupported file type")

    def chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
        overlap: int = 50
    ) -> List[Dict]:
        """
        Split text into overlapping chunks.
        """
        chunks = []
        start = 0
        index = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]

            chunks.append({
                "text": chunk_text,
                "chunk_index": index,
                "token_count": len(chunk_text.split())
            })

            start = end - overlap
            index += 1

        return chunks