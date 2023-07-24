<h1 align="center">
  <img width="200" src="https://raw.githubusercontent.com/e2b-dev/e2b/main/docs-assets/logoname-black.svg#gh-light-mode-only" alt="e2b">
  <img width="200" src="https://raw.githubusercontent.com/e2b-dev/e2b/main/docs-assets/logoname-white.svg#gh-dark-mode-only" alt="e2b">
  Agent Protocol
</h1>

<h2 align="center">Developer-first platform for deploying, testing, and monitoring AI agents</h2>

<h4 align="center">
  <a href="https://e2b.dev">Website</a> |
  <a href="https://discord.gg/U7KEcGErtQ">Discord</a> |
  <a href="https://twitter.com/e2b_dev">Twitter</a>
</h4>

<h4 align="center">
  <a href="https://discord.gg/U7KEcGErtQ">
    <img src="https://img.shields.io/badge/chat-on%20Discord-blue" alt="Discord community server" />
  </a>
  <a href="https://twitter.com/e2b_dev">
    <img src="https://img.shields.io/twitter/follow/infisical?label=Follow" alt="e2b Twitter" />
  </a>
</h4>

## Development

This was developed with the following dependencies:

- _node v18.16.0_
- _ts-node v10.9.1_
- _pnpm 8.6.9_

During development, you should be able to simply import the Agent from `src/index.ts` and run using `ts-node`.

## Example

The minimal example is below. This creates a simple agent which performs no tasks itself, but does create the agent API.

```typescript
import Agent, {
  type StepResult,
  type StepHandler,
  type TaskInput,
  type StepInput,
} from "agent-protocol";

const taskHandler = async (
  taskInput: TaskInput | null,
): Promise<StepHandler> => {
  console.log(`task: ${taskInput}`);

  const stepHandler = async (
    stepInput: StepInput | null,
  ): Promise<StepResult> => {
    console.log(`step: ${stepInput}`);
    return {
      output: stepInput,
    };
  };

  return stepHandler;
};

Agent.handleTask(taskHandler).start();
```

Run `ts-node` on the example above and you should see the following:

```
Agent listening at http://localhost:8000
```

You can then experiment with the SDK via CURL, as the examples below:

```bash
$ curl -X POST -H "Content-Type: application/json" -d '{ "input": "This is a test of the emergency broadcast system." }' http://localhost:8000/agent/tasks # Create a new Task for the agent
```

```bash
$ curl -X GET -H "Content-Type: application/json" http://localhost:8000/agent/tasks # Get tasks
```

Feel free to ask questions on our Discord, or sign up for the newsletter for updates!
