# Agent Communication Protocol - Python Client

Python client for Agent Communication Protocol. This client simplifies the communication with the agent. 

## Installation
```bash
pip install agent-protocol-client
```

Following snippet shows how you can use the client to create a task for the agent:
```python
import asyncio
from agent_protocol_client import (
    Configuration,
    ApiClient,
    TaskRequestBody,
    AgentApi,
)
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
# TODO: update the host
configuration = Configuration(host="http://localhost:8000")


async def create_agent_task():
    # Enter a context with an instance of the API client
    async with ApiClient(configuration) as api_client:
        # Create an instance of the API class
        api_instance = AgentApi(api_client)
        task_request_body = TaskRequestBody(input='Say "Hello world!"')

        try:
            # Creates a task for the agent.
            api_response = await api_instance.create_agent_task(
                task_request_body=task_request_body
            )
            print("The response of AgentApi->create_agent_task:\n")
            pprint(api_response)
        except Exception as e:
            print("Exception when calling AgentApi->create_agent_task: %s\n" % e)


asyncio.run(create_agent_task())
```


## Usage
Update the host in the above code snippet and start interacting with your agent. You can use (API docs)[./docs/AgentApi.md] to see all the available methods.
