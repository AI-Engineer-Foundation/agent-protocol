import Agent from "../src/index";
import {
  StepResult,
  StepHandler
} from "../src/index";

const taskHandler = async (taskInput: any | null): Promise<StepHandler> => {
  console.log(`task: ${taskInput}`)

  const stepHandler = async (stepInput: any | null): Promise<StepResult> => {
    console.log(`step: ${stepInput}`)
    return {
      output: stepInput,
    }
  }

  return stepHandler;
}

const agent = new Agent(taskHandler).start();