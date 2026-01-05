"""SQLAlchemy ORM models for the Startify database."""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)


class Idea(Base):
    __tablename__ = "ideas"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    idea_text = Column(Text, nullable=False)
    parsed_json = Column(JSON, nullable=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, processing, completed, failed
    submitted_at = Column(DateTime, default=func.now(), nullable=False)


class Output(Base):
    __tablename__ = "outputs"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=False, index=True)
    output_type = Column(String(50), nullable=False)  # e.g., "pptx", "pdf", "zip"
    content_json = Column(JSON, nullable=True)
    file_path = Column(String(512), nullable=True)
    generated_at = Column(DateTime, default=func.now(), nullable=False)


class Cache(Base):
    __tablename__ = "cache"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    query = Column(String(512), unique=True, nullable=False, index=True)
    data_json = Column(JSON, nullable=False)
    cached_at = Column(DateTime, default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=True)


# Pydantic models for API request/response validation
from pydantic import BaseModel
from typing import Optional


class GenerateRequest(BaseModel):
    email: str
    idea: str


class GenerateResponse(BaseModel):
    job_id: str
    status: str


class JobStatus(BaseModel):
    job_id: str
    status: str  # pending, processing, completed, failed
    progress: int  # 0-100


class DownloadResponse(BaseModel):
    url: str
