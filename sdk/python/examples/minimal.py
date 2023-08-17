from agent_protocol import Agent, Artifact, Step, Task
from agent_protocol.db import InMemoryTaskDB


class MinimalAgent(Agent):
    async def task_handler(self, task: Task):
        """
        Handles a new task
        """
        print(f"task: {task.input}")
        await self.db.create_step(task.task_id, task.input)
        return task

    async def step_handler(self, step: Step) -> Step:
        print(f"step: {step.input}")
        await self.db.create_step(step.task_id, f"Next step from step {step.name}")
        step.output = step.input
        return step

    async def retrieve_artifact(self, task_id: str, artifact: Artifact) -> Artifact:
        """
        Retrieve the artifact data from wherever it is stored and return it as bytes.
        """
        return artifact

    async def save_artifact(self, task_id: str, artifact: Artifact) -> Artifact:
        """
        Save the artifact data to the agent's workspace, loading from uri if bytes are not available.
        """
        return artifact


if __name__ == "__main__":
    database = InMemoryTaskDB()
    agent = AutoGPT(db=database)
    agent.start()
