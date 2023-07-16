from e2b_agent import (
    Agent,
    AgentTaskInput,
    AgentStepInput,
    AgentStepHandlerResult,
    Agent,
)


async def task_step(
    task: AgentTaskInput | None,
    step: AgentStepInput | None,
) -> AgentStepHandlerResult:
    print(f"task: {task}", f"step: {step}")
    return AgentStepHandlerResult(
        artifacts=[],
    )


Agent.handle_task_step(task_step).start()
