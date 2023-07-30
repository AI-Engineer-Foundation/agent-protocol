import click

from agent_protocol.utils.compliance import check_compliance


@click.group()
def cli():
    pass


@cli.command()
@click.option("--url", "-u", type=str, required=True, help="URL of the Agent API")
def test(url: str):
    check_compliance(url)
