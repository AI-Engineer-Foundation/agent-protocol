from beebot.body import Body

from agent_protocol import (
    Agent,
    AgentTaskInput,
    AgentStepInput,
    AgentStepResult,
    AgentStepHandler,
    Agent,
)


async def task_handler(task: AgentTaskInput | None) -> AgentStepHandler:
    print(f"task: {task}")
    body = Body(initial_task=task)
    body.setup()

    async def step_handler(step: AgentStepInput | None):
        print(f"step: {step}")
        output = body.cycle()
        return AgentStepResult(
            output=output,
        )

    return step_handler


Agent.handle_task(task_handler).start()
