import trio
import uuid

from hypercorn.trio import serve
from hypercorn.config import Config
from fastapi.responses import JSONResponse
from typing import Awaitable, Callable, List, Optional
from pydantic import BaseModel

config = Config()
config.bind = ["localhost:8000"]  # As an example configuration setting


from .server import app
from .models import (
    AgentTask,
    AgentStepOutput,
    AgentTaskRequestBody,
    AgentStep,
    AgentStepInput,
    AgentStepRequestBody,
    AgentTaskArtifact,
    AgentTaskInput,
)


class AgentStepHandlerResult(BaseModel):
    output: Optional[AgentStepOutput] = None
    artifacts: Optional[List[AgentTaskArtifact]] = None


class Agent:
    tasks: List[AgentTask] = []
    steps: List[AgentStep] = []

    @staticmethod
    def _add_create_task_handler():
        async def handler(body: AgentTaskRequestBody | None = None):
            task = AgentTask(
                task_id=str(uuid.uuid4()),
                input=body.input if body else None,
                artifacts=[],
            )
            Agent.tasks.append(task)
            return JSONResponse(content=task.dict())

        app.add_api_route(
            "/agent/tasks",
            handler,
            methods=["POST"],
            response_class=JSONResponse,
        )
        return Agent

    @staticmethod
    def _add_list_tasks_handler():
        async def handler():
            return JSONResponse([t.task_id for t in Agent.tasks])

        app.add_api_route(
            "/agent/tasks",
            handler,
            methods=["GET"],
            response_model=List[AgentTask],
        )
        return Agent

    @staticmethod
    def _add_list_steps_handler():
        async def handler(task_id: str):
            return JSONResponse(
                [t.step_id for t in Agent.steps if t.task_id == task_id]
            )

        app.add_api_route(
            "/agent/tasks/{task_id}/steps",
            handler,
            methods=["GET"],
            response_model=List[AgentTask],
        )
        return Agent

    @staticmethod
    def _add_task_details_handler():
        async def handler(task_id: str):
            task = next(filter(lambda t: t.task_id == task_id, Agent.tasks), None)
            if not task:
                raise Exception(f"Task with id {task_id} not found")
            return JSONResponse(content=task.dict())

        app.add_api_route(
            "/agent/tasks/{task_id}",
            handler,
            methods=["GET"],
            response_model=List[AgentTask],
        )
        return Agent

    @staticmethod
    def _add_step_details_handler():
        async def handler(task_id: str, step_id: str):
            task = next(
                filter(
                    lambda t: t.task_id == task_id and t.step_id == step_id,
                    Agent.steps,
                ),
                None,
            )
            if not task:
                raise Exception(f"Task with id {task_id} not found")
            return JSONResponse(content=task.dict())

        app.add_api_route(
            "/agent/tasks/{task_id}/steps/{step_id}",
            handler,
            methods=["GET"],
            response_model=List[AgentTask],
        )
        return Agent

    @staticmethod
    def handle_task_step(
        handler: Callable[
            [AgentTaskInput | None, AgentStepInput | None],
            Awaitable[AgentStepHandlerResult],
        ]
    ):
        async def handler_wrapper(
            task_id: str,
            body: AgentStepRequestBody | None = None,
        ) -> JSONResponse:
            task = next(filter(lambda t: t.task_id == task_id, Agent.tasks), None)
            print(task)
            if not task:
                raise Exception(f"Task with id {task_id} not found")

            result = await handler(task.input, body.input if body else None)
            print("result", result)

            step = AgentStep(
                task_id=task_id,
                step_id=str(uuid.uuid4()),
                **body.dict() if body else {},
                output=result.output,
            )

            task.artifacts.extend(result.artifacts or [])

            Agent.steps.append(step)
            return JSONResponse(content=step.dict())

        app.add_api_route(
            "/agent/tasks/{task_id}/steps",
            handler_wrapper,
            methods=["POST"],
        )
        return Agent

    @staticmethod
    def start():
        Agent._add_create_task_handler()
        Agent._add_list_tasks_handler()
        Agent._add_task_details_handler()
        Agent._add_step_details_handler()
        Agent._add_list_steps_handler()
        trio.run(serve, app, config)
