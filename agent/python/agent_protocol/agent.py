import asyncio

import uuid

from hypercorn.asyncio import serve
from hypercorn.config import Config
from typing import Awaitable, Callable, List, Optional, Tuple, Any


from .server import app
from .models import (
    Task,
    TaskRequestBody,
    Step,
    StepInput,
    StepRequestBody,
    TaskInput,
    StepResult,
    Artifact,
)


StepHandler = Callable[[StepInput | None], Awaitable[StepResult]]
TaskHandler = Callable[[TaskInput | None], Awaitable[StepHandler]]

tasks: List[Tuple[Task, StepHandler]] = []
steps: List[Step] = []

task_handler: Optional[TaskHandler]


class StepResultWithDefaults(StepResult):
    output: Any
    artifacts: List[Artifact] = []
    is_last: bool = False


@app.post("/agent/tasks", response_model=Task, tags=["agent", "tasks"])
async def create_agent_task(body: TaskRequestBody | None = None) -> Task:
    """
    Creates a task for the agent.
    """
    if not task_handler:
        raise Exception("Task handler not defined")

    step_handler = await task_handler(body.input if body else None)
    task = Task(
        task_id=str(uuid.uuid4()),
        input=body.input if body else None,
        artifacts=[],
    )
    tasks.append((task, step_handler))
    return task


@app.get("/agent/tasks", response_model=List[str], tags=["agent", "tasks"])
async def list_agent_tasks_i_ds() -> List[str]:
    """
    List all tasks that have been created for the agent.
    """
    return [t[0].task_id for t in tasks]


@app.get("/agent/tasks/{task_id}", response_model=Task, tags=["agent", "tasks"])
async def get_agent_task(task_id: str) -> Task:
    """
    Get details about a specified agent task.
    """
    task = next(filter(lambda t: t[0].task_id == task_id, tasks), None)
    if not task:
        raise Exception(f"Task with id {task_id} not found")
    return task[0]


@app.get(
    "/agent/tasks/{task_id}/steps",
    response_model=List[str],
    tags=["agent", "tasks", "steps"],
)
async def list_agent_task_steps(task_id: str) -> List[str]:
    """
    List all steps for the specified task.
    """
    return [t.step_id for t in steps if t.task_id == task_id]


@app.post(
    "/agent/tasks/{task_id}/steps",
    response_model=Step,
    tags=["agent", "tasks", "steps"],
)
async def execute_agent_task_step(
    task_id: str,
    body: StepRequestBody | None = None,
) -> Step:
    """
    Execute a step in the specified agent task.
    """
    task = next(filter(lambda t: t[0].task_id == task_id, tasks), None)
    if not task:
        raise Exception(f"Task with id {task_id} not found")

    handler = task[1]
    result = await handler(body.input if body else None)

    step = Step(
        task_id=task_id,
        step_id=str(uuid.uuid4()),
        input=body.input if body else None,
        output=result.output,
        artifacts=result.artifacts,
        is_last=result.is_last,
    )

    if step.artifacts:
        if task[0].artifacts is None:
            task[0].artifacts = step.artifacts
        else:
            task[0].artifacts.extend(step.artifacts)

    steps.append(step)
    return step


@app.get(
    "/agent/tasks/{task_id}/steps/{step_id}",
    response_model=Step,
    tags=["agent", "tasks", "steps"],
)
async def get_agent_task_step(task_id: str, step_id: str = ...) -> Step:
    """
    Get details about a specified task step.
    """
    step = next(
        filter(
            lambda t: t.task_id == task_id and t.step_id == step_id,
            steps,
        ),
        None,
    )
    if not step:
        raise Exception(f"Step with task id {task_id} and step id {step_id} not found")
    return step


class Agent:
    @staticmethod
    def handle_task(handler: Callable[[TaskInput | None], Awaitable[StepHandler]]):
        global task_handler
        task_handler = handler

        return Agent

    @staticmethod
    def start(port: int = 8000):
        config = Config()
        config.bind = [f"localhost:{port}"]  # As an example configuration setting
        asyncio.run(serve(app, config))
