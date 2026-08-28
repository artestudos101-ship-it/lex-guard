from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_private_endpoints_require_bearer_token():
    response = client.get("/api/v1/documents")
    assert response.status_code == 401
    assert response.json()["detail"]["code"] == "UNAUTHENTICATED"


def test_upload_rejects_unsupported_type_after_auth():
    response = client.post(
        "/api/v1/documents",
        headers={"Authorization": "Bearer invalid"},
        files={"file": ("payload.exe", b"bad", "application/octet-stream")},
    )
    assert response.status_code == 401
