from agent_protocol import (
    Agent,
    StepResult,
    StepHandler,
)


async def task_handler(task_input) -> StepHandler:
    print(f"task: {task_input}")

    async def step_handler(step_input) -> StepResult:
        print(f"step: {step_input}")
        return StepResult(
            output=step_input,
        )

    return step_handler


Agent.handle_task(task_handler).start()
