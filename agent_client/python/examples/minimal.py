import asyncio
from agent_protocol_client import (
    Configuration,
    ApiClient,
    TaskRequestBody,
    AgentApi,
)

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = Configuration(host="http://localhost:8000")


async def main():
    # Enter a context with an instance of the API client
    async with ApiClient(configuration) as api_client:
        # Create an instance of the API class
        api_instance = AgentApi(api_client)
        task_request_body = TaskRequestBody(input="Write 'Hello world!' to hi.txt.")

        response = await api_instance.create_agent_task(
            task_request_body=task_request_body
        )
        print("The response of AgentApi->create_agent_task:\n")
        print(response)
        print("\n\n")

        task_id = response.task_id
        response = await api_instance.execute_agent_task_step(task_id=task_id)
        print("The response of AgentApi->execute_agent_task_step:\n")
        print(response)
        print("\n\n")

        while (
            step := await api_instance.execute_agent_task_step(task_id=task_id)
        ) and step.is_last is False:
            print("The response of AgentApi->execute_agent_task_step:\n")
            print(step)
            print("\n\n")

        print("Agent finished its work!")


asyncio.run(main())
