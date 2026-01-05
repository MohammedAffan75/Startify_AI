from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .api import router
from .db import init_db
from .config import settings
import os

app = FastAPI(
    title="Startify AI Backend",
    description="AI-powered startup ideation and branding platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Enhanced CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3001",  # Vite alternate port
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    # Create output directory if it doesn't exist
    os.makedirs(settings.output_dir, exist_ok=True)
    
    # Initialize database
    init_db()
    
    print(f"✓ Startify AI Backend started")
    print(f"✓ Output directory: {settings.output_dir}")
    print(f"✓ Database: {settings.database_url}")
    print(f"✓ CORS enabled for: {settings.frontend_url}")

# Mount static files for downloads
if os.path.exists(settings.output_dir):
    app.mount("/files", StaticFiles(directory=settings.output_dir), name="files")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "Startify AI Backend",
        "version": "1.0.0"
    }


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Startify AI Backend API",
        "docs": "/api/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
