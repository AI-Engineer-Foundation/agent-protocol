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

By default the SDK stores data in memory. You can customize the database by setting db to your own database object.

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

## Usage

To start the server run the file where you added the code above:

```sh
python file/where/you/added/code.py
```

and then you can call the API using the following terminal commands:

To **create a task** run:

```sh
curl --request POST \
  --url http://localhost:8000/agent/tasks \
  --header 'Content-Type: application/json' \
  --data '{
	"input": "task-input-to-your-agent"
}'
```

You will get a response like this:

```json
{
  "input": "task-input-to-your-agent",
  "task_id": "e6d768bb-4c50-4007-9853-aeffb46c77be",
  "artifacts": []
}
```

Then to **execute one step of the task** copy the `task_id` you got from the previous request and run:

```sh
curl --request POST \
  --url http://localhost:8000/agent/tasks/<task-id>/steps
```

To get response like this:

```json
{
  "output": "output-from-the-agent",
  "artifacts": [],
  "is_last": false,
  "input": null,
  "task_id": "e6d768bb-4c50-4007-9853-aeffb46c77be",
  "step_id": "8ff8ba39-2c3e-4246-8086-fbd2a897240b"
}
```

## Test compliance

Part of the package is also a test suite that can be used to test compliance with the protocol. To run the tests, run the following command:

```sh
agent-protocol test --url <url>
```

In the background it uses pytest, you can pass any pytest arguments to the command above.

## Examples

- [Smol Developer integration](./examples/smol_developer.py)
- [Beebot integration](https://github.com/AutoPackAI/beebot/pull/3)
