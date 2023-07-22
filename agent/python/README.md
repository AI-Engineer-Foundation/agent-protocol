# Agent Communication Protocol - Python SDK

This SDK implements the Agent Communication Protocol in Python and allows you to easily wrap your agent in a webserver compatible with the protocol - you only need to define an agent task handler.


## Installation
```sh
pip install agent-protocol
```

Then add the following code to your agent:
```python
from agent_protocol import (
    Agent,
    StepResult,
    StepHandler,
)

async def task_handler(task_input) -> StepHandler:
    # TODO: Initialize code for the agent task.
    async def step_handler(step_input) -> StepResult:
        # TODO: Execute code for the agent step.
        # The step could for example be a single iteration of a ReAct loop.
        
        # TODO: Return the result of the step.
        return StepResult(
            output=...,
        )

    return step_handler

if __name__ == "__main__":
    # Add the task handler and start the server
    Agent.handle_task(task_handler).start()
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
{"input":"task-input-to-your-agent","task_id":"e6d768bb-4c50-4007-9853-aeffb46c77be","artifacts":[]}
```

Then to **execute one step of the task** copy the `task_id` you got from the previous request and run:

```sh
curl --request POST \
  --url http://localhost:8000/agent/tasks/<task-id>/steps
```

To get response like this:
```json
{
	"output":"output-from-the-agent",
	"artifacts":[],"is_last":false,
	"input":null,
	"task_id":"e6d768bb-4c50-4007-9853-aeffb46c77be",
	"step_id":"8ff8ba39-2c3e-4246-8086-fbd2a897240b"
}
```

## Examples
- [Smol Developer integration](./examples/smol_developer.py)
- [Beebot integration](https://github.com/AutoPackAI/beebot/pull/3)
