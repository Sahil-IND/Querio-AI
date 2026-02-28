# 🚀 text2sql_backend

A **Hybrid AI Backend** that combines:

- 🧠 **Text-to-SQL** (Natural Language → SQL)
- 📄 **Document RAG** (Retrieval-Augmented Generation)
- 🔀 **Intelligent Query Routing** (SQL / Documents / Hybrid)
- 🤖 **Local LLM using Ollama** (Gemma / LLaMA models)
- 🗄 **Supabase** (PostgreSQL)
- 📚 **ChromaDB** (Vector Store)

---

## 🧠 What This Project Does

The system intelligently understands user questions and decides:

- If it needs database data → generates & runs SQL
- If it needs document knowledge → uses RAG
- If it needs both → combines them into one clean answer

**Example Hybrid Query:**

> How many customers do we have and explain refund policy?

**System Flow:**

1. Splits intent
2. Runs safe SQL query
3. Retrieves relevant document chunks
4. Uses Ollama LLM to merge both answers

---

## 🏗 Architecture

```
User Query
   ↓
Intent Splitter
   ↓
SQL Service        RAG Service
   ↓                    ↓
Hybrid Combiner (LLM)
   ↓
Final Answer
```

---

## 🛠 Tech Stack

- FastAPI
- Supabase (PostgreSQL)
- ChromaDB
- Ollama (Local LLM)
- Python

---

## 📦 Core Features

### ✅ Text-to-SQL

- Natural language → SQL
- Schema-aware generation
- SQL validation
- `LIMIT` enforcement
- Single statement restriction

### ✅ Document RAG

- Upload PDF / TXT
- Automatic chunking
- Vector embeddings
- Semantic search
- Source attribution

### ✅ Hybrid Queries

- Proper LLM-based intent splitting
- Runs SQL + RAG independently
- Merges results using LLM
- Returns clean unified response

---

## 🔐 Safety Features

- Multiple SQL statement blocking
- `SELECT`-only enforcement
- `LIMIT` auto-append
- Input validation
- Error handling

---

## 🚀 How To Run Locally

1. **Install Dependencies**

```sh
pip install -r requirements.txt
```

2. **Start Ollama**

Make sure Ollama is installed. Pull a model (example):

```sh
ollama pull gemma2:9b
```

Start Ollama (usually runs automatically on port `11434`).

3. **Setup Environment Variables**

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OLLAMA_BASE_URL=http://localhost:11434
```

4. **Run FastAPI Server**

```sh
uvicorn app.main:app --reload
```

Open the interactive docs:

```
http://localhost:8000/docs
```

---

## 📄 API Endpoints

- `POST /upload` – upload document for RAG.
- `POST /query` – unified intelligent endpoint.

  **Example request:**

  ```json
  {
    "question": "How many customers do we have and explain refund policy?",
    "top_k": 3
  }
  ```

  **Returns:**
  - Route type
  - SQL result (if applicable)
  - RAG result (if applicable)
  - Final combined answer (for Hybrid)

- `POST /query/documents` – RAG-only endpoint.
- `POST /query/sql` – SQL-only endpoint.

---

## 🧪 Example Queries

**SQL Only**

- How many customers do we have?
- What is total revenue?
- Who is the highest spending customer?

**RAG Only**

- What is the refund policy?
- Explain course duration.
- What is customer support process?

**Hybrid**

- How many customers do we have and explain refund policy?
- What is total revenue and describe pricing policy?
- Who is top customer and what are return rules?

---

## 📂 Project Structure

```
app/
 ├── main.py
 ├── config.py
 ├── services/
 │   ├── text_to_sql_service.py
 │   ├── rag_service.py
 │   ├── hybrid_combiner_service.py
 │   ├── intent_splitter_service.py
 │   ├── embedding_service.py
 │   ├── vector_service.py
 │   ├── document_service.py
 │   └── sql_schema_service.py
data/
 ├── chroma/
 └── uploads/
```

---

## 🎯 Why This Project Is Valuable

This project demonstrates:

- LLM System Design
- Hybrid AI Pipelines
- Safe SQL generation
- RAG implementation
- Backend architecture design
- Real-world AI integration

---

## 📈 Future Improvements

- Async parallel SQL + RAG execution
- Streaming responses
- Authentication layer
- Docker deployment
- Cloud hosting

---

## 🏆 Learning Outcomes

Through this project I learned:

- How to integrate LLMs into backend systems
- How to build a hybrid AI architecture
- How to validate and secure AI-generated SQL
- How to combine structured + unstructured data reasoning

---

## 💡 Built With

FastAPI · Supabase · ChromaDB · Ollama
