import pytest
import requests

from agent_protocol.models import StepRequestBody, TaskRequestBody, Task, Step


class TestCompliance:
    @property
    def task_data(self) -> dict:
        return TaskRequestBody(input="test").dict()

    def test_create_agent_task(self, url):
        response = requests.post(f"{url}/ap/v1/agent/tasks", json=self.task_data)
        assert response.status_code == 200
        assert Task(**response.json()).task_id

    def test_list_agent_tasks_ids(self, url):
        response = requests.get(f"{url}/ap/v1/agent/tasks")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_agent_task(self, url):
        # Create task
        response = requests.post(f"{url}/ap/v1/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        response = requests.get(f"{url}/ap/v1/agent/tasks/{task_id}")
        assert response.status_code == 200
        assert Task(**response.json()).task_id == task_id

    def test_list_agent_task_steps(self, url):
        # Create task
        response = requests.post(f"{url}/ap/v1/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        response = requests.get(f"{url}/ap/v1/agent/tasks/{task_id}/steps")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_execute_agent_task_step(self, url):
        # Create task
        response = requests.post(f"{url}/ap/v1/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        step_body = StepRequestBody(input="test")
        response = requests.post(
            f"{url}/ap/v1/agent/tasks/{task_id}/steps", json=step_body.dict()
        )
        assert response.status_code == 200

    def test_list_artifacts(self, url):
        response = requests.post(f"{url}/ap/v1/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        response = requests.get(f"{url}/ap/v1/agent/tasks/{task_id}/artifacts")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_agent_task_step(self, url):
        # Create task
        response = requests.post(f"{url}/ap/v1/agent/tasks", json=self.task_data)
        task_id = response.json()["task_id"]
        # Get steps
        response = requests.get(f"{url}/ap/v1/agent/tasks/{task_id}/steps")
        step_id = response.json()[0]
        response = requests.get(f"{url}/ap/v1/agent/tasks/{task_id}/steps/{step_id}")
        assert response.status_code == 200
        assert Step(**response.json()).step_id == step_id


def provide_url_scheme(url: str, default_scheme: str = "https") -> str:
    """Make sure we have valid url scheme.
    Params:
        url : string : the URL
        default_scheme : string : default scheme to use, e.g. 'https'
    Returns:
        string : updated url with validated/attached scheme
    """
    if not url:
        return url

    if "localhost" in url or "127.0.0.1" in url:
        default_scheme = "http"

    has_scheme = ":" in url[:7]
    is_universal_scheme = url.startswith("//")
    is_file_path = url == "-" or (url.startswith("/") and not is_universal_scheme)
    if has_scheme or is_file_path:
        return url
    if is_universal_scheme:
        return default_scheme + ":" + url
    return default_scheme + "://" + url


def check_compliance(url, additional_pytest_args):
    url = provide_url_scheme(url)
    exit_code = pytest.main(
        [
            "-v",
            __file__,
            "--url",
            url,
            "-W",
            "ignore:Module already imported:pytest.PytestWarning",
        ]
        + list(additional_pytest_args)
    )
    assert exit_code == 0, "Your Agent API isn't compliant with the agent protocol"
