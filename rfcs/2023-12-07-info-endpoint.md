# /ap/v2/agent/info

| Feature name  | Info Endpoint                               |
| :------------ | :------------------------------------------ |
| **Author(s)** | Nick Tindle (<nicholas.tindle@agpt.co>), J. Zane Cook (<jzanecook@z90.studio>)                      |
| **Relevant Issue:**   | [#39](https://github.com/AI-Engineer-Foundation/agent-protocol/issues/39)                                 |
| **RFC PR:**   | [TBD](https://github.com/AI-Engineer-Foundation/agent-protocol/pulls)                                 |
| **Created**   | 2023-12-07                                  |
| **Updated**   | 2023-12-11                                  |

## Summary

Current methods of information gathering for agents is insufficient, this RFC proposes an info endpoint that would enforce that certain qualities of an agent are readily available. The enclosing proposed fields introduced should enable adequate knowledge-gathering capabilities to consumers of the agent, whether they are a tool, user, or another agent that utilizes the agent protocol.

This RFC assumes that its introduction would fall along a `v2` release of the Agent Protocol, and as such any references to the Agent Protocol version reflects that assumption. The proposed new endpoint would exist at `/ap/v2/agent/info` and would be accessed with a `GET` request.

## Motivation

This is a valuable problem to solve if we want orchestrator style systems to be possible and have agents that can have backends updated independently of their frontends. Additionally, this is required moving forward as we make changes to the protocol so that consumers of an agent can identify the correct protocol version to support.

Consumers of the agent protocol APIs are currently required to have significant context about the behavior of the agent including the additional inputs as well as any configuration that can be done inside them.
The protocol currently does very little to give context on the specific actions and behaviors that an agent is capable of or where to get more information if needed. This is supported by discussions on [Issue #39](https://github.com/AI-Engineer-Foundation/agent-protocol/issues/39) of the Agent Protocol Spec repo discussing this problem.

## Agent Builders Benefit

The benefit to agent developers is multi-faceted, the info endpoint allows an agent developer to clarify to external and un-opinionated tools the methods by which the agent functions, e.g. by links to their documentation, instructions on usage, and other materials that may benefit a tool, user, or other agent that has no knowledge of the agent to properly use the agent.

## Design Proposal

This design seeks to add only the bare amount of information required to use the agent. The initial implementation seeks to add only non private information that can be useful for browsing through the agent and getting more information about it.

This RFC proposes to add a `/ap/v2/agent/info` endpoint that returns the following fields:

| Field | Description | Optionality | Type | Reason |
| :---- | :---------- | :---------- | :--- | :--- |
| `name` | The name of the agent. | **Required** | String | Required so that we can ensure that we are communicating with the correct agent. |
| `protocol` | The Agent Protocol version that the agent uses to communicate. | **Required** | Integer | Required so that we can ensure the correct protocol version is used.<br /><br />**A client can assume that if no protocol version is available at this endpoint that the agent is using `v1` of the Agent Protocol.** |
| `version` | The internal version of the agent. | **Required** | String | Allows the client to find documentation on the agent in the event that major changes have been added between this agent's versions. |
| `url` | URL of the agent. | Optional | String | Optional but suggested so that a client can access the agent's or agent creator's website for more documentation or community support. |
| `description` | A description of the agent. | Optional | String | Optional but suggested so that relevant details about the agent can be provided to the clients |
| `git` | Git repository of the agent. | Optional | String | Optional but suggested for open source agents so that contributions can be made to them. |
| `docs` | Link to the documentation of the agent. | Optional | String | Optional but suggested so that the client can serve the correct docs to the agent. Works well in conjunction with version. |
| `issues` | Link to the issues of the agent. | Optional | String | Optional but suggested so that the client knows where to file bugs or issues against the agent. |

A JSON representation of this table is below:

```json
{
  "name": "My Agent",
  "protocol": 2,
  "version": "1.0.0",
  "url": "https://myagent.com",
  "description": "General purpose agent.",
  "git": "https://myselfhostedgit.com/myagent/myagent",
  "docs": "https://myagent.com/docs",
  "issues": "https://github.com/myagent/myagent/issues"
}
```

With this example JSON object in mind, the OpenAPI schema for the relevant fields would be the following:

```yml
AgentInfo:
    description: 
    type: object
    properties:
        name:
            description: The name of the agent.
            type: string
            example: My Agent
        protocol:
            description: The Agent Protocol version that the agent uses to communicate.
            type: integer
            example: 2
        version:
            description: Version of the agent.
            type: string
            example: 1.0.0
        url:
            description: URL of the agent.
            type: string
            example: 'https://my-agent.com'
        description:
            description: Description of the agent.
            type: string
            example: General purpose agent.
        git:
            description: Git repository of the agent.
            type: string
            example: 'https://myselfhostedgit.com/myagent/myagent'
        docs:
            description: Link to the documentation of the agent.
            type: string
            example: 'https://my-agent.com/docs'
        issues:
            description: Link to the issues of the agent.
            type: string
            example: 'https://github.com/myagent/myagent/issues'
        required:
            - name
            - protocol
            - version
```

### Alternatives Considered

- Requiring more details on the endpoint.
- Using an external Agentfile approach that would provide metadata for the agent, but would require access to the host filesystem of the agent.

### Compatibility

- Is the design backwards compatible?

  > This design is not backwards compatible but is non breaking. It adds an addtional endpoint that must be implemented but is not a significant burden on developers. The way to identifiy if this is the correct version is to attempt to `GET` this endpoint. If it fails, then the agent protocol should be assumed to be version 1.

- How can this feature be rolled out?

  > This feature will be rolled out as part of the v2 update that is in progress.
  >
  > <small>You can check the status of the v2 milestone at [this link](https://github.com/AI-Engineer-Foundation/agent-protocol/milestone/1).</small>

- Will this affect other parts (SDK, Client SDK)?

  > All related libraries will need to be updated to support this endpoint.

## Questions and Discussion Topics

- Is this implementation enough to fit any needs that agents might have in the future?
- We believe this is a great endpoint to store more information in the future, what do you think?
- Should this be mounted at `/ap/info`?
<!-- - Should `url` be the base of the `/ap/...` url or should it be the base url for the agent as a whole?
  - e.g. `domain.com` vs `domain.com/test/ap/...` -->
