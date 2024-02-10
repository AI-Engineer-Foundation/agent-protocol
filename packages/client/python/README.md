# Agent Protocol - Python Client
![PyPI](https://img.shields.io/pypi/v/agent-protocol-client)
![PyPI - Python Version](https://img.shields.io/pypi/pyversions/agent-protocol-client)
![PyPI - Downloads](https://img.shields.io/pypi/dm/agent-protocol-client)

## Installation

```bash
pip install agent-protocol-client
```

## Getting Started

In your own code, to use this library to connect and interact with agent-protocol-client,
you can run the following:

```python

import time
import agent_protocol_client
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://0.0.0.0:8000
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://0.0.0.0:8000"
)



# Enter a context with an instance of the API client
async with agent_protocol_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = agent_protocol_client.AgentApi(api_client)
    task_request_body = agent_protocol_client.TaskRequestBody() # TaskRequestBody |  (optional)

    try:
        # Creates a task for the agent.
        api_response = await api_instance.create_agent_task(task_request_body=task_request_body)
        print("The response of AgentApi->create_agent_task:\n")
        pprint(api_response)
    except ApiException as e:
        print("Exception when calling AgentApi->create_agent_task: %s\n" % e)

```

## Documentation for API Endpoints

All URIs are relative to *http://0.0.0.0:8000*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AgentApi* | [**create_agent_task**](agent_protocol_client/docs/AgentApi.md#create_agent_task) | **POST** /ap/v1/agent/tasks | Creates a task for the agent.
*AgentApi* | [**download_agent_task_artifact**](agent_protocol_client/docs/AgentApi.md#download_agent_task_artifact) | **GET** /ap/v1/agent/tasks/{task_id}/artifacts/{artifact_id} | Download a specified artifact.
*AgentApi* | [**execute_agent_task_step**](agent_protocol_client/docs/AgentApi.md#execute_agent_task_step) | **POST** /ap/v1/agent/tasks/{task_id}/steps | Execute a step in the specified agent task.
*AgentApi* | [**get_agent_task**](agent_protocol_client/docs/AgentApi.md#get_agent_task) | **GET** /ap/v1/agent/tasks/{task_id} | Get details about a specified agent task.
*AgentApi* | [**get_agent_task_step**](agent_protocol_client/docs/AgentApi.md#get_agent_task_step) | **GET** /ap/v1/agent/tasks/{task_id}/steps/{step_id} | Get details about a specified task step.
*AgentApi* | [**list_agent_task_artifacts**](agent_protocol_client/docs/AgentApi.md#list_agent_task_artifacts) | **GET** /ap/v1/agent/tasks/{task_id}/artifacts | List all artifacts that have been created for the given task.
*AgentApi* | [**list_agent_task_steps**](agent_protocol_client/docs/AgentApi.md#list_agent_task_steps) | **GET** /ap/v1/agent/tasks/{task_id}/steps | List all steps for the specified task.
*AgentApi* | [**list_agent_tasks**](agent_protocol_client/docs/AgentApi.md#list_agent_tasks) | **GET** /ap/v1/agent/tasks | List all tasks that have been created for the agent.
*AgentApi* | [**upload_agent_task_artifacts**](agent_protocol_client/docs/AgentApi.md#upload_agent_task_artifacts) | **POST** /ap/v1/agent/tasks/{task_id}/artifacts | Upload an artifact for the specified task.


## Documentation For Models

 - [Artifact](agent_protocol_client/docs/Artifact.md)
 - [GetAgentTask404Response](agent_protocol_client/docs/GetAgentTask404Response.md)
 - [Pagination](agent_protocol_client/docs/Pagination.md)
 - [Step](agent_protocol_client/docs/Step.md)
 - [StepRequestBody](agent_protocol_client/docs/StepRequestBody.md)
 - [Task](agent_protocol_client/docs/Task.md)
 - [TaskArtifactsListResponse](agent_protocol_client/docs/TaskArtifactsListResponse.md)
 - [TaskListResponse](agent_protocol_client/docs/TaskListResponse.md)
 - [TaskRequestBody](agent_protocol_client/docs/TaskRequestBody.md)
 - [TaskStepsListResponse](agent_protocol_client/docs/TaskStepsListResponse.md)
