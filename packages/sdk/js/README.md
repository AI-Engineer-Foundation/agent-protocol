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
} from 'agent-protocol'

async function taskHandler(taskInput: TaskInput | null): Promise<StepHandler> {
  console.log(`task: ${taskInput}`)

  async function stepHandler(stepInput: StepInput | null): Promise<StepResult> {
    console.log(`step: ${stepInput}`)
    return {
      output: stepInput,
    }
  }

  return stepHandler
}

Agent.handleTask(taskHandler, {}).start()
```

See the [https://github.com/AI-Engineer-Foundation/agent-protocol/tree/main/packages/sdk/js/examples](examples folder) for running in serverless environments.

## Docs

You can find more info and examples in the [docs](https://agentprotocol.ai/sdks/js).

## Contributing

```bash
git clone https://github.com/AI-Engineers-Foundation/agent-protocol
cd agent-protocol/packages/sdk/js
npm install
npm run build
```
