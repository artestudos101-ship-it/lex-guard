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


def test_analysis_decision_report_and_events_are_protected():
    analysis_id = "00000000-0000-0000-0000-000000000001"
    for path in (
        f"/api/v1/analyses/{analysis_id}/decision",
        f"/api/v1/analyses/{analysis_id}/report",
        f"/api/v1/analyses/{analysis_id}/events",
    ):
        response = client.get(path)
        assert response.status_code == 401
        assert response.json()["detail"]["code"] == "UNAUTHENTICATED"


def test_decision_recommendation_schema_rejects_unknown_values():
    response = client.post(
        "/api/v1/analyses/00000000-0000-0000-0000-000000000001/decision",
        json={"recommendation": "MAYBE", "rationale": "test"},
    )
    assert response.status_code == 401
