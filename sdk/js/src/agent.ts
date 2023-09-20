import * as OpenApiValidator from 'express-openapi-validator'
import express from 'express'
import { v4 as uuid } from 'uuid'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

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
  StepStatus,
} from './models'

import spec from '../../../schemas/openapi.yml'

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }))

const WORKSPACE = process.env.AGENT_WORKSPACE ?? 'workspace'

app.get('/openapi.yaml', (_, res) => {
  res.setHeader('Content-Type', 'text/yaml').status(200).send(spec)
})

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
export type TaskHandler = (taskId: String, input: TaskInput | null) => Promise<StepHandler>

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
  const task: Task = {
    task_id: uuid(),
    input: body?.input ?? null,
    artifacts: [],
  }
  const stepHandler = await taskHandler(task.task_id, body?.input ?? null)
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
    status: StepStatus.COMPLETED,
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

/**
 * Get path of an artifact associated to a task
 * @param taskId Task associated with artifact
 * @param artifact Artifact associated with the path returned
 * @returns Absolute path of the artifact
 */
export const getArtifactPath = (taskId: string, artifact: Artifact): string => {
  return path.join(
    process.cwd(),
    WORKSPACE,
    taskId,
    artifact.relative_path ?? '',
    artifact.file_name
  )
}

app.get('/agent/tasks/:task_id/artifacts', (req, res) => {
  void (async () => {
    const taskId = req.params.task_id
    try {
      const task = await getAgentTask(taskId)
      const current_page = Number(req.query['current_page']) || 1
      const page_size = Number(req.query['page_size']) || 10

      if (!task.artifacts) {
        return res.status(200).send({
          artifacts: [],
          pagination: {
            total_items: 0,
            total_pages: 0,
            current_page,
            page_size,
          },
        })
      }
      const total_items = task.artifacts.length
      const total_pages = Math.ceil(total_items / page_size)

      // Slice artifacts array based on pagination
      const start = (current_page - 1) * page_size
      const end = start + page_size
      const pagedArtifacts = task.artifacts.slice(start, end)

      res.status(200).send({
        artifacts: pagedArtifacts,
        pagination: {
          total_items,
          total_pages,
          current_page,
          page_size,
        },
      })
    } catch (err: Error | any) {
      console.error(err)
      res.status(404).json({ error: err.message })
    }
  })()
})

/**
 * Creates an artifact for a task
 * @param task Task associated with new artifact
 * @param file File that will be added as artifact
 * @param relativePath Relative path where the artifact might be stored. Can be undefined
 */
export const createArtifact = async (
  task: Task,
  file: any,
  relativePath?: string
): Promise<Artifact> => {
  const artifactId = uuid()
  const artifact: Artifact = {
    artifact_id: artifactId,
    agent_created: false,
    file_name: file.originalname,
    relative_path: relativePath || null,
    created_at: Date.now().toString(),
  }
  task.artifacts = task.artifacts || []
  task.artifacts.push(artifact)

  const artifactFolderPath = getArtifactPath(task.task_id, artifact)

  // Save file to server's file system
  fs.mkdirSync(path.join(artifactFolderPath, '..'), { recursive: true })
  fs.writeFileSync(artifactFolderPath, file.buffer)
  return artifact
}

app.post('/agent/tasks/:task_id/artifacts', (req, res) => {
  void (async () => {
    try {
      const taskId = req.params.task_id
      const relativePath = req.body.relative_path

      const task = tasks.find(([{ task_id }]) => task_id == taskId)
      if (!task) {
        return res
          .status(404)
          .json({ message: 'Unable to find task with the provided id' })
      }

      const files = req.files as Array<Express.Multer.File>
      let file = files.find(({ fieldname }) => fieldname == 'file')
      const artifact = await createArtifact(task[0], file, relativePath)
      res.status(200).json(artifact)
    } catch (err: Error | any) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  })()
})

/**
 * Get an artifact of a task
 * @param taskId ID of task associated with artifact
 * @param artifactId ID of artifact to be retrieved
 * @returns A stored artifact
 */
export const getTaskArtifact = async (
  taskId: string,
  artifactId: string
): Promise<Artifact> => {
  const task = await getAgentTask(taskId)
  const artifact = task.artifacts?.find((a) => a.artifact_id === artifactId)
  if (!artifact) {
    throw new Error(
      `Artifact with id ${artifactId} in task with id ${taskId} was not found`
    )
  }
  return artifact
}

app.get('/agent/tasks/:task_id/artifacts/:artifact_id', (req, res) => {
  void (async () => {
    const taskId = req.params.task_id
    const artifactId = req.params.artifact_id
    try {
      const artifact = await getTaskArtifact(taskId, artifactId)
      const artifactPath = getArtifactPath(taskId, artifact)
      res.status(200).sendFile(artifactPath)
    } catch (err: Error | any) {
      console.error(err)
      res.status(404).json({ error: err.message })
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
