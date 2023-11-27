from fastapi import Request
from fastapi.responses import JSONResponse
from agent_protocol.db import NotFoundException

async def not_found_exception_handler(
    request: Request, exc: NotFoundException
) -> JSONResponse:
    return JSONResponse(
        content={"message": f"{exc.item_name} with {exc.item_id} not found."},
        status_code=404,
    )