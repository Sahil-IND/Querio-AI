from app.services.document_service import DocumentService
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService

# Initialize services
doc_service = DocumentService()
embed_service = EmbeddingService()
vector_service = VectorService()

# ---- CHANGE THIS ----
FILE_PATH = "sample.txt"   # put a real file here
FILENAME = "sample.txt"
# ---------------------

# Load document
text = doc_service.load_text(FILE_PATH)

# Chunk document
chunks = doc_service.chunk_text(text)

# Generate embeddings
texts = [chunk["text"] for chunk in chunks]
embeddings = embed_service.generate_embeddings(texts)

# Store in vector DB
vector_service.add_documents(
    chunks=chunks,
    embeddings=embeddings,
    filename=FILENAME
)

print(f"✅ Indexed {len(chunks)} chunks from {FILENAME}")