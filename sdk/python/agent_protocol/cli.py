import click

from agent_protocol.utils.compliance import check_compliance


@click.group()
def cli():
    pass


@cli.command(
    "test",
    context_settings=dict(
        ignore_unknown_options=True,
    ),
)
@click.option("--url", "-u", type=str, required=True, help="URL of the Agent API")
@click.argument("args", nargs=-1, type=click.UNPROCESSED)
def _check_compliance(url: str, args: list):
    """
    This script checks if the Agent API is Agent Protocol compliant.

    In the background it runs pytest, you can pass additional arguments to pytest.
    """
    check_compliance(url, args)
