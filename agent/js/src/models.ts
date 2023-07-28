/**
 * Input parameters for the task. Any value is allowed.
 */
export type TaskInput = any

/**
 * Artifact that the task has produced. Any value is allowed.
 */
export type Artifact = any

/**
 * Input parameters for the task step. Any value is allowed.
 */
export type StepInput = any

/**
 * Output that the task step has produced. Any value is allowed.
 */
export type StepOutput = any

export interface Step {
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
}

export interface StepRequestBody {
  input?: StepInput
}

export interface StepResult {
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
