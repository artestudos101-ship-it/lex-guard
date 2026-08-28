"""Redis-backed analysis worker.

The worker is intentionally separate from HTTP handlers so long-running review
work can be retried without holding a request open.
"""
import asyncio
import json
from pathlib import Path
from uuid import UUID

from redis.asyncio import Redis
from sqlalchemy import select

from app.analysis import deterministic_review
from app.core.config import settings
from app.core.database import SessionLocal
from app.models import Analysis, AnalysisDocument, AnalysisEvent, Document, Evidence, Finding

QUEUE = "lexguard:analysis"


async def emit(session, analysis: Analysis, event_type: str, progress: int, detail: str) -> None:
    analysis.progress = progress
    analysis.status = "RUNNING" if progress < 100 else "COMPLETED"
    session.add(AnalysisEvent(tenant_id=analysis.tenant_id, analysis_id=analysis.id, event_type=event_type, payload_json=json.dumps({"progress": progress, "detail": detail})))
    await session.commit()


async def enqueue_analysis(analysis_id: str, tenant_id: str) -> None:
    redis = Redis.from_url(settings.redis_url, decode_responses=True)
    try:
        await redis.rpush(QUEUE, json.dumps({"analysis_id": analysis_id, "tenant_id": tenant_id}))
    finally:
        await redis.aclose()


async def process_analysis(analysis_id: UUID, tenant_id: UUID) -> None:
    async with SessionLocal() as session:
        analysis = await session.scalar(select(Analysis).where(Analysis.id == analysis_id, Analysis.tenant_id == tenant_id))
        if not analysis:
            return
        await emit(session, analysis, "started", 10, "Análise iniciada")
        links = list((await session.scalars(select(AnalysisDocument).where(AnalysisDocument.analysis_id == analysis_id))).all())
        for link in links:
            document = await session.scalar(select(Document).where(Document.id == link.document_id, Document.tenant_id == tenant_id))
            if not document:
                continue
            content_path = Path(settings.upload_dir) / document.storage_key
            text = content_path.read_text(errors="ignore") if content_path.suffix.lower() == ".txt" and content_path.exists() else ""
            for finding in deterministic_review(text, str(document.id)):
                db_finding = Finding(tenant_id=tenant_id, analysis_id=analysis_id, severity=finding.severity, title=finding.title, explanation=finding.rationale, evidence_quality="E2")
                session.add(db_finding)
                await session.flush()
                for evidence in finding.evidence:
                    session.add(Evidence(tenant_id=tenant_id, finding_id=db_finding.id, document_id=UUID(evidence.document_id), page=evidence.page, quote=evidence.quote, confidence=evidence.confidence))
            await emit(session, analysis, "document_processed", 60, f"Documento processado: {document.filename}")
        await emit(session, analysis, "completed", 100, "Análise concluída")


async def main() -> None:
    redis = Redis.from_url(settings.redis_url, decode_responses=True)
    try:
        while True:
            item = await redis.blpop(QUEUE, timeout=30)
            if not item:
                continue
            _, raw = item
            job = json.loads(raw)
            await process_analysis(UUID(job["analysis_id"]), UUID(job["tenant_id"]))
    finally:
        await redis.aclose()


if __name__ == "__main__":
    asyncio.run(main())
