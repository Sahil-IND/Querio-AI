"""
Hybrid RAG + Text-to-SQL API (Ollama + Supabase + Chroma)
Clean Version – No Cache, No Deployment Extras
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from pathlib import Path
import shutil

from app.services.document_service import DocumentService
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.services.rag_service import RAGService
from app.services.text_to_sql_service import TextToSQLService
from app.services.router_service import QueryRouter
from app.services.ollama_llm_service import OllamaLLMService
from app.services.db_executor import DBExecutor
from app.services.sql_schema_service import SQLSchemaService
from app.services.hybrid_combiner_service import HybridCombinerService
from app.services.intent_splitter_service import IntentSplitterService

app = FastAPI(title="Hybrid RAG + SQL API")

# =========================
# CORS Configuration - ADD THIS SECTION
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Initialize Services
# =========================

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

embedding_service = EmbeddingService()
vector_service = VectorService()
rag_service = RAGService()
document_service = DocumentService()
llm_service = OllamaLLMService()
db_executor = DBExecutor()
schema_service = SQLSchemaService()
sql_service = TextToSQLService(
    llm_service=llm_service,
    db_executor=db_executor,
    schema_service=schema_service
)
hybrid_combiner = HybridCombinerService(llm_service)
intent_splitter = IntentSplitterService(llm_service)


# =========================
# Health
# =========================

@app.get("/health")
def health():
    return {"status": "ok"}


# =========================
# Upload Document
# =========================

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Parse + Chunk
    text = document_service.load_text(str(file_path))
    chunks = document_service.chunk_text(text)

    # Embed
    texts = [c["text"] for c in chunks]
    embeddings = embedding_service.generate_embeddings(texts)

    # Store in Chroma
    vector_service.add_documents(
        chunks=chunks,
        embeddings=embeddings,
        filename=file.filename
    )

    return {
        "status": "uploaded",
        "chunks": len(chunks)
    }


# =========================
# RAG Query
# =========================

@app.post("/query/documents")
async def query_documents(question: str, top_k: int = 3):

    result = rag_service.generate_answer(
        question=question,
        top_k=top_k
    )

    return result


# =========================
# SQL Query
# =========================

@app.post("/query/sql")
def query_sql(question: str):

    result = sql_service.run(question)

    return result


# =========================
# Unified Hybrid Query
# =========================

@app.post("/query")
async def unified_query(question: str, top_k: int = 3):

    route = QueryRouter.route(question)

    response = {
        "question": question,
        "route": route
    }

    # ---------- SQL ----------
    if route == "SQL":
        response["sql_result"] = sql_service.run(question)

    # ---------- DOCUMENTS ----------
    elif route == "DOCUMENTS":
        response["rag_result"] = rag_service.generate_answer(
            question=question,
            top_k=top_k
        )

    # ---------- HYBRID ----------
    elif route == "HYBRID":

        # ---- Step 1: Split the question ----
        split = intent_splitter.split(question)
        print("SPLIT RESULT:", split)

        sql_result = None
        rag_result = None

        # ---- Step 2: Call SQL only if needed ----
        if split["sql_part"]:
            sql_result = sql_service.run(split["sql_part"])

        # ---- Step 3: Call RAG only if needed ----
        if split["rag_part"]:
            rag_result = rag_service.generate_answer(
                question=split["rag_part"],
                top_k=top_k
            )

        # ---- Step 4: Combine ----
        final_answer = hybrid_combiner.combine(
            question=question,
            sql_result=sql_result,
            rag_result=rag_result
        )

        response["answer"] = final_answer
        response["raw_sql"] = sql_result
        response["raw_rag"] = rag_result

    return response


# =========================
# Clear Vectors
# =========================

@app.delete("/vectors/clear")
def clear_vectors():
    vector_service.delete_all_vectors()
    return {"status": "cleared"}