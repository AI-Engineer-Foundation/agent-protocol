# Agent Communication Protocol - JavaScript/TypeScript SDK

This SDK implements the Agent Communication Protocol in JavaScript/TypeScript
and allows you to easily wrap your agent in a webserver compatible with the
protocol - you only need to define an agent task handler.

## Installation

```bash
npm install agent-protocol
```

Then add the following code to your agent:

### Typescript

```typescript
import Agent, {
  type StepHandler,
  type StepInput,
  type StepResult,
  type TaskInput,
} from "agent-protocol";

async function taskHandler(taskInput: TaskInput | null): Promise<StepHandler> {
  console.log(`task: ${taskInput}`);

  async function stepHandler(stepInput: StepInput | null): Promise<StepResult> {
    console.log(`step: ${stepInput}`);
    return {
      output: stepInput,
    };
  }

  return stepHandler;
}

Agent.handleTask(taskHandler).start();
```

### Javascript

```javascript
import Agent from "agent-protocol";

async function taskHandler(taskInput) {
  console.log(`task: ${taskInput}`);

  async function stepHandler(stepInput) {
    console.log(`step: ${stepInput}`);
    return {
      output: stepInput,
    };
  }

  return stepHandler;
}

Agent.handleTask(taskHandler).start();
```

## Usage

To start the server run the file where you added the code above:

### Typescript

```bash
# Typescript
$ ts-node file/where/you/added/code.ts

# Javascript
$ node file/where/you/added/code.ts
```

and then you can call the API using the following terminal commands:

To **create a task** run:

```bash
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

Then to **execute one step of the task** copy the `task_id` you got from the
previous request and run:

```bash
curl --request POST \
  --url http://localhost:8000/agent/tasks/<task-id>/steps
```

To get a response like this:

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

## Examples

- [Minimal Typescript Example (Same as Above)](./examples/minimal.ts)
