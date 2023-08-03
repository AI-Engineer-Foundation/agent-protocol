import * as OpenApiValidator from 'express-openapi-validator'
import express from 'express'
import { v4 as uuid } from 'uuid'
import yaml from 'js-yaml'

import {
  type TaskInput,
  type Artifact,
  type StepInput,
  type StepOutput,
  type Step,
  type StepRequestBody,
  type StepResult,
  type Task,
  type TaskRequestBody,
} from './models'

import spec from '../../../openapi.yml'

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }))

app.get(
  '/openapi.yaml',
  (_, res) => {
    res
      .setHeader('Content-Type', 'text/yaml')
      .status(200)
      .send(spec)
  }
)

const parsedSpec = yaml.load(spec)

app.use(
  OpenApiValidator.middleware({
    apiSpec: parsedSpec as any,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  })
)

/**
 * A function that handles a step in a task.
 * Returns a step result.
 */
export type StepHandler = (input: StepInput | null) => Promise<StepResult>
/**
 * A function that handles a task.
 * Returns a step handler.
 */
export type TaskHandler = (input: TaskInput | null) => Promise<StepHandler>

const tasks: Array<[Task, StepHandler]> = []
const steps: Step[] = []

let taskHandler: TaskHandler | null = null

/**
 * A step result with default values.
 * @returns StepResult
 */
export class StepResultWithDefaults implements StepResult {
  output?: StepOutput = null
  artifacts?: Artifact[] = []
  is_last?: boolean = false
}

/**
 * Creates a task for the agent.
 * @param body TaskRequestBody | null
 * @returns Promise<Task>
 */
export const createAgentTask = async (
  body: TaskRequestBody | null
): Promise<Task> => {
  if (taskHandler == null) {
    throw new Error('Task handler not defined')
  }
  const stepHandler = await taskHandler(body?.input ?? null)
  const task: Task = {
    task_id: uuid(),
    input: body?.input ?? null,
    artifacts: [],
  }
  tasks.push([task, stepHandler])
  return task
}
app.post('/agent/tasks', (req, res) => {
  void (async () => {
    try {
      const task = await createAgentTask(req.body)
      res.status(200).json(task)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

/**
 * Lists all tasks that have been created for the agent.
 * @returns Promise<string[]>
 */
export const listAgentTaskIDs = async (): Promise<string[]> => {
  return tasks.map(([task, _]) => task.task_id)
}
app.get('/agent/tasks', (req, res) => {
  void (async () => {
    try {
      const ids = await listAgentTaskIDs()
      res.status(200).json(ids)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

/**
 * Get details about a specified agent task.
 * @param taskId string
 * @returns
 */
export const getAgentTask = async (taskId: string): Promise<Task> => {
  const task = tasks.find(([task, _]) => task.task_id === taskId)
  if (task == null) {
    throw new Error(`Task with id ${taskId} not found`)
  }
  return task[0]
}
app.get('/agent/tasks/:task_id', (req, res) => {
  void (async () => {
    try {
      const task = await getAgentTask(req.params.task_id)
      res.status(200).json(task)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

/**
 * Lists all steps for the specified task.
 * @param taskId string
 * @returns Promise<string[]>
 */
export const listAgentTaskSteps = async (taskId: string): Promise<string[]> => {
  const task = tasks.find(([task, _]) => task.task_id === taskId)
  if (task == null) {
    throw new Error(`Task with id ${taskId} not found`)
  }
  return steps
    .filter((step) => step.task_id === taskId)
    .map((step) => step.step_id)
}
app.get('/agent/tasks/:task_id/steps', (req, res) => {
  void (async () => {
    try {
      const ids = await listAgentTaskSteps(req.params.task_id)
      res.status(200).json(ids)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

/**
 * Execute a step in the specified agent task.
 * @param taskId string
 * @param body StepRequestBody | null
 * @returns Promise<Step>
 */
export const executeAgentTaskStep = async (
  taskId: string,
  body: StepRequestBody | null
): Promise<Step> => {
  const task = tasks.find(([task, _]) => task.task_id === taskId)
  if (task == null) {
    throw new Error(`Task with id ${taskId} not found`)
  }
  const handler = task[1]
  const stepResult = await handler(body?.input ?? null)
  const step: Step = {
    task_id: taskId,
    step_id: uuid(),
    input: body?.input ?? null,
    output: stepResult.output ?? null,
    artifacts: stepResult.artifacts ?? [],
    is_last: stepResult.is_last ?? false,
  }
  if (step.artifacts != null) {
    if (task[0].artifacts == null || task[0].artifacts.length === 0) {
      task[0].artifacts = step.artifacts
    } else {
      task[0].artifacts.push(...step.artifacts)
    }
  }
  steps.push(step)
  return step
}
app.post('/agent/tasks/:task_id/steps', (req, res) => {
  void (async () => {
    try {
      const step = await executeAgentTaskStep(req.params.task_id, req.body)
      res.status(200).json(step)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

/**
 * Get details about a specified task step.
 * @param taskId string
 * @param stepId string
 * @returns Promise<Step>
 */
export const getAgentTaskStep = async (
  taskId: string,
  stepId: string
): Promise<Step> => {
  const step = steps.find(
    (step) => step.task_id === taskId && step.step_id === stepId
  )
  if (step == null) {
    throw new Error(
      `Step with task id ${taskId} and step id ${stepId} not found`
    )
  }
  return step
}
app.get('/agent/tasks/:task_id/steps/:step_id', (req, res) => {
  void (async () => {
    try {
      const step = await getAgentTaskStep(
        req.params.task_id,
        req.params.step_id
      )
      res.status(200).json(step)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

export class Agent {
  static handleTask(handler: TaskHandler): typeof Agent {
    taskHandler = handler
    return this
  }

  static start(port: number = 8000): void {
    app.listen(port, () => {
      console.log(`Agent listening at http://localhost:${port}`)
    })
  }
}
