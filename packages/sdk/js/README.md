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

const config = {
  // port: 8000,
  // workspace: './workspace'
}
Agent.handleTask(taskHandler, config).start()
```

Note: By default, artifacts will be saved/read from disk, but you can configure other options using the [any-cloud-storage](https://github.com/nalbion/any-cloud-storage) library:

```typescript
import { ArtifactStorageFactory } from 'agent-protocol/artifacts'
artifactStorage = ArtifactStorageFactory.create({
  type: 's3',
  bucket: 'my-bucket',
  region: 'us-west-2',
  // other AWS S3 configuration options...
})

const config = { artifactStorage }
Agent.handleTask(taskHandler, config).start()
```

## Docs

You can find more info and examples in the [docs](https://agentprotocol.ai/sdks/js).

## Contributing

```bash
git clone https://github.com/AI-Engineers-Foundation/agent-protocol
cd agent-protocol/packages/sdk/js
npm install
npm run build
```
