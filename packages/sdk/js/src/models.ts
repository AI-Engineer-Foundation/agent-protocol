/**
 * Input prompt for the task.
 */
export type TaskInput = string | null | undefined

/**
 * Artifact that the task has produced. Any value is allowed.
 */
export interface Artifact {
  artifact_id: string
  agent_created: boolean
  file_name: string
  relative_path?: string | null
  created_at?: string
}

/**
 * Input parameters for the task step. Any value is allowed.
 */
export type StepInput = string | null | undefined

/**
 * Output that the task step has produced. Any value is allowed.
 */
export type StepOutput = string | null | undefined

export type AdditionalOutput = any

export enum StepStatus {
  CREATED = 'created',
  RUNNING = 'running',
  COMPLETED = 'completed',
}

export interface Step {
  input?: StepInput
  additional_input?: AdditionalInput

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

  /**
   * The name of the task step
   */
  name?: string
  /**
   * Output of the task step
   */
  output?: StepOutput
  additional_output?: AdditionalOutput

  /**
   * A list of artifacts that the step has produced.
   */
  artifacts?: Artifact[]
  /**
   * Whether this is the last step in the task.
   * @default false
   */
  is_last?: boolean
}

export interface StepRequestBody {
  input?: StepInput
  additional_input?: AdditionalInput
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
  additional_input?: AdditionalInput
}

export type AdditionalInput = any
