from smol_dev.prompts import plan, specify_file_paths, generate_code

from agent_protocol import (
    Agent,
    AgentTaskInput,
    AgentStepInput,
    AgentStepResult,
    Agent,
    AgentStepHandler,
)


async def smol(prompt: str):
    shared_deps = plan(prompt)
    yield shared_deps

    file_paths = specify_file_paths(prompt, shared_deps)
    yield file_paths

    for file_path in file_paths:
        code = await generate_code(prompt, shared_deps, file_path)
        yield code


async def task_handler(task: AgentTaskInput | None) -> AgentStepHandler:
    if not task:
        raise Exception("No task prompt")

    smol_developer_loop = smol(prompt=task)

    async def step_handler(step: AgentStepInput | None):
        result = await anext(smol_developer_loop)
        return AgentStepResult(output=result)

    return step_handler


Agent.handle_task(task_handler).start()
