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
