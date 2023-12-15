# Agent Protocol - Python SDK

Reference implementation of the Agent Protocol in Python by the AI Engineers Foundation (AIEF). This SDK allows you to easily wrap your agent in a webserver compatible with the protocol - you only need to define the task and step handlers for your agent.

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

The database object must implement the methods from [db.py](./agent_protocol/db.py).

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

### Testing

You can test the compliance of your agent using the following script:

```bash
URL=http://127.0.0.1:8000 bash -c "$(curl -fsSL https://agentprotocol.ai/test.sh)"
```

What this does is run a series of GET and POST requests against your agent to verify that it's compliant with the Agent Protocol.

## Docs

You can find more info and examples in the [docs](https://agentprotocol.ai/sdks/python).

## Development

If you want to use the agent_protocol package from the cloned repository, you should be able to use poetry to set it up, like below.

```bash
git clone git@github.com:AI-Engineers-Foundation/agent-protocol.git
cd agent-protocol/sdk/python
poetry install
poetry run python examples/minimal.py
```

Feel free to open [an issue](https://github.com/AI-Engineers-Foundation/agent-protocol/issues) if you run into any problems!
