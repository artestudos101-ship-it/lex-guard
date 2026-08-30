import asyncio

from app.core.database import init_database
from app.seed_demo import seed


async def main() -> None:
    await init_database()
    await seed()
    print("schema_and_demo_seed_ok")


if __name__ == "__main__":
    asyncio.run(main())
