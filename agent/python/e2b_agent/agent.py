import uvicorn
import uuid

from fastapi.responses import JSONResponse
from typing import Awaitable, Callable, List, Optional
from pydantic import BaseModel


from .server import app
from .models import (
    AgentTask,
    AgentStepResult,
    AgentStepOutput,
    AgentStepDeliverables,
    AgentTaskRequestBody,
)


class AgentStep(BaseModel):
    output: Optional[AgentStepOutput] = None
    deliverables: Optional[AgentStepDeliverables] = None


AgentStepHandler = Callable[[AgentTask], Awaitable[AgentStep]]


class Agent:
    tasks: List[AgentTask] = []

    @staticmethod
    def add_create_task_handler():
        async def handler(body: AgentTaskRequestBody):
            task_id = str(uuid.uuid4())
            task = AgentTask(task_id=task_id, input=body.input)
            Agent.tasks.append(task)
            return JSONResponse(content=task.dict())

        app.add_api_route(
            "/tasks",
            handler,
            methods=["POST"],
            response_class=JSONResponse,
        )
        return Agent

    @staticmethod
    def add_list_tasks_handler():
        async def handler():
            return JSONResponse([t.dict() for t in Agent.tasks])

        app.add_api_route(
            "/tasks",
            handler,
            methods=["GET"],
            response_model=List[AgentTask],
        )
        return Agent

    @staticmethod
    def handle_task_step(handler: AgentStepHandler):
        async def handler_wrapper(
            task_id: str,
            body: AgentTaskRequestBody = ...,
        ):
            print("task ?")
            task = next(filter(lambda t: t.task_id == task_id, Agent.tasks), None)
            if not task:
                raise Exception(f"Task with id {task_id} not found")
            task.input = body.input
            result = await handler(task)
            print("result", result)
            return JSONResponse(
                AgentStepResult(
                    task_id=task_id,
                    input=task.input,
                    deliverables=result.deliverables,
                    output=result.output,
                ).dict()
            )

        app.add_api_route(
            "/tasks/{task_id}/step",
            handler_wrapper,
            methods=["POST"],
            response_model=AgentStepResult,
        )
        return Agent

    @staticmethod
    def start():
        Agent.add_create_task_handler()
        Agent.add_list_tasks_handler()
        uvicorn.run(
            "e2b_agent.server:app",
            host="0.0.0.0",
            port=8000,
            # reload=False,
            # debug=False,
            workers=1,
        )
