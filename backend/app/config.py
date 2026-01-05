"""Configuration management for the application."""
import os
from typing import Optional
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str = "sqlite:///./startify.db"
    
    # API Keys / External Models
    openai_api_key: Optional[str] = None
    serpapi_key: Optional[str] = None

    # OpenRouter (OpenAI-compatible) configuration
    openrouter_api_key: Optional[str] = None
    openrouter_model: str = "openai/gpt-oss-120b:free"
    openrouter_base_url: str = "https://openrouter.ai/api/v1/chat/completions"
    
    # Server
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    frontend_url: str = "http://localhost:3000"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # File Storage
    output_dir: str = "outputs"
    max_file_size_mb: int = 50
    
    # AI Models
    use_openai: bool = False
    use_local_models: bool = True
    model_cache_dir: str = "./model_cache"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()