# Agent Communication Protocol

| Feature name  | Agent Communication Protocol           |
| :------------ | :------------------------------------- |
| **Author(s)** | [e2b](https://e2b.dev) (hello@e2b.dev) |
| **RFC PR:**   |                                        |
| **Updated**   | 2023-08-02                             |

## Summary

Standardized way of communicating with agents, the **Agent Communication Protocol** or simply **Agent Protocol** (AP).

## Motivation

The AI agent space is young. Most developers are building agents in their own way.
This creates a challenge - it's hard to communicate with different agents since the interface is often different every time.
Because we struggle with communicating with different agents, it's also hard to compare them easily.
Additionally, the benefit of having a single communication interface makes it easier to develop devtools that works with agents out of the box.

We present the **Agent Protocol** - a single common interface for communicating with agents.
Any agent developer can implement this protocol.
The **Agent Protocol** is an API specification - list of endpoints, which the agent
should expose with predefined response models.
The protocol is **tech stack agnostic**. Any agent can adopt this protocol no
matter what framework they're using (or not using).

We believe, this will help the ecosystem grow faster and simplify the integrations.

We're starting with a minimal core. We want to build upon that iteratively
by learning from agent developers about what they actually need.

## Design Proposal

We think about the agent as an application, which can receive tasks. The agent then based on the task plans the next steps. The steps can be updated based on the results of the executed steps. The agent can also receive artifacts to work with. Each step is triggered by the user. This way user has control over what's happening, can monitor the progress and can stop the execution at any time.
The agent can also produce artifacts as a result of the execution of the steps. The user should be able to download them. The last step of the task should be marked.

This puts following constraints on the agent:

- List of tasks that have been created for the agent.
- List of next (known) steps for the task.
- Trigger the next step
- Upload / Download artifacts
- Get detailed information about the task and steps
- The last step should be marked with property `is_last` set to `true`

To be compliant with the protocol means the agent should expose a **REST API** with following routes:

- **/agent/tasks**:
  - **[GET]**: List all tasks ids that have been created for the agent.
  - **[POST]**: Creates a task for the agent, it should also create already known steps for the task.
- **/agent/tasks/{task_id}**:

  - **[GET]**: Get details about a specified agent task.

- **/agent/tasks/{task_id}/steps**:

  - **[GET]**: List all step ids for the specified task.
  - **[POST]**: Execute a step in the specified agent task. If as a result of the step execution new steps are known, they should be added to task's steps.

- **/agent/tasks/{task_id}/steps/{step_id}**:

  - **[GET]**: Get details about a specified task step.

- **/agent/tasks/{task_id}/artifact**:

  - **[GET]**: List all artifacts for the specified task.
  - **[POST]**: Upload the artifact for the specified task.

- **/agent/tasks/{task_id}/artifact/{artifact_id}**:
  - **[GET]**: Download the specified task artifact.

If the resource is not found, the agent should return `404` status code.

### Alternatives Considered

- We considered using async communication for executing the steps. We decided to go with sync communication for now, because it’s simpler. The disadvantage is that the response can take a long time. We will probably revisit this decision in the future.
- There are other possibilities as **GraphQL** or **Websockets**

## Detailed Design (Optional)

You can find the full spec in the [API spec](./../openapi.yml).
