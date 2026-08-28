from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, Header, HTTPException
from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings

_passwords = PasswordHash.recommended()


def hash_password(value: str) -> str:
    return _passwords.hash(value)


def verify_password(value: str, hashed: str) -> bool:
    return _passwords.verify(value, hashed)


def create_access_token(user_id: str, tenant_id: str, role: str = "member") -> str:
    expires = datetime.now(timezone.utc) + timedelta(hours=8)
    return jwt.encode({"sub": user_id, "tenant_id": tenant_id, "role": role, "exp": expires}, settings.jwt_secret, algorithm="HS256")


def current_claims(authorization: Annotated[str | None, Header()] = None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, detail={"code": "UNAUTHENTICATED", "message": "Bearer token required"})
    try:
        return jwt.decode(authorization[7:], settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(401, detail={"code": "INVALID_TOKEN", "message": "Invalid or expired token"}) from exc
