"""Idempotent local demo seed for the LexGuard backend."""
import asyncio
from uuid import UUID

from sqlalchemy import select

from app.core.auth import hash_password
from app.core.database import SessionLocal
from app.models import Rule, Tenant, User

DEMO_USER = UUID("00000000-0000-0000-0000-000000000002")
DEMO_EMAIL = "marina.costa@empresa-demo.com"
DEMO_PASSWORD = "lexguard-demo"

DEMO_TENANT = UUID("00000000-0000-0000-0000-000000000001")


async def seed() -> None:
    async with SessionLocal() as session:
        tenant = await session.scalar(select(Tenant).where(Tenant.id == DEMO_TENANT))
        if tenant is None:
            tenant = Tenant(id=DEMO_TENANT, name="Empresa Demonstrativa Ltda.", plan="enterprise")
            session.add(tenant)
            await session.flush()
        user = await session.scalar(select(User).where(User.email == DEMO_EMAIL))
        if user is None:
            session.add(User(id=DEMO_USER, tenant_id=DEMO_TENANT, email=DEMO_EMAIL, name="Marina Costa", password_hash=hash_password(DEMO_PASSWORD), role="owner"))
        existing = await session.scalar(select(Rule.id).where(Rule.tenant_id == DEMO_TENANT, Rule.code == "RISK-VALUE-001"))
        if existing is None:
            session.add(Rule(tenant_id=DEMO_TENANT, code="RISK-VALUE-001", name="Valor acima do limite", description="Sinaliza valores que excedem o limite configurado para a política.", severity="HIGH"))
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
