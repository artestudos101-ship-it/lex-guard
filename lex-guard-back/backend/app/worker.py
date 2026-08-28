"""Replaceable async worker entrypoint.

The MVP keeps queue consumption separate from HTTP; ARQ/Redis can be wired here
without moving analysis work into request handlers.
"""
import asyncio


async def main() -> None:
    while True:
        await asyncio.sleep(60)


if __name__ == "__main__":
    asyncio.run(main())
