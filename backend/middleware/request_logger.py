import logging
import time
from typing import Callable

from fastapi import Request
from starlette.responses import Response

logger = logging.getLogger("api_logger")
handler = logging.FileHandler("logs/api_requests.log")
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.setLevel(logging.INFO)
logger.addHandler(handler)


async def request_logger(request: Request, call_next: Callable) -> Response:
    start = time.time()
    response = await call_next(request)
    duration = int((time.time() - start) * 1000)
    logger.info(
        "%s %s - %s - %sms",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response
