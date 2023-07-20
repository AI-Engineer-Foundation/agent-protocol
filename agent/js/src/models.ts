/**
 * Input parameters for the task. Any value is allowed.
 */
export type TaskInput = any;

/**
 * Artifact that the task has produced. Any value is allowed.
 */
export type Artifact = any;

/**
 * Input parameters for the task step. Any value is allowed.
 */
export type StepInput = any;

/**
 * Output that the task step has produced. Any value is allowed.
 */
export type StepOutput = any;

export interface Step {
  output?: StepOutput;
  /**
   * A list of artifacts that the step has produced.
   */
  artifacts?: Artifact[];
  /**
   * Whether this is the last step in the task.
   */
  isLast?: boolean;
  input?: StepInput;
  /**
   * The ID of the task this step belongs to.
   */
  taskId: string;
  /**
   * The ID of the task step.
   */
  stepId: string;
}

export interface StepRequestBody {
  input?: StepInput;
}

export interface StepResult {
  output?: StepOutput;
  /**
   * A list of artifacts that the step has produced.
   */
  artifacts?: Artifact[];
  /**
   * Whether this is the last step in the task.
   */
  isLast?: boolean;
}

export interface Task {
  input?: TaskInput;
  /**
   * The ID of the task.
   */
  taskId: string;
  /**
   * A list of artifacts that the task has produced.
   */
  artifacts?: Artifact[];
}

export interface TaskRequestBody {
  input?: TaskInput;
}
