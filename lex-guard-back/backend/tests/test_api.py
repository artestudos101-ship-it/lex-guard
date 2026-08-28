from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_document_and_analysis_flow():
    document = client.post("/api/v1/documents", files={"file": ("contract.txt", b"Payment due in 30 days", "text/plain")})
    assert document.status_code == 201
    document_id = document.json()["id"]
    analysis = client.post("/api/v1/analyses", json={"document_ids": [document_id]})
    assert analysis.status_code == 202
    assert analysis.json()["status"] == "QUEUED"


def test_upload_rejects_unsupported_type():
    response = client.post("/api/v1/documents", files={"file": ("payload.exe", b"bad", "application/octet-stream")})
    assert response.status_code == 400
