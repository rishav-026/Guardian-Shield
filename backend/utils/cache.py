import json
import logging
from typing import Any, Callable, Optional

from redis import asyncio as redis

from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

redis_pool: Optional[redis.Redis] = None


async def init_redis() -> Optional[redis.Redis]:
    global redis_pool
    if redis_pool:
        return redis_pool
    try:
        redis_pool = redis.from_url(settings.cache.redis_url, encoding="utf-8", decode_responses=True)
        # Test connection
        await redis_pool.ping()
        logger.info("Connected to Redis at %s", settings.cache.redis_url)
    except Exception as exc:  # noqa: BLE001
        logger.error("Redis connection failed: %s", exc)
        redis_pool = None
    return redis_pool


async def cache_get(key: str) -> Optional[Any]:
    if not redis_pool:
        return None
    try:
        data = await redis_pool.get(key)
        if data is None:
            return None
        return json.loads(data)
    except Exception as exc:  # noqa: BLE001
        logger.error("Redis get failed for %s: %s", key, exc)
        return None


async def cache_set(key: str, value: Any, ttl: int) -> None:
    if not redis_pool:
        return
    try:
        await redis_pool.set(key, json.dumps(value), ex=ttl)
    except Exception as exc:  # noqa: BLE001
        logger.error("Redis set failed for %s: %s", key, exc)


async def cache_invalidate(pattern: str) -> None:
    if not redis_pool:
        return
    try:
        async for key in redis_pool.scan_iter(match=pattern):
            await redis_pool.delete(key)
    except Exception as exc:  # noqa: BLE001
        logger.error("Redis invalidate failed for %s: %s", pattern, exc)


async def cached_baseline(user_id: str, fetcher: Callable[[], Any]) -> Any:
    key = f"baseline:{user_id}"
    cached = await cache_get(key)
    if cached is not None:
        return cached
    data = await fetcher()
    await cache_set(key, data, settings.cache.baseline_ttl_seconds)
    return data


async def cached_merchant(merchant: str, fetcher: Callable[[], Any]) -> Any:
    key = f"merchant:{merchant.lower()}"
    cached = await cache_get(key)
    if cached is not None:
        return cached
    data = await fetcher()
    await cache_set(key, data, settings.cache.merchant_ttl_seconds)
    return data
