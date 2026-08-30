from __future__ import annotations

import json
from typing import Any

import httpx

from app.core.config import settings


SYSTEM_PROMPT = """Você é um analista jurídico. Responda somente JSON válido com a chave findings.
Cada finding deve conter severity, title, rationale e evidence, onde evidence é uma lista de page, quote e confidence.
Não invente citações: se não houver evidência textual, retorne uma lista vazia."""


async def review_with_ollama(text: str, document_id: str) -> list[dict[str, Any]]:
    if not settings.ollama_enabled or not text.strip():
        return []
    payload = {
        "model": settings.ollama_model,
        "stream": False,
        "format": "json",
        "options": {"temperature": 0},
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Documento {document_id}:\n{text[:120000]}"},
        ],
    }
    async with httpx.AsyncClient(base_url=settings.ollama_base_url.rstrip("/"), timeout=settings.ollama_timeout_seconds) as client:
        response = await client.post("/api/chat", json=payload)
        response.raise_for_status()
        body = response.json()
    content = body.get("message", {}).get("content", "{}")
    parsed = json.loads(content) if isinstance(content, str) else content
    findings = parsed.get("findings", []) if isinstance(parsed, dict) else []
    return findings if isinstance(findings, list) else []
