"""Idempotent local demo seed for the LexGuard backend."""
import asyncio
from uuid import UUID

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import Rule, Tenant

DEMO_TENANT = UUID("00000000-0000-0000-0000-000000000001")


async def seed() -> None:
    async with SessionLocal() as session:
        tenant = await session.scalar(select(Tenant).where(Tenant.id == DEMO_TENANT))
        if tenant is None:
            session.add(Tenant(id=DEMO_TENANT, name="Empresa Demonstrativa Ltda.", plan="enterprise"))
        existing = await session.scalar(select(Rule.id).where(Rule.tenant_id == DEMO_TENANT, Rule.code == "RISK-VALUE-001"))
        if existing is None:
            session.add(Rule(tenant_id=DEMO_TENANT, code="RISK-VALUE-001", name="Valor acima do limite", description="Sinaliza valores que excedem o limite configurado para a política.", severity="HIGH"))
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
