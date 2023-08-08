import asyncio
import os

from fastapi import APIRouter
from fastapi.responses import FileResponse
from hypercorn.asyncio import serve
from hypercorn.config import Config
from typing import Awaitable, Callable, List, Optional

from .db import InMemoryTaskDB, TaskDB
from .server import app
from .models import (
    TaskRequestBody,
    Step,
    StepRequestBody,
    Artifact,
    Task,
    Status,
)


StepHandler = Callable[[Step], Awaitable[Step]]
TaskHandler = Callable[[Task], Awaitable[None]]


_task_handler: Optional[TaskHandler]
_step_handler: Optional[StepHandler]


base_router = APIRouter()


@base_router.post("/agent/tasks", response_model=Task, tags=["agent"])
async def create_agent_task(body: TaskRequestBody | None = None) -> Task:
    """
    Creates a task for the agent.
    """
    if not _task_handler:
        raise Exception("Task handler not defined")

    task = await Agent.db.create_task(
        input=body.input if body else None,
        additional_input=body.additional_input if body else None,
    )
    await _task_handler(task)

    return task


@base_router.get("/agent/tasks", response_model=List[str], tags=["agent"])
async def list_agent_tasks_ids() -> List[str]:
    """
    List all tasks that have been created for the agent.
    """
    return [task.task_id for task in await Agent.db.list_tasks()]


@base_router.get("/agent/tasks/{task_id}", response_model=Task, tags=["agent"])
async def get_agent_task(task_id: str) -> Task:
    """
    Get details about a specified agent task.
    """
    return await Agent.db.get_task(task_id)


@base_router.get(
    "/agent/tasks/{task_id}/steps",
    response_model=List[str],
    tags=["agent"],
)
async def list_agent_task_steps(task_id: str) -> List[str]:
    """
    List all steps for the specified task.
    """
    task = await Agent.db.get_task(task_id)
    return [s.step_id for s in task.steps]


@base_router.post(
    "/agent/tasks/{task_id}/steps",
    response_model=Step,
    tags=["agent"],
)
async def execute_agent_task_step(
    task_id: str,
    body: StepRequestBody | None = None,
) -> Step:
    """
    Execute a step in the specified agent task.
    """
    task = await Agent.db.get_task(task_id)
    step = next(filter(lambda x: x.status == Status.created, task.steps), None)

    if not step:
        raise Exception("No steps to execute")

    step.input = body.input if body else None
    step.additional_input = body.additional_input if body else None

    step = await _step_handler(step)

    step.status = Status.completed

    if step.artifacts:
        task.artifacts.extend(step.artifacts)

    return step


@base_router.get(
    "/agent/tasks/{task_id}/steps/{step_id}",
    response_model=Step,
    tags=["agent"],
)
async def get_agent_task_step(task_id: str, step_id: str = ...) -> Step:
    """
    Get details about a specified task step.
    """
    return await Agent.db.get_step(task_id, step_id)


@base_router.get(
    "/agent/tasks/{task_id}/artifacts",
    response_model=List[Artifact],
    tags=["agent"],
)
async def list_agent_task_artifacts(task_id: str) -> List[Artifact]:
    """
    List all artifacts for the specified task.
    """
    task = await Agent.db.get_task(task_id)
    return task.artifacts


@base_router.get(
    "/agent/tasks/{task_id}/artifacts/{artifact_id}",
    tags=["agent"],
)
async def download_agent_task_artifacts(task_id: str, artifact_id: str) -> FileResponse:
    """
    Download the specified artifact.
    """
    artifact = await Agent.db.get_artifact(task_id, artifact_id)
    path = Agent.get_artifact_path(task_id, artifact)
    return FileResponse(
        path=path, media_type="application/octet-stream", filename=artifact.file_name
    )


class Agent:
    db: TaskDB = InMemoryTaskDB()
    workspace: str = os.getenv("AGENT_WORKSPACE", "workspace")

    @staticmethod
    def setup_agent(task_handler: TaskHandler, step_handler: StepHandler):
        """
        Set the agent's task and step handlers.
        """
        global _task_handler
        _task_handler = task_handler

        global _step_handler
        _step_handler = step_handler

        return Agent

    @staticmethod
    def get_workspace(task_id: str) -> str:
        """
        Get the workspace path for the specified task.
        """
        return os.path.join(os.getcwd(), Agent.workspace, task_id)

    @staticmethod
    def get_artifact_path(task_id: str, artifact: Artifact) -> str:
        """
        Get the artifact path for the specified task and artifact.
        """
        workspace_path = Agent.get_workspace(task_id)
        relative_path = artifact.relative_path or ""
        return os.path.join(workspace_path, relative_path, artifact.file_name)

    @staticmethod
    def start(port: int = 8000, router: APIRouter = base_router):
        """
        Start the agent server.
        """
        config = Config()
        config.bind = [f"localhost:{port}"]  # As an example configuration setting
        app.include_router(router)
        asyncio.run(serve(app, config))
