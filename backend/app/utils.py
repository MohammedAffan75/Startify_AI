"""Utility helpers for the backend."""
import os
from typing import Any, Optional
from datetime import datetime, timedelta
from .db import SessionLocal
from .models import Cache


def load_env(path: str = ".env") -> None:
    """Simple .env loader (very small)."""
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" not in line or line.strip().startswith("#"):
                continue
            k, v = line.strip().split("=", 1)
            os.environ.setdefault(k, v)


def normalize_query(query: str) -> str:
    """Normalize a query string for consistent caching.
    
    Args:
        query: Raw query string
        
    Returns:
        Normalized query (lowercase, stripped)
    """
    return query.lower().strip()


def get_cached(query: str) -> Optional[Any]:
    """Retrieve cached data for a query.
    
    Args:
        query: Query string to lookup
        
    Returns:
        Cached data if found and not expired, None otherwise
    """
    normalized = normalize_query(query)
    db = SessionLocal()
    
    try:
        cache_entry = db.query(Cache).filter(Cache.query == normalized).first()
        
        if not cache_entry:
            return None
        
        # Check if expired
        if cache_entry.expires_at and cache_entry.expires_at < datetime.now():
            # Delete expired entry
            db.delete(cache_entry)
            db.commit()
            return None
        
        return cache_entry.data_json
        
    finally:
        db.close()


def set_cache(query: str, data: Any, ttl_seconds: int = 86400) -> None:
    """Store data in cache with TTL.
    
    Args:
        query: Query string as cache key
        data: Data to cache (must be JSON-serializable)
        ttl_seconds: Time to live in seconds (default: 24 hours)
    """
    normalized = normalize_query(query)
    db = SessionLocal()
    
    try:
        expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
        
        # Check if entry exists
        cache_entry = db.query(Cache).filter(Cache.query == normalized).first()
        
        if cache_entry:
            # Update existing entry
            cache_entry.data_json = data
            cache_entry.cached_at = datetime.now()
            cache_entry.expires_at = expires_at
        else:
            # Create new entry
            cache_entry = Cache(
                query=normalized,
                data_json=data,
                expires_at=expires_at
            )
            db.add(cache_entry)
        
        db.commit()
        
    finally:
        db.close()
