from jose import jwt

from app.analysis import deterministic_review
from app.core.auth import create_access_token, hash_password, verify_password
from app.core.config import settings


def test_deterministic_review_requires_anchored_term():
    assert deterministic_review("No relevant clauses here", "doc-1") == []
    findings = deterministic_review("Payment due in 30 days", "doc-1")
    assert len(findings) == 1
    assert findings[0].code == "PAYMENT_TERM"
    assert findings[0].evidence[0].document_id == "doc-1"
    assert findings[0].evidence[0].confidence == 0.82


def test_password_hash_round_trip():
    hashed = hash_password("correct horse battery staple")
    assert hashed != "correct horse battery staple"
    assert verify_password("correct horse battery staple", hashed)
    assert not verify_password("wrong password", hashed)


def test_access_token_contains_tenant_scope():
    token = create_access_token("user-1", "tenant-1", "reviewer")
    claims = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    assert claims["sub"] == "user-1"
    assert claims["tenant_id"] == "tenant-1"
    assert claims["role"] == "reviewer"
