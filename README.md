# 🚀 Querio - Hybrid AI Intelligence Platform



<div align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white" alt="Ollama" />
  <img src="https://img.shields.io/badge/ChromaDB-8A2BE2?style=for-the-badge&logo=chroma&logoColor=white" alt="ChromaDB" />
</div>

---

## 📋 Overview

Querio is an AI intelligence platform that bridges the gap between structured and unstructured data. It combines three powerful capabilities into one seamless experience:

| Component         | Capability                        | Technology                        |
|------------------|-----------------------------------|-----------------------------------|
| 🧠 SQL Intelligence | Natural language → SQL queries    | Ollama (Gemma2 9B) + PostgreSQL   |
| 📄 Document RAG   | Semantic search on documents      | ChromaDB + Embeddings             |
| 🔀 Hybrid Fusion  | Combine both sources into one answer | LLM-powered synthesis            |

Built for the **AMD RYZEN Slingshot 2026 Hackathon** under the "Future of Work & Productivity" theme.

## ✨ Key Features

### 🔍 Intelligent Query Processing
- **Intent Detection** – Automatically routes queries to SQL, RAG, or Hybrid mode
- **Context Awareness** – Understands complex questions combining multiple intents
- **Smart Splitting** – Breaks hybrid questions into SQL + RAG components

### 📊 Enterprise-Grade SQL
- **Text-to-SQL** – Natural language to precise SQL queries
- **Schema Validation** – Validates against actual database schema
- **Intelligent LIMIT** – Adds LIMIT only when appropriate (never to aggregates)
- **Multi-Statement Support** – Handles complex questions needing COUNT + LIST

### 📚 Document Intelligence
- **Multiple Formats** – Supports TXT, PDF, DOCX, MD
- **Semantic Chunking** – Intelligent document splitting
- **Vector Search** – ChromaDB for fast similarity search
- **Source Attribution** – Shows which documents provided the answer

### 🎯 Hybrid Excellence
- **Parallel Execution** – Runs SQL and RAG simultaneously
- **Executive Summaries** – LLM-powered answer synthesis
- **Transparency Panel** – Shows raw SQL, sources, and reasoning

### 🎨 Beautiful Enterprise UI
- **Dark Theme** – Professional glassmorphism design
- **Responsive** – Works on desktop, tablet, and mobile
- **Animations** – Smooth Framer Motion transitions
- **Query History** – Recent queries with one-click replay
- **Execution Timeline** – Visual step-by-step processing

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    React + Vite + TailwindCSS                    │
│                         Port: 5173                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │ API Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                               │
│                         FastAPI                                   │
│                         Port: 8000                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
┌────────────────────────────┐   ┌────────────────────────────┐
│     QUERY ROUTER           │   │    INTENT SPLITTER         │
│  - SQL Detection           │   │  - Hybrid Question Split   │
│  - RAG Detection           │   │  - SQL Part Extraction     │
│  - Hybrid Detection        │   │  - RAG Part Extraction     │
└────────────┬───────────────┘   └────────────┬───────────────┘
             │                                │
             └───────────────┬────────────────┘
                             ▼
        ┌────────────────────────────────────┐
        │        PARALLEL EXECUTION          │
        └────────────┬───────────────────────┘
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
┌────────────────────┐      ┌────────────────────┐
│   SQL PIPELINE     │      │   RAG PIPELINE     │
│                    │      │                    │
│  ┌─────────────┐   │      │  ┌─────────────┐   │
│  │ Text-to-SQL │   │      │  │   Embed     │   │
│  │   (Ollama)  │   │      │  │  Documents  │   │
│  └──────┬──────┘   │      │  └──────┬──────┘   │
│         ▼          │      │         ▼          │
│  ┌─────────────┐   │      │  ┌─────────────┐   │
│  │  Validate   │   │      │  │   Vector    │   │
│  │    & Fix    │   │      │  │    Search   │   │
│  └──────┬──────┘   │      │  └──────┬──────┘   │
│         ▼          │      │         ▼          │
│  ┌─────────────┐   │      │  ┌─────────────┐   │
│  │   Execute   │   │      │  │   Generate  │   │
│  │   (Postgres)│   │      │  │   Response  │   │
│  └──────┬──────┘   │      │  └──────┬──────┘   │
│         │          │      │         │          │
│  ┌──────▼──────┐   │      │  ┌──────▼──────┐   │
│  │  Multiple   │   │      │  │   Source    │   │
│  │  Statements │   │      │  │ Attribution │   │
│  └─────────────┘   │      │  └─────────────┘   │
└──────────┬─────────┘      └──────────┬──────────┘
           │                           │
           └───────────────┬───────────┘
                           ▼
              ┌────────────────────────┐
              │   HYBRID COMBINER      │
              │   (Ollama Synthesis)   │
              └───────────┬────────────┘
                          ▼
              ┌────────────────────────┐
              │   EXECUTIVE SUMMARY    │
              │   + Transparency Data  │
              └────────────────────────┘
```

## 🛠️ Tech Stack

### Backend

| Technology    | Purpose                           | Version   |
|--------------|-----------------------------------|-----------|
| FastAPI      | Web framework                     | 0.104.1   |
| PostgreSQL   | Primary database                  | 15+       |
| Supabase     | PostgreSQL hosting                | -         |
| ChromaDB     | Vector database                   | 0.4.22    |
| Ollama       | Local LLM runner                  | latest    |
| Gemma2       | LLM model                         | 9B        |
| psycopg2     | PostgreSQL driver                 | 2.9.9     |
| python-multipart | File uploads                  | 0.0.6     |

### Frontend

| Technology     | Purpose         | Version   |
|---------------|-----------------|-----------|
| React         | UI framework    | 18.2.0    |
| Vite          | Build tool      | 5.0.0     |
| TailwindCSS   | Styling         | 3.4.1     |
| Framer Motion | Animations      | 10.16.16  |
| Axios         | HTTP client     | 1.6.2     |
| React Router  | Routing         | 6.20.1    |
| Lucide React  | Icons           | 0.309.0   |
| React Hot Toast | Notifications | 2.4.1     |
| React Dropzone | File upload UI | 14.2.3    |

## 📁 Project Structure

```
querio/
├── backend/                           # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # API endpoints
│   │   ├── config.py                   # Configuration
│   │   ├── utils.py                     # Utilities
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── ollama_llm_service.py    # LLM interactions
│   │       ├── text_to_sql_service.py   # SQL generation
│   │       ├── rag_service.py            # RAG pipeline
│   │       ├── hybrid_combiner_service.py # Hybrid synthesis
│   │       ├── intent_splitter_service.py # Question splitting
│   │       ├── router_service.py          # Query routing
│   │       ├── db_executor.py             # Database execution
│   │       ├── sql_schema_service.py      # Schema fetching
│   │       ├── document_service.py        # Document processing
│   │       ├── embedding_service.py       # Embedding generation
│   │       └── vector_service.py          # ChromaDB operations
│   ├── data/
│   │   ├── uploads/                    # Uploaded documents
│   │   └── chroma/                      # ChromaDB storage
│   ├── requirements.txt                  # Python dependencies
│   └── .env                               # Environment variables
│
├── frontend/                            # React Frontend
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── components/                    # UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── QueryInput.jsx
│   │   │   ├── RouteBadge.jsx
│   │   │   ├── ExecutionTimeline.jsx
│   │   │   ├── SqlPanel.jsx
│   │   │   ├── RagPanel.jsx
│   │   │   ├── HybridPanel.jsx
│   │   │   ├── TransparencyPanel.jsx
│   │   │   ├── UploadPanel.jsx
│   │   │   ├── QueryHistory.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/                         # Page Components
│   │   │   ├── HomePage.jsx
│   │   │   ├── QueryPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── DocsPage.jsx
│   │   │   └── PricingPage.jsx
│   │   ├── services/                       # API Services
│   │   │   └── api.js
│   │   ├── App.jsx                          # Main App
│   │   ├── main.jsx                          # Entry point
│   │   └── index.css                          # Global styles
│   ├── package.json                           # Node dependencies
│   ├── vite.config.js                          # Vite config
│   ├── tailwind.config.js                      # Tailwind config
│   └── postcss.config.js                       # PostCSS config
│
├── .gitignore                                   # Git ignore rules
└── README.md                                    # This file
```

## 🚀 Quick Start Guide

### Prerequisites

| Requirement     | Version   | Check Command                |
|----------------|-----------|------------------------------|
| Python         | 3.9+      | `python --version`           |
| Node.js        | 18+       | `node --version`             |
| PostgreSQL     | 15+       | `psql --version`             |
| Ollama         | latest    | `ollama --version`           |
| Git            | latest    | `git --version`              |

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/querio.git
cd querio
```

### Step 2: Database Setup (Supabase/PostgreSQL)

**Option A: Local PostgreSQL**

```sql
-- Run this SQL to create tables
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    industry TEXT,
    size TEXT CHECK (size IN ('startup', 'smb', 'mid-market', 'enterprise')),
    country TEXT,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    churn_risk DECIMAL(3,2) DEFAULT 0.0,
    lifetime_value DECIMAL(10,2) DEFAULT 0.0
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'billing', 'member', 'viewer')),
    last_active TIMESTAMP,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    plan_name TEXT CHECK (plan_name IN ('free', 'starter', 'pro', 'enterprise')),
    billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
    amount DECIMAL(10,2) NOT NULL,
    seats INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    current_period_start DATE,
    current_period_end DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    subscription_id INT REFERENCES subscriptions(id),
    invoice_number TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
    paid_at TIMESTAMP,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    subject TEXT NOT NULL,
    category TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO companies (name, domain, industry, size, country, plan, churn_risk, lifetime_value) VALUES
('Acme Corp', 'acme.com', 'Technology', 'enterprise', 'USA', 'enterprise', 0.12, 125000.00),
('TechFlow Inc', 'techflow.io', 'SaaS', 'mid-market', 'USA', 'pro', 0.08, 45000.00),
('StartupHub', 'startuphub.io', 'Technology', 'startup', 'India', 'starter', 0.45, 5200.00),
('SecureNet', 'securenet.org', 'Cybersecurity', 'enterprise', 'USA', 'enterprise', 0.07, 430000.00);
```

**Option B: Supabase (Cloud)**

1. Create account at supabase.com
2. Create new project
3. Run the SQL above in SQL editor
4. Get connection details from **Project Settings → Database**

### Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "SUPABASE_DB_HOST=your_db_host
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=your_db_name
SUPABASE_DB_USER=your_db_user
SUPABASE_DB_PASSWORD=your_db_password
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:9b" > .env

# Edit .env with your actual credentials
```

**requirements.txt:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
psycopg2-binary==2.9.9
python-multipart==0.0.6
chromadb==0.4.22
ollama==0.1.8
sentence-transformers==2.2.2
pypdf==3.17.4
python-docx==1.1.0
```

### Step 4: Ollama Setup

```bash
# Install Ollama from https://ollama.ai

# Pull the Gemma2 model
ollama pull gemma2:9b

# Verify it's running
ollama list

# The service runs on http://localhost:11434 by default
```

### Step 5: Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

**package.json dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.309.0",
    "react-hot-toast": "^2.4.1",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0"
  }
}
```

### Step 6: Run Everything

**Terminal 1 – Backend**
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

uvicorn app.main:app --reload --port 8000
```
- Backend will run at: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

**Terminal 2 – Frontend**
```bash
cd frontend
npm run dev
```
- Frontend will run at: `http://localhost:5173`

**Terminal 3 – Ollama (if not running)**
```bash
ollama serve
```

## 🎯 Sample Demo Queries

### **SQL Only Queries**
| Query | Expected SQL |
|-------|--------------|
| "How many companies do we have?" | `SELECT COUNT(*) FROM companies;` |
| "What is total revenue?" | `SELECT SUM(amount) FROM invoices;` |
| "Show companies with churn risk > 0.3" | `SELECT name, churn_risk FROM companies WHERE churn_risk > 0.3;` |
| "List top 5 companies by lifetime value" | `SELECT name, lifetime_value FROM companies ORDER BY lifetime_value DESC LIMIT 5;` |
| "What's the average churn risk?" | `SELECT AVG(churn_risk) FROM companies;` |

### **RAG Only Queries**
| Query | Knowledge Base Source |
|-------|-----------------------|
| "What is the refund policy?" | Section 5 - Refund Policy |
| "Explain our support hours" | Section 4 - Support Policy |
| "Describe enterprise features" | Section 2.2 - Secure Gateway |
| "What are the pricing plans?" | Section 3 - Pricing & Plans |
| "Tell me about the cancellation policy" | Section 8 - Cancellation Policy |

### **Hybrid Queries (The Magic!)**
| Query | SQL Part | RAG Part |
|-------|----------|-----------|
| "How many high-risk companies and explain retention strategy?" | `SELECT COUNT(*) FROM companies WHERE churn_risk > 0.3;` | "Explain retention strategy for high-risk companies" |
| "What's total revenue and describe pricing policy?" | `SELECT SUM(amount) FROM invoices;` | "Describe pricing policy" |
| "Show top customers and explain enterprise benefits" | `SELECT name, lifetime_value FROM companies ORDER BY lifetime_value DESC LIMIT 5;` | "Explain enterprise benefits" |
| "How many open support tickets and what's our SLA?" | `SELECT COUNT(*) FROM support_tickets WHERE status = 'open';` | "What's our SLA policy?" |
| "List companies with churn > 0.4 and explain cancellation policy" | `SELECT name, churn_risk FROM companies WHERE churn_risk > 0.4;` | "Explain cancellation policy" |

### **Complex Multi-Statement Queries**
| Query | Multiple SQL Statements |
|-------|-------------------------|
| "How many high-risk companies and their names?" | `SELECT COUNT(*) FROM companies WHERE churn_risk > 0.3; SELECT name, churn_risk FROM companies WHERE churn_risk > 0.3;` |
| "Show total revenue and top 3 customers" | `SELECT SUM(amount) FROM invoices; SELECT name, lifetime_value FROM companies ORDER BY lifetime_value DESC LIMIT 3;` |

## 🖥️ Using the Application

1. **Upload Documents**
   - Navigate to Upload page
   - Drag & drop or click to select files
   - Supported formats: `.txt`, `.pdf`, `.docx`, `.md`
   - View upload status and chunk count

2. **Ask Questions**
   - Go to Intelligence Hub
   - Type your question in natural language
   - Watch the execution timeline animate
   - View results in beautifully formatted panels

3. **Interpret Results**
   - **SQL Mode**: Data table with results, collapsible raw SQL, row count indicator
   - **RAG Mode**: AI-generated answer, source documents with relevance scores, preview of source chunks
   - **Hybrid Mode**: Executive Summary - Combined answer, SQL Panel - Structured results, RAG Panel - Document insights, Transparency Panel - Raw SQL + sources

4. **Use Advanced Features**
   - Query History - Click clock icon to see recent queries
   - Transparency Mode - Expand to see raw SQL and sources
   - Execution Timeline - Watch each processing step
   - Copy SQL - Click to copy generated SQL

## 🔧 Configuration Options

**Backend Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| SUPABASE_DB_HOST | Database host | - |
| SUPABASE_DB_PORT | Database port | 5432 |
| SUPABASE_DB_NAME | Database name | - |
| SUPABASE_DB_USER | Database user | - |
| SUPABASE_DB_PASSWORD | Database password | - |
| OLLAMA_BASE_URL | Ollama API URL | http://localhost:11434 |
| OLLAMA_MODEL | LLM model | gemma2:9b |

**Frontend Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Backend API URL | http://localhost:8000 |

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:8000/health
# Response: {"status": "ok"}
```

### Upload Document
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@/path/to/document.txt"
```

### Query
```bash
curl -X POST "http://localhost:8000/query?question=How%20many%20companies%20do%20we%20have%3F&top_k=3"
```

## 📬 Contact
Your Name - Sahil Chopra  
EmailID - sahilchopra1975@gmail.com  
LinkedIn - https://www.linkedin.com/in/sahil0408/
