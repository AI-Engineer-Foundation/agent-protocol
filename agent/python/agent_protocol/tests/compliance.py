import pytest
import requests

from agent_protocol.models import StepRequestBody, TaskRequestBody, Task, Step


BASE_URL = "http://localhost:8000"


class TestCompliance:
    @property
    def task_data(self) -> dict:
        return TaskRequestBody(input="test").dict()

    def test_create_agent_task(self):
        response = requests.post(f"{BASE_URL}/agent/tasks", json=self.task_data)
        assert response.status_code == 200
        assert Task(**response.json()).task_id

    def test_list_agent_tasks_ids(self):
        response = requests.get(f"{BASE_URL}/agent/tasks")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_agent_task(self):
        # Create task
        response = requests.post(f"{BASE_URL}/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        response = requests.get(f"{BASE_URL}/agent/tasks/{task_id}")
        assert response.status_code == 200
        assert Task(**response.json()).task_id == task_id

    def test_list_agent_task_steps(self):
        # Create task
        response = requests.post(f"{BASE_URL}/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        response = requests.get(f"{BASE_URL}/agent/tasks/{task_id}/steps")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_execute_agent_task_step(self):
        # Create task
        response = requests.post(f"{BASE_URL}/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        step_body = StepRequestBody(input="test")
        response = requests.post(f"{BASE_URL}/agent/tasks/{task_id}/steps", json=step_body.dict())
        assert response.status_code == 200

    @pytest.mark.skip("There is no way to be sure any step exists")
    def test_get_agent_task_step(self):
        # Create task
        response = requests.post(f"{BASE_URL}agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        # Get steps
        response = requests.get(f"{BASE_URL}/agent/tasks/{task_id}/steps")
        step_id = response.json()["step_id"]
        response = requests.get(f"{BASE_URL}/agent/tasks/{task_id}/steps/{step_id}")
        assert response.status_code == 200
        assert response.json()["step_id"] == step_id
        Step(**response.json())


def main():
    pytest.main(["-v", __file__])


if __name__ == "__main__":
    main()
