import { Configuration, AgentApi, TaskRequestBody, StepRequestBody } from 'agent-protocol-client';

// Defining the host is optional and defaults to http://localhost
// See configuration.ts for a list of all supported configuration parameters.
const configuration = new Configuration({ basePath: "http://localhost:8000" });

async function main() {
    // Create an instance of the API client
    const apiInstance = new AgentApi(configuration);
    // Create an instance of the API class
    const taskRequestBody: TaskRequestBody = {
      input: "Write 'Hello world!' to hi.txt."
    };

    const response = await apiInstance.createAgentTask({ taskRequestBody });
    console.log("The response of AgentApi->createAgentTask:\n");
    console.log(response);
    console.log("\n\n");

    const taskId = response.taskId;
    let i = 1;

    while (true) {
        const stepRequestBody: StepRequestBody = {
          input: String(i)
        };
        const step = await apiInstance.executeAgentTaskStep({ taskId, stepRequestBody });

        if (!step || step.isLast) {
            break;
        }

        console.log("The response of AgentApi->executeAgentTaskStep:\n");
        console.log(step);
        console.log("\n\n");
        i += 1;
    }

    console.log("Agent finished its work!");
}

main().catch(console.error);