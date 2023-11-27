/**
 * Input parameters for the task. Any value is allowed.
 */
export type TaskInput = any

/**
 * Artifact that the task has produced. Any value is allowed.
 */
export type Artifact = {
  artifact_id: string
  agent_created: boolean
  file_name: string
  relative_path: string | null
  created_at: string
}

/**
 * Input parameters for the task step. Any value is allowed.
 */
export type StepInput = any

/**
 * Output that the task step has produced. Any value is allowed.
 */
export type StepOutput = any

export enum StepStatus {
  CREATED = 'created',
  RUNNING = 'running',
  COMPLETED = 'completed',
}

export interface Step {
  /**
   * The name of the task step
   */
  name?: string
  /**
   * Output of the task step
   */
  output?: StepOutput
  /**
   * A list of artifacts that the step has produced.
   */
  artifacts?: Artifact[]
  /**
   * Whether this is the last step in the task.
   */
  is_last?: boolean
  input?: StepInput
  /**
   * The ID of the task this step belongs to.
   */
  task_id: string
  /**
   * The ID of the task step.
   */
  step_id: string
  /**
   * Current status of step
   */
  status: StepStatus
}

export interface StepRequestBody {
  input?: StepInput
}

export interface StepResult {
  /**
   * The name of the step
   */
  name?: string
  /**
   * Output of the step
   */
  output?: StepOutput
  /**
   * A list of artifacts that the step has produced.
   */
  artifacts?: Artifact[]
  /**
   * Whether this is the last step in the task.
   */
  is_last?: boolean
}

export interface Task {
  input?: TaskInput
  /**
   * The ID of the task.
   */
  task_id: string
  /**
   * A list of artifacts that the task has produced.
   */
  artifacts?: Artifact[]
}

export interface TaskRequestBody {
  input?: TaskInput
}
