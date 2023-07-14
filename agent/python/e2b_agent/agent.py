import uvicorn

from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from typing import Awaitable, Callable, List, Optional
from pydantic import BaseModel

from e2b_agent.server import app
from e2b_agent.models import AgentTask, AgentStepResult, AgentStepOutput, AgentStepDeliverables

tasks: List[AgentTask] = []

class AgentStep(BaseModel):
  output: Optional[AgentStepOutput] = None
  deliverables: Optional[AgentStepDeliverables] = None

AgentStepHandler = Callable[[AgentTask], Awaitable[AgentStep]]

class Agent:
    @staticmethod
    def handle_task_step(handler: AgentStepHandler):
        async def handler_wrapper(task_id: str):
          task = next(filter(lambda t: t.task_id == task_id, tasks), None)
          if not task:
            raise Exception(f"Task with id {task_id} not found")
          
          result = await handler(task)
          return JSONResponse(
            AgentStepResult(
              task_id=task_id,
              input=task.input,
              deliverables=result.deliverables,
              output=result.output,
            ).dict()
          )

        app.add_api_route(
          "/tasks/{task_id}/step",
          handler_wrapper,
          methods=["POST"],
          response_model=AgentStepResult,
        )
        return Agent

    @staticmethod
    def start():
      uvicorn.run("server:app", 
                  host="0.0.0.0",
                  port=8000,
                  # reload=False,
                  # debug=False,
                  workers=1,
              )
