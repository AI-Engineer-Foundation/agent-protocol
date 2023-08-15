from fastapi import Request
from fastapi.responses import PlainTextResponse

from agent_protocol.db import NotFoundException


async def not_found_exception_handler(
    request: Request, exc: NotFoundException
) -> PlainTextResponse:
    return PlainTextResponse(
        str(exc),
        status_code=404,
    )
