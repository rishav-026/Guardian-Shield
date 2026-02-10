import logging
from typing import List

from fastapi import Header, HTTPException, Request

from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def validate_api_key(x_api_key: str | None = Header(default=None)) -> None:
    if not x_api_key or x_api_key not in settings.security.api_keys:
        logger.warning("Invalid API key")
        raise HTTPException(status_code=401, detail="Invalid API key")


def check_ip(request: Request) -> None:
    client_ip = request.client.host if request.client else ""
    if client_ip in settings.security.ip_blacklist:
        raise HTTPException(status_code=403, detail="IP blocked")
    if settings.security.ip_whitelist and client_ip not in settings.security.ip_whitelist:
        logger.info("IP %s not in whitelist", client_ip)


def rate_limit_exceeded() -> HTTPException:
    return HTTPException(status_code=429, detail="Rate limit exceeded")
