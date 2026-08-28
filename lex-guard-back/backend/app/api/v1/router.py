from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import current_claims
from app.core.database import get_session
from app.models import Analysis, AnalysisDocument, Document

router = APIRouter()


class CreateAnalysis(BaseModel):
    document_ids: list[UUID] = Field(min_length=1, max_length=20)
    policy_version_id: str | None = Field(default=None, max_length=120)
    title: str = Field(default="Nova análise", min_length=1, max_length=255)
    idempotency_key: str | None = Field(default=None, max_length=128)


class DocumentOut(BaseModel):
    id: UUID
    filename: str
    status: str
    created_at: datetime


class AnalysisOut(BaseModel):
    id: UUID
    status: str
    progress: int
    document_ids: list[UUID]
    created_at: datetime


async def _scope(claims: dict = Depends(current_claims)) -> tuple[UUID, UUID, str]:
    try:
        return UUID(claims["tenant_id"]), UUID(claims["sub"]), claims.get("role", "member")
    except (KeyError, ValueError) as exc:
        raise HTTPException(401, detail={"code": "INVALID_SCOPE", "message": "Invalid token scope"}) from exc


@router.get("/me")
async def me(scope: tuple[UUID, UUID, str] = Depends(_scope)):
    tenant_id, user_id, role = scope
    return {"id": str(user_id), "tenant_id": str(tenant_id), "role": role, "permissions": ["*"] if role == "owner" else ["read"]}


@router.post("/documents", response_model=DocumentOut, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    scope: tuple[UUID, UUID, str] = Depends(_scope),
    session: AsyncSession = Depends(get_session),
):
    if not file.filename or not file.filename.lower().endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(400, detail={"code": "UNSUPPORTED_FILE", "message": "Only PDF, DOCX, and TXT files are supported"})
    content = await file.read(25_000_001)
    if len(content) > 25_000_000:
        raise HTTPException(413, detail={"code": "FILE_TOO_LARGE", "message": "Maximum upload size is 25 MB"})
    tenant_id, _, _ = scope
    document = Document(
        tenant_id=tenant_id,
        filename=file.filename,
        storage_key=f"tenants/{tenant_id}/documents/{uuid4()}-{file.filename}",
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        status="READY",
    )
    session.add(document)
    await session.commit()
    await session.refresh(document)
    return document


@router.get("/documents", response_model=list[DocumentOut])
async def list_documents(
    limit: int = Query(50, ge=1, le=100),
    scope: tuple[UUID, UUID, str] = Depends(_scope),
    session: AsyncSession = Depends(get_session),
):
    tenant_id, _, _ = scope
    result = await session.scalars(select(Document).where(Document.tenant_id == tenant_id).order_by(Document.created_at.desc()).limit(limit))
    return list(result)


@router.post("/analyses", response_model=AnalysisOut, status_code=202)
async def create_analysis(
    payload: CreateAnalysis,
    scope: tuple[UUID, UUID, str] = Depends(_scope),
    session: AsyncSession = Depends(get_session),
):
    tenant_id, user_id, _ = scope
    documents = list((await session.scalars(select(Document).where(Document.tenant_id == tenant_id, Document.id.in_(payload.document_ids)))).all())
    found = {doc.id for doc in documents}
    missing = [str(doc_id) for doc_id in payload.document_ids if doc_id not in found]
    if missing:
        raise HTTPException(404, detail={"code": "DOCUMENT_NOT_FOUND", "message": "Document not found", "ids": missing})
    analysis = Analysis(tenant_id=tenant_id, created_by=user_id, title=payload.title, status="QUEUED", progress=0, policy_version_id=payload.policy_version_id)
    session.add(analysis)
    await session.flush()
    session.add_all([AnalysisDocument(analysis_id=analysis.id, document_id=doc_id) for doc_id in payload.document_ids])
    await session.commit()
    await session.refresh(analysis)
    return AnalysisOut(id=analysis.id, status=analysis.status, progress=analysis.progress, document_ids=payload.document_ids, created_at=analysis.created_at)


@router.get("/analyses", response_model=list[AnalysisOut])
async def list_analyses(
    limit: int = Query(50, ge=1, le=100),
    scope: tuple[UUID, UUID, str] = Depends(_scope),
    session: AsyncSession = Depends(get_session),
):
    tenant_id, _, _ = scope
    analyses = list((await session.scalars(select(Analysis).where(Analysis.tenant_id == tenant_id).order_by(Analysis.created_at.desc()).limit(limit))).all())
    output = []
    for analysis in analyses:
        ids = list((await session.scalars(select(AnalysisDocument.document_id).where(AnalysisDocument.analysis_id == analysis.id))).all())
        output.append(AnalysisOut(id=analysis.id, status=analysis.status, progress=analysis.progress, document_ids=ids, created_at=analysis.created_at))
    return output


@router.get("/analyses/{analysis_id}", response_model=AnalysisOut)
async def get_analysis(
    analysis_id: UUID,
    scope: tuple[UUID, UUID, str] = Depends(_scope),
    session: AsyncSession = Depends(get_session),
):
    tenant_id, _, _ = scope
    analysis = await session.scalar(select(Analysis).where(Analysis.id == analysis_id, Analysis.tenant_id == tenant_id))
    if not analysis:
        raise HTTPException(404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analysis not found"})
    ids = list((await session.scalars(select(AnalysisDocument.document_id).where(AnalysisDocument.analysis_id == analysis.id))).all())
    return AnalysisOut(id=analysis.id, status=analysis.status, progress=analysis.progress, document_ids=ids, created_at=analysis.created_at)


@router.get("/policies")
async def policies():
    return {"data": [], "meta": {"total": 0}}
