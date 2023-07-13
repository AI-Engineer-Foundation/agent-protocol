from typing import Callable

from e2b_agent.server import app

class AgentServer:
    @staticmethod
    def handle_action(handler: Callable):
        app.add_api_route("/actions", handle_action, methods=["GET"])

    @staticmethod
    def handle_start():
      app.add_api_route("/actions", handle_action, methods=["GET"])

    @staticmethod
    def handle_stop():
      app.add_api_route("/actions", handle_action, methods=["GET"])

    # @staticmethod
    # def add_middleware():
    #    pass
