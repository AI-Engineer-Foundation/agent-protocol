import Agent, {
  type StepResult,
  type StepHandler,
  type TaskInput,
  type StepInput,
} from 'agent-protocol'

async function taskHandler(
  taskId: string,
  taskInput: TaskInput | null
): Promise<StepHandler> {
  console.log(`task ${taskId}: ${taskInput}`)

  async function stepHandler(stepInput: StepInput | null): Promise<StepResult> {
    console.log(`step: ${stepInput}`)
    return {
      output: stepInput,
    }
  }

  return stepHandler
}

Agent.handleTask(taskHandler).start()
