import * as OpenApiValidator from "express-openapi-validator";
import express from "express";
import path from "path";
import { v4 as uuid } from "uuid";
import {
  TaskInput,
  Artifact,
  StepInput,
  StepOutput,
  Step,
  StepRequestBody,
  StepResult,
  Task,
  TaskRequestBody,
} from "./models";

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

const spec = path.join(__dirname, "../openapi.yml");

app.use("/spec", express.static(spec));

app.use(
  OpenApiValidator.middleware({
    apiSpec: "../openapi.yml",
    validateRequests: true, // (default)
    validateResponses: true, // false by default
    operationHandlers: {
      basePath: path.join(__dirname, "./handlers"),
      resolver: (req: any, res: any) => {
        console.log("operationHandlers resolver", req, res);
      }
    },
  })
);

/**
 * A function that handles a step in a task.
 * Returns a step result.
 */
export type StepHandler = (input: StepInput | null) => Promise<StepResult>;
/**
 * A function that handles a task.
 * Returns a step handler.
 */
export type TaskHandler = (input: TaskInput | null) => Promise<StepHandler>;

let tasks: Array<[Task, StepHandler]> = [];
let steps: Step[] = [];

let taskHandler: TaskHandler | null = null;

/**
 * A step result with default values.
 * @returns StepResult
 */
export class StepResultWithDefaults implements StepResult {
  output?: StepOutput = null;
  artifacts?: Artifact[] = [];
  isLast?: boolean = false;
}

/**
 * Creates a task for the agent.
 * @param body TaskRequestBody | null
 * @returns Promise<Task>
 */
export const createAgentTask = async (body: TaskRequestBody | null): Promise<Task> => {
  if (!taskHandler) {
    throw new Error("Task handler not defined");
  }
  let stepHandler = await taskHandler(body?.input ?? null);
  let task: Task = {
    taskId: uuid(),
    input: body?.input ?? null,
    artifacts: [],
  }
  tasks.push([task, stepHandler]);
  return task;
}
app.post("/agent/task", async (req, res) => {
  try {
    let task = await createAgentTask(req.body);
    res.status(200).json(task);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Lists all tasks that have been created for the agent.
 * @returns Promise<string[]>
 */
export const listAgentTaskIDs = async (): Promise<string[]> => {
  return tasks.map(([task, _]) => task.taskId);
}
app.get("/agent/tasks", async (req, res) => {
  try {
    let ids = await listAgentTaskIDs();
    res.status(200).json(ids);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get details about a specified agent task.
 * @param taskId string
 * @returns 
 */
export const getAgentTask = async (taskId: string): Promise<Task> => {
  let task = tasks.find(([task, _]) => task.taskId === taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  return task[0];
}
app.get("/agent/task/:task_id", async (req, res) => {
  try {
    let task = await getAgentTask(req.params.task_id);
    res.status(200).json(task);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Lists all steps for the specified task.
 * @param taskId string
 * @returns Promise<string[]>
 */
export const listAgentTaskSteps = async (taskId: string): Promise<string[]> => {
  let task = tasks.find(([task, _]) => task.taskId === taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  return steps.filter(step => step.taskId === taskId).map(step => step.stepId);
}
app.get("/agent/task/:task_id/steps", async (req, res) => {
  try {
    let ids = await listAgentTaskSteps(req.params.task_id);
    res.status(200).json(ids);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Execute a step in the specified agent task.
 * @param taskId string
 * @param body StepRequestBody | null
 * @returns Promise<Step>
 */
export const executeAgentTaskStep = async (taskId: string, body: StepRequestBody | null): Promise<Step> => {
  let task = tasks.find(([task, _]) => task.taskId === taskId);
  if (!task) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  let handler = task[1]
  let stepResult = await handler(body?.input ?? null);
  let step: Step = {
    taskId: taskId,
    stepId: uuid(),
    input: body?.input ?? null,
    output: stepResult.output ?? null,
    artifacts: stepResult.artifacts ?? [],
    isLast: stepResult.isLast ?? false,
  }
  if (step.artifacts) {
    if (!task[0].artifacts || task[0].artifacts.length === 0) {
      task[0].artifacts = step.artifacts;
    } else {
      task[0].artifacts.push(...step.artifacts);
    }
  }
  steps.push(step);
  return step;
}
app.post("/agent/task/:task_id/steps", async (req, res) => {
  try {
    let step = await executeAgentTaskStep(req.params.task_id, req.body);
    res.status(200).json(step);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get details about a specified task step.
 * @param taskId string
 * @param stepId string
 * @returns Promise<Step>
 */
export const getAgentTaskStep = async (taskId: string, stepId: string): Promise<Step> => {
  let step = steps.find(step => step.taskId === taskId && step.stepId === stepId);
  if (!step) {
    throw new Error(`Step with task id ${taskId} and step id ${stepId} not found`);
  }
  return step;
}
app.get("/agent/task/:task_id/step/:step_id", async (req, res) => {
  try {
    let step = await getAgentTaskStep(req.params.task_id, req.params.step_id);
    res.status(200).json(step);
  } catch (err: Error | any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export class Agent {
  constructor(handler: TaskHandler) {
    taskHandler = handler;
  }

  start(port: number = 8000) {
    app.listen(port, () => {
      console.log(`Agent listening at http://localhost:${port}`);
    });
  }
}