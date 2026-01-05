# Startify_AI
Startify--AI is an AI-powered startup automation platform that transforms raw startup ideas into investor-ready business plans and pitch decks. It integrates NLP, Agentic AI (using LangChain), and Generative AI to perform market analysis, competitor evaluation, and financial estimation in an automated and scalable manner.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      	│
│  │  Dashboard   │  │ Landing Page │  │     Auth     │     	│
│  └──────┬───────┘  └──────────────┘  └──────────────┘      	│
│         │                                                   │
│         │  API Service (axios)                              │
│         └──────────────┬──────────────────────────────────┐ │
└────────────────────────┼────────────────────────────────┼─--┘
                         │                                │
                     HTTP/JSON                    	 WebSocket
                         │                           		  |
┌────────────────────────┼────────────────────────────────┼-─┐
│                        ▼                                ▼  │
│              ┌─────────────────┐                           │
│              │   FastAPI App   │                           │
│              └────────┬────────┘                           │
│                       │                                    │
│       ┌───────────────┼───────────────┐                    │
│       │               │               │                    │
│   ┌───▼────┐    ┌────▼─────┐   ┌────▼─────┐                │
│   │  NLP   │    │ Research │   │Generator │                │
│   │ Parser │    │  Agent   │   │  Agent   │                │
│   └───┬────┘    └────┬─────┘   └────┬─────┘                │
│       │              │              │                      │
│       └──────────────┼──────────────┘                      │
│                      │                                     │
│                 ┌────▼─────┐                               │
│                 │Assembler │                               │
│                 └────┬─────┘                               │
│                      │                                     │
│              ┌───────▼────────┐                            │
│              │  SQLite DB     │                            │
│              │  File Storage  │                            │
│              └────────────────┘                            │
│                                                            │
│                BACKEND (FastAPI + Python)                  │
└────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
startify_1/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app with CORS & static files
│   │   ├── config.py            # Environment configuration
│   │   ├── api.py               # API endpoints
│   │   ├── models.py            # Pydantic & SQLAlchemy models
│   │   ├── db.py                # Database setup & helpers
│   │   ├── nlp_parser.py        # spaCy NLP parsing
│   │   ├── research_agent.py    # Web scraping & trends
│   │   ├── generator_agent.py   # GPT-2 content generation
│   │   ├── assembler.py         # PPTX/PDF/ZIP creation
│   │   └── utils.py             # Cache utilities
│   ├── outputs/                 # Generated files
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Backend container
│   └── startify.db              # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx    # Main dashboard (UPDATED)
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AuthenticationPage.tsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js           # Axios API client (NEW)
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── .env                     # Frontend env variables
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── package.json             # Node dependencies
└── docker-compose.yml           # Container orchestration

```

---

## 🔌 API Endpoints

### **Core Workflow Endpoints**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `POST` | `/api/generate` | Submit startup idea for analysis | `{email, idea}` | `{job_id, status}` |
| `GET` | `/api/status/{job_id}` | Check processing status | - | `{job_id, status, progress}` |
| `GET` | `/api/download/{job_id}` | Get download URL for results | - | `{url}` |
| `GET` | `/health` | Health check | - | `{status, service, version}` |
| `GET` | `/` | API information | - | `{message, docs, health}` |

### **File Serving**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/files/{job_id}/{filename}` | Download generated files |
| `GET` | `/files/{job_id}.zip` | Download complete package |

### **API Documentation**

- **Swagger UI**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`

---

## 🔄 Data Flow

### **1. Idea Submission Flow**

```
User Input (Dashboard)
    ↓
POST /api/generate
    ↓
Create User & Idea Records
    ↓
Start Background Task
    ↓
Return job_id immediately
```

### **2. Background Processing Flow**

```
process_idea_job(job_id, idea_id, email)
    ↓
1. Update status → "processing"
    ↓
2. NLP Parsing (spaCy)
    ↓
3. Research Agent
   - Web scraping
   - Google Trends
   - Competitor analysis
    ↓
4. Generator Agent
   - Brand names (10)
   - Slogans (5)
   - Logo prompts (5)
   - Ad copies (5)
   - Pitch deck sections (7)
    ↓
5. Assembler
   - pitch_deck.pptx
   - summary.pdf
   - assets.json
   - Create ZIP
    ↓
6. Save to Database
    ↓
7. Update status → "completed"
```

### **3. Frontend Polling Flow**

```
Submit Idea
    ↓
Receive job_id
    ↓
Poll /api/status/{job_id} every 5s
    ↓
status === "completed"?
    ↓
Fetch /api/download/{job_id}
    ↓
Display Download Button
```

---

## 🔧 Configuration

### **Backend Environment Variables** (`.env`)

```bash
# Database
DATABASE_URL=sqlite:///./startify.db

# API Keys (optional)
OPENAI_API_KEY=your_key_here
SERPAPI_KEY=your_key_here

# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Models
USE_OPENAI=false
USE_LOCAL_MODELS=true
MODEL_CACHE_DIR=./model_cache

# File Storage
OUTPUT_DIR=outputs
MAX_FILE_SIZE_MB=50
```

### **Frontend Environment Variables** (`.env`)

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Startify AI
VITE_ENABLE_ANALYTICS=false
```

---

## 🚀 Running the Application

### **Option 1: Local Development**

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Linux/Mac

pip install -r requirements.txt
python -m spacy download en_core_web_sm

uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/api/docs`

### **Option 2: Docker Compose**

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 📊 Database Schema

### **Tables**

```sql
-- Users
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ideas
CREATE TABLE ideas (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    idea_text TEXT NOT NULL,
    parsed_json JSON,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Outputs
CREATE TABLE outputs (
    id INTEGER PRIMARY KEY,
    idea_id INTEGER REFERENCES ideas(id),
    output_type VARCHAR(50),
    content JSON,
    file_path VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cache
CREATE TABLE cache (
    id INTEGER PRIMARY KEY,
    query VARCHAR(500) UNIQUE,
    data_json JSON,
    cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);
```

---

## 🔐 Security Features

✅ **CORS Configuration**: Allows requests from `localhost:3000` and `localhost:5173`
✅ **Environment Variables**: Sensitive data stored in `.env` files
✅ **Input Validation**: Pydantic models validate all API requests
✅ **Error Handling**: Comprehensive try/catch with proper HTTP status codes
✅ **File Access Control**: Static files served only from `outputs/` directory

---

## 📦 Generated Output Structure

```
outputs/
└── {job_id}/
    ├── pitch_deck.pptx    # 7-slide investor deck
    ├── summary.pdf        # 1-page executive summary
    └── assets.json        # All branding data
```

## 🧪 Testing

### **Backend Health Check**
```bash
curl http://localhost:8000/health
```

### **Submit Test Idea**
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","idea":"AI-powered grocery delivery for rural areas"}'
```

### **Check Status**
```bash
curl http://localhost:8000/api/status/1
```

---

## 🐛 Troubleshooting

### **Backend Issues**

**Problem**: `ModuleNotFoundError: No module named 'pydantic_settings'`
**Solution**: `pip install pydantic-settings==2.1.0`

**Problem**: `spaCy model not found`
**Solution**: `python -m spacy download en_core_web_sm`

**Problem**: CORS errors
**Solution**: Check `FRONTEND_URL` in `.env` matches your frontend URL

### **Frontend Issues**

**Problem**: TypeScript errors about React types
**Solution**: `npm install --save-dev @types/react @types/react-dom`

**Problem**: API calls failing
**Solution**: Verify `VITE_API_BASE_URL` in `.env` points to backend

**Problem**: Tailwind not working
**Solution**: Ensure `@import "tailwindcss";` is in `src/index.css`

### **Docker Issues**

**Problem**: Container won't start
**Solution**: Check logs with `docker-compose logs backend`

**Problem**: Database not persisting
**Solution**: Ensure volume mounts in `docker-compose.yml` are correct

---

## 📈 Performance Optimization

- **Caching**: Research results cached for 24 hours
- **Async Processing**: Background tasks don't block API responses
- **Static File Serving**: FastAPI serves files directly
- **Database Indexing**: Indexed columns for faster queries
- **Model Caching**: AI models loaded once and reused

---

## 🎯 Next Steps

1. **Add Authentication**: Implement JWT tokens for user sessions
2. **Add Redis**: For better caching and task queues
3. **Add Celery**: For distributed task processing
4. **Add PostgreSQL**: For production database
5. **Add Monitoring**: Prometheus + Grafana for metrics
6. **Add CI/CD**: GitHub Actions for automated deployment

---

## 📚 Additional Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Docker Docs**: https://docs.docker.com/

---

## ✅ Integration Checklist

- [x] Backend API endpoints created
- [x] Frontend API service configured
- [x] CORS properly configured
- [x] Environment variables set up
- [x] Database models defined
- [x] File serving configured
- [x] Docker containers created
- [x] Error handling implemented
- [x] Progress tracking working
- [x] Download functionality ready

---
