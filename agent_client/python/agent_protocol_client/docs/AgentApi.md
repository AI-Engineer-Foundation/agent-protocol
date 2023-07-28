# agent_protocol_client.AgentApi

All URIs are relative to _http://localhost_

| Method                                                             | HTTP request                                   | Description                                          |
| ------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------- |
| [**create_agent_task**](AgentApi.md#create_agent_task)             | **POST** /agent/tasks                          | Creates a task for the agent.                        |
| [**execute_agent_task_step**](AgentApi.md#execute_agent_task_step) | **POST** /agent/tasks/{task_id}/steps          | Execute a step in the specified agent task.          |
| [**get_agent_task**](AgentApi.md#get_agent_task)                   | **GET** /agent/tasks/{task_id}                 | Get details about a specified agent task.            |
| [**get_agent_task_step**](AgentApi.md#get_agent_task_step)         | **GET** /agent/tasks/{task_id}/steps/{step_id} | Get details about a specified task step.             |
| [**list_agent_task_steps**](AgentApi.md#list_agent_task_steps)     | **GET** /agent/tasks/{task_id}/steps           | List all steps for the specified task.               |
| [**list_agent_tasks_ids**](AgentApi.md#list_agent_tasks_ids)       | **GET** /agent/tasks                           | List all tasks that have been created for the agent. |

# **create_agent_task**

> Task create_agent_task(task_request_body=task_request_body)

Creates a task for the agent.

### Example

```python
import time
import os
import agent_protocol_client
from agent_protocol_client.models.task import Task
from agent_protocol_client.models.task_request_body import TaskRequestBody
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://localhost"
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
    except Exception as e:
        print("Exception when calling AgentApi->create_agent_task: %s\n" % e)
```

### Parameters

| Name                  | Type                                      | Description | Notes      |
| --------------------- | ----------------------------------------- | ----------- | ---------- |
| **task_request_body** | [**TaskRequestBody**](TaskRequestBody.md) |             | [optional] |

### Return type

[**Task**](Task.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description                               | Response headers |
| ----------- | ----------------------------------------- | ---------------- |
| **200**     | A new agent task was successfuly created. | -                |
| **0**       | Internal Server Error                     | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **execute_agent_task_step**

> Step execute_agent_task_step(task_id, step_request_body=step_request_body)

Execute a step in the specified agent task.

### Example

```python
import time
import os
import agent_protocol_client
from agent_protocol_client.models.step import Step
from agent_protocol_client.models.step_request_body import StepRequestBody
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
async with agent_protocol_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = agent_protocol_client.AgentApi(api_client)
    task_id = 'task_id_example' # str | ID of the task
    step_request_body = agent_protocol_client.StepRequestBody() # StepRequestBody |  (optional)

    try:
        # Execute a step in the specified agent task.
        api_response = await api_instance.execute_agent_task_step(task_id, step_request_body=step_request_body)
        print("The response of AgentApi->execute_agent_task_step:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AgentApi->execute_agent_task_step: %s\n" % e)
```

### Parameters

| Name                  | Type                                      | Description    | Notes      |
| --------------------- | ----------------------------------------- | -------------- | ---------- |
| **task_id**           | **str**                                   | ID of the task |
| **step_request_body** | [**StepRequestBody**](StepRequestBody.md) |                | [optional] |

### Return type

[**Step**](Step.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details

| Status code | Description                       | Response headers |
| ----------- | --------------------------------- | ---------------- |
| **200**     | Executed step for the agent task. | -                |
| **0**       | Internal Server Error             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_agent_task**

> Task get_agent_task(task_id)

Get details about a specified agent task.

### Example

```python
import time
import os
import agent_protocol_client
from agent_protocol_client.models.task import Task
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
async with agent_protocol_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = agent_protocol_client.AgentApi(api_client)
    task_id = 'task_id_example' # str | ID of the task

    try:
        # Get details about a specified agent task.
        api_response = await api_instance.get_agent_task(task_id)
        print("The response of AgentApi->get_agent_task:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AgentApi->get_agent_task: %s\n" % e)
```

### Parameters

| Name        | Type    | Description    | Notes |
| ----------- | ------- | -------------- | ----- |
| **task_id** | **str** | ID of the task |

### Return type

[**Task**](Task.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                           | Response headers |
| ----------- | ------------------------------------- | ---------------- |
| **200**     | Returned details about an agent task. | -                |
| **0**       | Internal Server Error                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_agent_task_step**

> Step get_agent_task_step(task_id, step_id)

Get details about a specified task step.

### Example

```python
import time
import os
import agent_protocol_client
from agent_protocol_client.models.step import Step
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
async with agent_protocol_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = agent_protocol_client.AgentApi(api_client)
    task_id = 'task_id_example' # str | ID of the task
    step_id = 'step_id_example' # str | ID of the step

    try:
        # Get details about a specified task step.
        api_response = await api_instance.get_agent_task_step(task_id, step_id)
        print("The response of AgentApi->get_agent_task_step:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AgentApi->get_agent_task_step: %s\n" % e)
```

### Parameters

| Name        | Type    | Description    | Notes |
| ----------- | ------- | -------------- | ----- |
| **task_id** | **str** | ID of the task |
| **step_id** | **str** | ID of the step |

### Return type

[**Step**](Step.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                                | Response headers |
| ----------- | ------------------------------------------ | ---------------- |
| **200**     | Returned details about an agent task step. | -                |
| **0**       | Internal Server Error                      | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_agent_task_steps**

> List[str] list_agent_task_steps(task_id)

List all steps for the specified task.

### Example

```python
import time
import os
import agent_protocol_client
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
async with agent_protocol_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = agent_protocol_client.AgentApi(api_client)
    task_id = 'task_id_example' # str | ID of the task

    try:
        # List all steps for the specified task.
        api_response = await api_instance.list_agent_task_steps(task_id)
        print("The response of AgentApi->list_agent_task_steps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AgentApi->list_agent_task_steps: %s\n" % e)
```

### Parameters

| Name        | Type    | Description    | Notes |
| ----------- | ------- | -------------- | ----- |
| **task_id** | **str** | ID of the task |

### Return type

**List[str]**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                                                   | Response headers |
| ----------- | ------------------------------------------------------------- | ---------------- |
| **200**     | Returned list of agent&#39;s step IDs for the specified task. | -                |
| **0**       | Internal Server Error                                         | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_agent_tasks_ids**

> List[str] list_agent_tasks_ids()

List all tasks that have been created for the agent.

### Example

```python
import time
import os
import agent_protocol_client
from agent_protocol_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = agent_protocol_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
async with agent_protocol_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = agent_protocol_client.AgentApi(api_client)

    try:
        # List all tasks that have been created for the agent.
        api_response = await api_instance.list_agent_tasks_ids()
        print("The response of AgentApi->list_agent_tasks_ids:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AgentApi->list_agent_tasks_ids: %s\n" % e)
```

### Parameters

This endpoint does not need any parameter.

### Return type

**List[str]**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details

| Status code | Description                            | Response headers |
| ----------- | -------------------------------------- | ---------------- |
| **200**     | Returned list of agent&#39;s task IDs. | -                |
| **0**       | Internal Server Error                  | -                |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
