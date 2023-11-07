use clap:: {
    Args,
    Parser,
    Subcommand
};

/// Program to call agents
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct APCli {
	/// URL of the Agent
	#[arg(short, long, default_value_t = String::from("http://localhost:8000"))]
	url: String,

	/// Command to run
	#[command(subcommand)]
	commands: Commands,
}