from agent_protocol import Agent, Task, Step


async def task_handler(task: Task) -> None:
    print(f"task: {task.input}")
    await Agent.db.create_step(task.task_id, task.input)


async def step_handler(step: Step) -> Step:
    print(f"step: {step.input}")
    await Agent.db.create_step(step.task_id, f"Next step from step {step.name}")
    step.output = step.input
    return step


Agent.setup_agent(task_handler, step_handler).start()
