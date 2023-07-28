from beebot.body import Body

from agent_protocol import (
    Agent,
    StepResult,
    StepHandler,
)


async def task_handler(task_input) -> StepHandler:
    print(f"task: {task_input}")
    body = Body(initial_task=task_input)
    body.setup()

    async def step_handler(step_input):
        print(f"step: {step_input}")
        output = body.cycle()
        return StepResult(output=output)

    return step_handler


Agent.handle_task(task_handler).start()
