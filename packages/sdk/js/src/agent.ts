import { v4 as uuid } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'

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
import {
  createApi,
  ApiApp,
  ApiConfig,
  RouteRegisterFn,
  RouteContext,
} from './api'
import { Router } from 'express'

/**
 * A function that handles a step in a task.
 * Returns a step result.
 */
export type StepHandler = (input: StepInput | null) => Promise<StepResult>
/**
 * A function that handles a task.
 * Returns a step handler.
 */
export type TaskHandler = (
  taskId: String,
  input: TaskInput | null
) => Promise<StepHandler>

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
const registerCreateAgentTask: RouteRegisterFn = (router: Router) => {
  router.post('/agent/tasks', (req, res) => {
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
}

/**
 * Lists all tasks that have been created for the agent.
 * @returns Promise<string[]>
 */
export const listAgentTaskIDs = async (): Promise<string[]> => {
  return tasks.map(([task, _]) => task.task_id)
}
const registerListAgentTaskIDs: RouteRegisterFn = (router: Router) => {
  router.get('/agent/tasks', (req, res) => {
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
}

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
const registerGetAgentTask: RouteRegisterFn = (router: Router) => {
  router.get('/agent/tasks/:task_id', (req, res) => {
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
}

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
const registerListAgentTaskSteps: RouteRegisterFn = (router: Router) => {
  router.get('/agent/tasks/:task_id/steps', (req, res) => {
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
}

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
    name: stepResult.name,
    output: stepResult.output ?? null,
    artifacts: stepResult.artifacts ?? [],
    is_last: stepResult.is_last ?? false,
    status: StepStatus.COMPLETED,
  }

  // If there are artifacts in the step, append them to the task's artifacts array (or initialize it if necessary)
  if (step.artifacts && step.artifacts.length > 0) {
    task[0].artifacts = task[0].artifacts ?? []
    task[0].artifacts.push(...step.artifacts)
  }
  steps.push(step)
  return step
}
const registerExecuteAgentTaskStep: RouteRegisterFn = (router: Router) => {
  router.post('/agent/tasks/:task_id/steps', (req, res) => {
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
}

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
const registerGetAgentTaskStep: RouteRegisterFn = (router: Router) => {
  router.get('/agent/tasks/:task_id/steps/:step_id', (req, res) => {
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
}

export const getArtifacts = async (
  taskId: string
): Promise<Artifact[] | undefined> => {
  const task = await getAgentTask(taskId)
  return task.artifacts
}
const registerGetArtifacts: RouteRegisterFn = (router: Router) => {
  router.get('/agent/tasks/:task_id/artifacts', (req, res) => {
    void (async () => {
      const taskId = req.params.task_id
      try {
        const artifacts = await getArtifacts(taskId)
        const current_page = Number(req.query['current_page']) || 1
        const page_size = Number(req.query['page_size']) || 10

        if (!artifacts) {
          res.status(200).send({
            artifacts: [],
            pagination: {
              total_items: 0,
              total_pages: 0,
              current_page,
              page_size,
            },
          })
        }
        const total_items = artifacts.length
        const total_pages = Math.ceil(total_items / page_size)

        // Slice artifacts array based on pagination
        const start = (current_page - 1) * page_size
        const end = start + page_size
        const pagedArtifacts = artifacts.slice(start, end)

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
}

/**
 * Get path of an artifact associated to a task
 * @param taskId Task associated with artifact
 * @param artifact Artifact associated with the path returned
 * @returns Absolute path of the artifact
 */
export const getArtifactPath = (
  taskId: string,
  workspace: string,
  artifact: Artifact
): string => {
  const rootDir = path.isAbsolute(workspace)
    ? workspace
    : path.join(process.cwd(), workspace)

  return path.join(
    rootDir,
    taskId,
    artifact.relative_path ?? '',
    artifact.file_name
  )
}

/**
 * Creates an artifact for a task
 * @param task Task associated with new artifact
 * @param file File that will be added as artifact
 * @param relativePath Relative path where the artifact might be stored. Can be undefined
 */
export const createArtifact = async (
  workspace: string,
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

  const artifactFolderPath = getArtifactPath(task.task_id, workspace, artifact)

  // Save file to server's file system
  fs.mkdirSync(path.join(artifactFolderPath, '..'), { recursive: true })
  fs.writeFileSync(artifactFolderPath, file.buffer)
  return artifact
}
const registerCreateArtifact: RouteRegisterFn = (
  router: Router,
  context: RouteContext
) => {
  router.post('/agent/tasks/:task_id/artifacts', (req, res) => {
    void (async () => {
      try {
        const taskId = req.params.task_id
        const relativePath = req.body.relative_path

        const task = tasks.find(([{ task_id }]) => task_id == taskId)
        if (!task) {
          res
            .status(404)
            .json({ message: 'Unable to find task with the provided id' })
        }

        const files = req.files as Array<Express.Multer.File>
        let file = files.find(({ fieldname }) => fieldname == 'file')
        const artifact = await createArtifact(
          context.workspace,
          task[0],
          file,
          relativePath
        )
        res.status(200).json(artifact)
      } catch (err: Error | any) {
        console.error(err)
        res.status(500).json({ error: err.message })
      }
    })()
  })
}

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
const registerGetTaskArtifact: RouteRegisterFn = (
  router: Router,
  context: RouteContext
) => {
  router.get('/agent/tasks/:task_id/artifacts/:artifact_id', (req, res) => {
    void (async () => {
      const taskId = req.params.task_id
      const artifactId = req.params.artifact_id
      try {
        const artifact = await getTaskArtifact(taskId, artifactId)
        const artifactPath = getArtifactPath(
          taskId,
          context.workspace,
          artifact
        )
        res.status(200).sendFile(artifactPath)
      } catch (err: Error | any) {
        console.error(err)
        res.status(404).json({ error: err.message })
      }
    })()
  })
}

export interface AgentConfig {
  port: number
  workspace: string
}

export const defaultAgentConfig: AgentConfig = {
  port: 8000,
  workspace: './workspace',
}

export class Agent {
  constructor(
    public taskHandler: TaskHandler,
    public config: AgentConfig
  ) {}

  static handleTask(
    _taskHandler: TaskHandler,
    config: Partial<AgentConfig>
  ): Agent {
    taskHandler = _taskHandler
    return new Agent(_taskHandler, {
      workspace: config.workspace || defaultAgentConfig.workspace,
      port: config.port || defaultAgentConfig.port,
    })
  }

  start(port?: number): void {
    const config: ApiConfig = {
      port: port || this.config.port || defaultAgentConfig.port,
      routes: [
        registerCreateAgentTask,
        registerListAgentTaskIDs,
        registerGetAgentTask,
        registerListAgentTaskSteps,
        registerExecuteAgentTaskStep,
        registerGetAgentTaskStep,
        registerGetArtifacts,
        registerCreateArtifact,
        registerGetTaskArtifact,
      ],
      callback: () => {
        console.log(`Agent listening at http://localhost:${this.config.port}`)
      },
      context: {
        workspace: this.config.workspace,
      },
    }

    createApi(config)
  }
}
