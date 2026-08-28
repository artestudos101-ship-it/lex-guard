from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, Header, HTTPException, Cookie
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


def current_claims(authorization: Annotated[str | None, Header()] = None, lexguard_session: str | None = Cookie(default=None)) -> dict:
    token = authorization[7:] if authorization and authorization.startswith("Bearer ") else lexguard_session
    if not token:
        raise HTTPException(401, detail={"code": "UNAUTHENTICATED", "message": "Authentication required"})
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(401, detail={"code": "INVALID_TOKEN", "message": "Invalid or expired token"}) from exc
