from e2b_agent import Agent, AgentStep

async def task_step(task) -> AgentStep:
  print("Handling step of task", task)
  return AgentStep()

Agent.handle_task_step(task_step).start()
