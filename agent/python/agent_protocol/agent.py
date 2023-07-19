import trio
import uuid

from hypercorn.trio import serve
from hypercorn.config import Config
from typing import Awaitable, Callable, List, Optional, Tuple
from .dependencies import *
from .models import AgentStep, AgentTask, AgentTaskRequestBody

config = Config()
config.bind = ["localhost:8000"]  # As an example configuration setting


from .server import app
from .models import (
    AgentTask,
    AgentTaskRequestBody,
    AgentStep,
    AgentStepInput,
    AgentStepRequestBody,
    AgentTaskInput,
    AgentStepResult,
)


AgentStepHandler = Callable[[AgentStepInput | None], Awaitable[AgentStepResult]]
AgentTaskHandler = Callable[[AgentTaskInput | None], Awaitable[AgentStepHandler]]

tasks: List[Tuple[AgentTask, AgentStepHandler]] = []
steps: List[AgentStep] = []

task_handler: Optional[AgentTaskHandler]


@app.post("/agent/tasks", response_model=AgentTask, tags=["agent", "tasks"])
async def create_agent_task(body: AgentTaskRequestBody | None = None) -> AgentTask:
    """
    Creates a task for the agent.
    """
    if not task_handler:
        raise Exception("Task handler not defined")

    step_handler = await task_handler(body.input if body else None)
    task = AgentTask(
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


@app.get("/agent/tasks/{task_id}", response_model=AgentTask, tags=["agent", "tasks"])
async def get_agent_task(task_id: str) -> AgentTask:
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
    response_model=AgentStep,
    tags=["agent", "tasks", "steps"],
)
async def execute_agent_task_step(
    task_id: str,
    body: AgentStepRequestBody | None = None,
) -> AgentStep:
    """
    Execute a step in the specified agent task.
    """
    task = next(filter(lambda t: t[0].task_id == task_id, tasks), None)
    if not task:
        raise Exception(f"Task with id {task_id} not found")

    handler = task[1]
    result = await handler(body.input if body else None)

    step = AgentStep(
        task_id=task_id,
        step_id=str(uuid.uuid4()),
        **body.dict() if body else {},
        output=result.output,
    )

    task[0].artifacts.extend(result.artifacts or [])
    steps.append(step)

    return step


@app.get(
    "/agent/tasks/{task_id}/steps/{step_id}",
    response_model=AgentStep,
    tags=["agent", "tasks", "steps"],
)
async def get_agent_task_step(task_id: str, step_id: str = ...) -> AgentStep:
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
    def handle_task(
        handler: Callable[[AgentTaskInput | None], Awaitable[AgentStepHandler]]
    ):
        global task_handler
        task_handler = handler

        return Agent

    @staticmethod
    def start():
        trio.run(serve, app, config)
