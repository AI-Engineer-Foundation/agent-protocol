# Agent Communication Protocol - Python SDK

SDK with our implementation of the Agent Communication Protocol in Python, allows you to easily wrap your agent in a webserver compatible with the protocol - you only need to define an agent task and step handlers.

## Installation

```sh
pip install agent-protocol
```

Then add the following code to your agent:

```python
from agent_protocol import Agent, Step, Task


async def task_handler(task: Task) -> None:
    # TODO: Create initial step(s) for the task
    await Agent.db.create_step(task.task_id, ...)


async def step_handler(step: Step) -> Step:
    # TODO: handle next step
    if step.name == "print":
        print(step.input)
        step.is_last = True

    step.output = "Output from the agent"
    return step


if __name__ == "__main__":
    # Add the task handler and start the server
    Agent.setup_agent(task_handler, step_handler).start()
```

## Customization

### Database

By default, the SDK stores data in memory. You can customize the database by setting db to your own database object.

```python
Agent.db = your_database
```

The database object must implement the methods from [db.py](./agent/python/db.py).

### Routes

You can also add your own routes to the server. For example:

```python
from agent_protocol import Agent, router
from fastapi import APIRouter

my_router = APIRouter()


@my_router.get("/hello")
async def hello():
    return {"hello": "world"}

my_router.include_router(router)

task_handler = ...
step_handler = ...
Agent.setup_agent(task_handler, step_handler).start(router=my_router)
```

## Docs

You can find more info and examples in the [docs](https://agentprotocol.ai/sdks/python).
