import functions from '@google-cloud/functions-framework'
import Agent, {
  type StepResult,
  type StepHandler,
  type TaskInput,
  type StepInput,
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

const app = Agent.handleTask(taskHandler, {}).build()
functions.http('agentprotocol', app)
