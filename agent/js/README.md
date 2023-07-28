# Agent Communication Protocol - JavaScript/TypeScript SDK

This SDK implements the Agent Communication Protocol in JavaScript/TypeScript and allows you to easily wrap your agent in a webserver compatible with the protocol - you only need to define an agent task handler.

## Installation

```bash
npm install agent-protocol
```

Then add the following code to your agent:

```typescript
import Agent, {
  type StepResult,
  type StepHandler,
  type TaskInput,
  type StepInput,
} from 'agent-protocol'

const taskHandler = async (
  taskInput: TaskInput | null
): Promise<StepHandler> => {
  console.log(`task: ${taskInput}`)

  const stepHandler = async (
    stepInput: StepInput | null
  ): Promise<StepResult> => {
    console.log(`step: ${stepInput}`)
    return {
      output: stepInput,
    }
  }

  return stepHandler
}

Agent.handleTask(taskHandler).start()
```

## Usage

## Examples
