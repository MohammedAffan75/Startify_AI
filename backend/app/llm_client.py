"""Shared LLM client for calling external providers (OpenRouter) or local models.

For now, this uses OpenRouter's OpenAI-compatible chat API when
settings.use_openai is True and an OPENROUTER_API_KEY is configured.
"""
from __future__ import annotations

from typing import Any, List, Dict

import httpx

from .config import get_settings


async def generate_text(prompt: str, *, max_tokens: int = 800) -> str:
    """Async text generation via the configured language model.

    Uses OpenRouter (OpenAI-compatible chat endpoint) when enabled.
    Falls back to a simple echo if no external model is configured so
    the rest of the app does not crash.
    """
    settings = get_settings()

    if settings.use_openai and settings.openrouter_api_key:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                settings.openrouter_base_url,
                headers={
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openrouter_model,
                    "messages": [
                        {"role": "system", "content": "You are a concise startup research assistant."},
                        {"role": "user", "content": prompt},
                    ],
                    "max_tokens": max_tokens,
                },
            )
        resp.raise_for_status()
        data = resp.json()
        try:
            return data["choices"][0]["message"]["content"]
        except Exception as exc:  # pragma: no cover - defensive
            raise RuntimeError(f"Unexpected LLM response format: {data}") from exc

    return prompt[:max_tokens]


def generate_text_sync(prompt: str, *, max_tokens: int = 800) -> str:
    """Synchronous helper for text generation.

    This mirrors :func:`generate_text` but uses a blocking httpx.Client,
    which is easier to call from existing synchronous code such as
    research_agent.
    """
    settings = get_settings()

    if settings.use_openai and settings.openrouter_api_key:
        with httpx.Client(timeout=60) as client:
            resp = client.post(
                settings.openrouter_base_url,
                headers={
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openrouter_model,
                    "messages": [
                        {"role": "system", "content": "You are a concise startup research assistant."},
                        {"role": "user", "content": prompt},
                    ],
                    "max_tokens": max_tokens,
                },
            )
        resp.raise_for_status()
        data = resp.json()
        try:
            return data["choices"][0]["message"]["content"]
        except Exception as exc:  # pragma: no cover - defensive
            raise RuntimeError(f"Unexpected LLM response format: {data}") from exc

    # Fallback behaviour when no external LLM is configured
    return prompt[:max_tokens]
