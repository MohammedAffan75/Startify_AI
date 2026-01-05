"""Database setup using SQLAlchemy with SQLite."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .models import Base, User, Idea, Output, Cache
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./startify.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initialize database by creating all tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency function that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def save_user_if_not_exists(email: str) -> int:
    """Save user if not exists and return user_id."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email)
            db.add(user)
            db.commit()
            db.refresh(user)
        return user.id
    finally:
        db.close()


def create_idea(user_id: int, idea_text: str) -> int:
    """Create a new idea and return idea_id."""
    db = SessionLocal()
    try:
        idea = Idea(user_id=user_id, idea_text=idea_text, status="pending")
        db.add(idea)
        db.commit()
        db.refresh(idea)
        return idea.id
    finally:
        db.close()


def update_idea_status(idea_id: int, status: str):
    """Update the status of an idea."""
    db = SessionLocal()
    try:
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
        if idea:
            idea.status = status
            db.commit()
    finally:
        db.close()


def save_output(idea_id: int, output_type: str, content: dict, file_path: str):
    """Save output for an idea."""
    db = SessionLocal()
    try:
        output = Output(
            idea_id=idea_id,
            output_type=output_type,
            content_json=content,
            file_path=file_path
        )
        db.add(output)
        db.commit()
    finally:
        db.close()
