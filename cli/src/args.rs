use clap::{Args, Parser, Subcommand};

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

#[derive(Subcommand, Debug)]
enum Commands {
    #[command(name = "task")]
    Task(TaskArgs),
}

#[derive(Args, Debug)]
struct TaskArgs {
    /// Task ID
    #[arg(name = "id")]
    id: Option<String>,

    #[command(subcommand)]
    commands: TaskCommands,
}

#[derive(Subcommand, Debug)]
enum TaskCommands {
    /// List Tasks
    #[command(name = "list")]
    List(TaskListArgs),

    /// Create a New Task
    #[command(name = "create")]
    Create(TaskCreateArgs),

    /// Execute or List Steps for a Task
    /// Example: apc task <task-id> step list
    #[command(name = "step")]
    Step(TaskStepArgs),

    /// Upload or Download Artifacts
    #[command(name = "artifact")]
    Artifact(TaskArtifactArgs),
}

#[derive(Args, Debug)]
struct TaskListArgs {
    /// Page Number
    /// Default: 1
    #[arg(short, long, default_value_t = 1)]
    page: i32,

    /// Page Size
    /// Default: 10
    #[arg(short = 's', long, default_value_t = 10)]
    page_size: i32,
}

#[derive(Args, Debug)]
struct TaskCreateArgs {
    /// Task Input
    /// Example: --input 'Write Washington to a file'
    #[arg(name = "input", short = 'i', long)]
    input: String,

    /// Additional Input
    /// Default: None
    /// Example: --additional-input '{"foo": "bar"}'
    #[arg(name = "additional_input", short = 'a', long)]
    additional_input: Option<String>,
}

#[derive(Args, Debug)]
struct TaskStepArgs {
    /// Step ID
    #[arg(name = "id")]
    id: Option<String>,

    #[command(subcommand)]
    commands: TaskStepCommands,
}

#[derive(Subcommand, Debug)]
enum TaskStepCommands {
    /// List Steps for this Task
    #[command(name = "list")]
    List(TaskStepListArgs),

    /// Execute a New Step for thiagent-protocols Task
    #[command(name = "execute")]
    Execute(TaskStepExecuteArgs),
}

#[derive(Args, Debug)]
struct TaskStepListArgs {
    /// Page Number
    /// Default: 1
    #[arg(short, long, default_value_t = 1)]
    page: u8,

    /// Page Size
    /// Default: 10
    #[arg(short = 's', long, default_value_t = 10)]
    page_size: u8,
}

#[derive(Args, Debug)]
struct TaskStepExecuteArgs {
    /// Step Input
    /// Example: --input 'Write Washington to a file'
    #[arg(name = "input", short = 'i', long)]
    input: String,

    /// Additional Input
    /// Default: None
    /// Example: --additional-input '{"foo": "bar"}'
    #[arg(name = "additional_input", short = 'a', long)]
    additional_input: Option<String>,
}

#[derive(Args, Debug)]
struct TaskArtifactArgs {
    /// Artifact ID
    #[arg(name = "id")]
    id: Option<String>,

    #[command(subcommand)]
    commands: TaskArtifactCommands,
}

#[derive(Subcommand, Debug)]
enum TaskArtifactCommands {
    /// List Artifacts for this Task
    #[command(name = "list")]
    List(TaskArtifactListArgs),

    /// Upload a New Artifact for this Task
    #[command(name = "upload")]
    Upload(TaskArtifactUploadArgs),

    /// Download an Artifact for this Task
    #[command(name = "download")]
    Download(TaskArtifactDownloadArgs),
}

#[derive(Args, Debug)]
struct TaskArtifactListArgs {
    /// Page Number
    /// Default: 1
    #[arg(short, long, default_value_t = 1)]
    page: u8,

    /// Page Size
    /// Default: 10
    #[arg(short = 's', long, default_value_t = 10)]
    page_size: u8,
}

#[derive(Args, Debug)]
struct TaskArtifactUploadArgs {
    /// Artifact Input
    /// Example: --input 'Write Washington to a file'
    #[arg(name = "input", short = 'i', long)]
    input: String,

    /// Additional Input
    /// Default: None
    /// Example: --additional-input '{"foo": "bar"}'
    #[arg(name = "additional_input", short = 'a', long)]
    additional_input: Option<String>,
}

#[derive(Args, Debug)]
struct TaskArtifactDownloadArgs {
    /// Output File
    /// Default: None
    /// Example: --output-file 'washington.txt'
    #[arg(name = "output_file", short = 'o', long)]
    output_file: Option<String>,
}
