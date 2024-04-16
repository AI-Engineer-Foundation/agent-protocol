import { v4 as uuid } from 'uuid'

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
  type ApiConfig,
  type RouteRegisterFn,
} from './api'
import { type Router, type Express } from 'express'
import { FileStorage, type ArtifactStorage } from './artifacts'

export interface RouteContext {
  agent: Agent
}

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
  taskId: string,
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
    additional_input: body?.additional_input ?? {},
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
export const listAgentTasks = async (): Promise<Task[]> => {
  return tasks.map(([task, _]) => task)
}
const registerListAgentTasks: RouteRegisterFn = (router: Router) => {
  router.get('/agent/tasks', (req, res) => {
    void (async () => {
      try {
        const tasks = await listAgentTasks()

        let currentPage = 1
        let pageSize = 10
        if (
          req.query.current_page !== undefined &&
          !isNaN(Number(req.query.current_page))
        ) {
          currentPage = Number(req.query.current_page)
        }

        if (
          req.query.page_size !== undefined &&
          !isNaN(Number(req.query.page_size))
        ) {
          pageSize = Number(req.query.page_size)
        }

        const totalItems = tasks.length
        const totalPages = Math.ceil(totalItems / pageSize)

        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        const pagedTasks = tasks.slice(start, end)

        res.status(200).json({
          tasks: pagedTasks,
          pagination: {
            total_items: totalItems,
            total_pages: totalPages,
            current_page: currentPage,
            page_size: pageSize,
          }
        })
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
  if (step.artifacts != null && step.artifacts.length > 0) {
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
        if (artifacts === undefined) {
          return res
            .status(404)
            .json({ error: `Task with id ${taskId} not found` })
        }
        let currentPage = 1
        let pageSize = 10
        if (
          req.query.current_page !== undefined &&
          !isNaN(Number(req.query.current_page))
        ) {
          currentPage = Number(req.query.current_page)
        }

        if (
          req.query.page_size !== undefined &&
          !isNaN(Number(req.query.page_size))
        ) {
          pageSize = Number(req.query.page_size)
        }

        const totalItems = artifacts.length
        const totalPages = Math.ceil(totalItems / pageSize)

        // Slice artifacts array based on pagination
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        const pagedArtifacts = artifacts.slice(start, end)

        res.status(200).send({
          artifacts: pagedArtifacts,
          pagination: {
            total_items: totalItems,
            total_pages: totalPages,
            current_page: currentPage,
            page_size: pageSize,
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
 * Creates an artifact for a task
 * @param task Task associated with new artifact
 * @param file File that will be added as artifact
 * @param relativePath Relative path where the artifact might be stored. Can be undefined
 */
export const createArtifact = async (
  task: Task,
  agent: Agent,
  file: Express.Multer.File,
  relativePath?: string
): Promise<Artifact> => {
  const artifactId = uuid()
  const artifact: Artifact = {
    artifact_id: artifactId,
    agent_created: false,
    file_name: file.originalname,
    relative_path: relativePath ?? null,
    created_at: Date.now().toString(),
  }
  task.artifacts =
    task.artifacts !== null && task.artifacts !== undefined
      ? task.artifacts
      : []
  task.artifacts.push(artifact)

  // Save the file
  const [storage, workspace] = agent.getArtifactStorageAndWorkspace(
    task.task_id
  )
  await storage.writeArtifact(task.task_id, workspace, artifact, file)
  return artifact
}
const registerCreateArtifact: RouteRegisterFn = (
  router: Router,
  agent: Agent
) => {
  router.post('/agent/tasks/:task_id/artifacts', (req, res) => {
    void (async () => {
      try {
        const taskId = req.params.task_id
        const relativePath = req.body.relative_path

        const task = tasks.find(
          ([{ task_id: originalTaskId }]) => originalTaskId === taskId
        )
        if (task === undefined) {
          return res
            .status(404)
            .json({ message: 'Unable to find task with the provided id' })
        }

        const files = req.files as Express.Multer.File[]
        const file = files.find(({ fieldname }) => fieldname === 'file')

        if (file == null) {
          res.status(400).json({ message: 'No file found in the request' })
        } else {
          const artifact = await createArtifact(
            task[0],
            agent,
            file,
            relativePath
          )
          res.status(200).json(artifact)
        }
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
  if (artifact == null) {
    throw new Error(
      `Artifact with id ${artifactId} in task with id ${taskId} was not found`
    )
  }
  return artifact
}
const registerGetTaskArtifact: RouteRegisterFn = (
  router: Router,
  agent: Agent
) => {
  router.get('/agent/tasks/:task_id/artifacts/:artifact_id', (req, res) => {
    void (async () => {
      const taskId = req.params.task_id
      const artifactId = req.params.artifact_id
      try {
        const artifact = await getTaskArtifact(taskId, artifactId)
        const [storage, workspace] =
          agent.getArtifactStorageAndWorkspace(taskId)
        const artifactPath = storage.getArtifactPath(
          taskId,
          workspace,
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
  artifactStorage: ArtifactStorage
}

export const defaultAgentConfig: AgentConfig = {
  port: 8000,
  workspace: './workspace',
  artifactStorage: new FileStorage(),
}

export class Agent {
  private workspace: string
  private artifactStorage: ArtifactStorage

  constructor(
    public taskHandler: TaskHandler,
    public config: AgentConfig
  ) {
    this.artifactStorage = config.artifactStorage
    this.workspace = config.workspace
  }

  static handleTask(
    _taskHandler: TaskHandler,
    config: Partial<AgentConfig>
  ): Agent {
    taskHandler = _taskHandler
    return new Agent(_taskHandler, {
      workspace: config.workspace ?? defaultAgentConfig.workspace,
      port: config.port ?? defaultAgentConfig.port,
      artifactStorage:
        config.artifactStorage ?? defaultAgentConfig.artifactStorage,
    })
  }

  build(port?: number): Express {
    const config = this.buildApiConfig(port)
    return createApi(config, false)
  }

  start(port?: number): void {
    const config = this.buildApiConfig(port)
    createApi(config)
  }

  private buildApiConfig(port?: number): ApiConfig {
    return {
      port: port ?? this.config.port ?? defaultAgentConfig.port,
      routes: [
        registerCreateAgentTask,
        registerListAgentTasks,
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
        agent: this,
      },
    }
  }

  /**
   * @param taskId (potentially) POST /agent/tasks { additional_input } could configure the artifactStorage and/or workspace for a Task
   */
  getArtifactStorageAndWorkspace(taskId: string): [ArtifactStorage, string] {
    return [this.artifactStorage, this.workspace]
  }

  /** It's easier for Serverless apps to configure artifactStorage after the app has been created */
  setArtifactStorage(storage: ArtifactStorage): void {
    this.artifactStorage = storage
  }

  setWorkspace(workspace: string): void {
    this.workspace = workspace
  }
}
