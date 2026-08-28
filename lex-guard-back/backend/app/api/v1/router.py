import asyncio
import json
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from uuid import uuid4
from datetime import datetime, timezone

router = APIRouter()

class CreateAnalysis(BaseModel):
    document_ids: list[str] = Field(min_length=1, max_length=20)
    policy_version_id: str | None = None
    idempotency_key: str | None = Field(default=None, max_length=128)

class DocumentOut(BaseModel):
    id: str
    filename: str
    status: str
    created_at: datetime

class AnalysisOut(BaseModel):
    id: str
    status: str
    progress: int
    document_ids: list[str]
    created_at: datetime

_documents: dict[str, DocumentOut] = {}
_analyses: dict[str, AnalysisOut] = {}

@router.get("/me")
async def me():
    return {"id": "demo-user", "tenant_id": "demo-tenant", "role": "owner", "permissions": ["*"]}

@router.get("/tenants/current")
async def current_tenant():
    return {"id": "demo-tenant", "name": "Demo workspace", "plan": "mvp"}

@router.post("/documents", response_model=DocumentOut, status_code=201)
async def upload_document(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(400, detail={"code": "UNSUPPORTED_FILE", "message": "Only PDF, DOCX, and TXT files are supported"})
    content = await file.read(25_000_001)
    if len(content) > 25_000_000:
        raise HTTPException(413, detail={"code": "FILE_TOO_LARGE", "message": "Maximum upload size is 25 MB"})
    document = DocumentOut(id=str(uuid4()), filename=file.filename, status="READY", created_at=datetime.now(timezone.utc))
    _documents[document.id] = document
    return document

@router.get("/documents", response_model=list[DocumentOut])
async def list_documents(limit: int = Query(50, ge=1, le=100)):
    return list(_documents.values())[-limit:]

@router.post("/analyses", response_model=AnalysisOut, status_code=202)
async def create_analysis(payload: CreateAnalysis):
    missing = [doc_id for doc_id in payload.document_ids if doc_id not in _documents]
    if missing:
        raise HTTPException(404, detail={"code": "DOCUMENT_NOT_FOUND", "message": "Document not found", "ids": missing})
    analysis = AnalysisOut(id=str(uuid4()), status="QUEUED", progress=0, document_ids=payload.document_ids, created_at=datetime.now(timezone.utc))
    _analyses[analysis.id] = analysis
    return analysis

@router.get("/analyses", response_model=list[AnalysisOut])
async def list_analyses(limit: int = Query(50, ge=1, le=100)):
    return list(_analyses.values())[-limit:]

@router.get("/analyses/{analysis_id}", response_model=AnalysisOut)
async def get_analysis(analysis_id: str):
    analysis = _analyses.get(analysis_id)
    if not analysis:
        raise HTTPException(404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analysis not found"})
    return analysis

@router.get("/analyses/{analysis_id}/events")
async def analysis_events(analysis_id: str):
    if analysis_id not in _analyses:
        raise HTTPException(404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analysis not found"})

    async def stream():
        analysis = _analyses[analysis_id]
        payload = {"id": "1", "type": "analysis.status", "sequence": 1, "data": analysis.model_dump(mode="json")}
        yield f"id: 1\\nevent: analysis.status\\ndata: {json.dumps(payload)}\\n\\n"
        await asyncio.sleep(0)

    return StreamingResponse(stream(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

@router.get("/policies")
async def policies():
    return {"data": [], "meta": {"total": 0}}

@router.get("/decision-packages/{analysis_id}")
async def decision_package(analysis_id: str):
    if analysis_id not in _analyses:
        raise HTTPException(404, detail={"code": "ANALYSIS_NOT_FOUND", "message": "Analysis not found"})
    return {"analysis_id": analysis_id, "status": "PENDING", "findings": [], "evidence": [], "recommendation": None}
