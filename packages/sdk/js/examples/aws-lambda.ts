import awsServerlessExpress from 'aws-serverless-express'
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
const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
