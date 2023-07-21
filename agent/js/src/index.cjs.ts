import {
  StepResultWithDefaults,
  createAgentTask,
  listAgentTaskIDs,
  getAgentTask,
  listAgentTaskSteps,
  executeAgentTaskStep,
  getAgentTaskStep,
  Agent,
} from "./agent";

Object.assign(Agent, {
  StepResult: StepResultWithDefaults,
  createAgentTask,
  listAgentTaskIDs,
  getAgentTask,
  listAgentTaskSteps,
  executeAgentTaskStep,
  getAgentTaskStep,
});

export default Agent;
