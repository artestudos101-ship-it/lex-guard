"""Redis-backed analysis worker.

The worker is intentionally separate from HTTP handlers so long-running review
work can be retried without holding a request open.
"""
import asyncio
import json

from redis.asyncio import Redis

from app.core.config import settings

QUEUE = "lexguard:analysis"


async def enqueue_analysis(analysis_id: str, tenant_id: str) -> None:
    redis = Redis.from_url(settings.redis_url, decode_responses=True)
    try:
        await redis.rpush(QUEUE, json.dumps({"analysis_id": analysis_id, "tenant_id": tenant_id}))
    finally:
        await redis.aclose()


async def main() -> None:
    redis = Redis.from_url(settings.redis_url, decode_responses=True)
    try:
        while True:
            item = await redis.blpop(QUEUE, timeout=30)
            if not item:
                continue
            _, raw = item
            job = json.loads(raw)
            print(f"[lexguard-worker] processing analysis={job['analysis_id']} tenant={job['tenant_id']}")
            await asyncio.sleep(0)
    finally:
        await redis.aclose()


if __name__ == "__main__":
    asyncio.run(main())
