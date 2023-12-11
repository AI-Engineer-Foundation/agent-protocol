# Configuration Options

| Feature name  | Config Options                               |
| :------------ | :------------------------------------------ |
| **Author(s)** | Nick Tindle (<nicholas.tindle@agpt.co>), J. Zane Cook (<jzanecook@z90.studio>)                      |
| **Relevant Issue:**   | [#39](https://github.com/AI-Engineer-Foundation/agent-protocol/issues/39)                                 |
| **RFC PR:**   | [TBD](https://github.com/AI-Engineer-Foundation/agent-protocol/pulls)                                 |
| **Created**   | 2023-12-07                                  |
| **Updated**   | 2023-12-11                                  |

## Summary

- **[Remove]** Why do we want to change it? What issue will this fix? What are the objectives? Keep it short; provide more detail below.

We would like to add support for `config_options` to relace most usages of `addtional_input` so that we can provide clear and structured configrations to our agents. This will fix the "unknown unknowns" problem that exsits with many agents today of not knowing what the valid additional inputs are for a given representation of an agent.

## Motivation

- **[Remove]** Why this is a valuable problem to solve? What background information is needed
to show how this design addresses the problem?

Currently, there is no way to know on an agent-by-agent basis the valid options for sending additional inputs. They can change across agents, tasks, steps, and are not nessisarily consistent within a task or step either. This seeks to solve that by providing a structured list of valid config options broken down by agent, task, and step.

- **[Remove]** Which users are affected by the problem? Why is it a problem? What data supports
this? What related work exists?

## Agent Builders Benefit

- **[Remove]** How will the builders benefit? What would be the title in the changelog?

## Design Proposal

\*This section of the paper contains most of your proposal's explanation. If you have several options, make sure to break up the concept into smaller portions and discuss the advantages and disadvantages of each approach.

```json

// The input
{
    ...,
    "config_options":
    {
        "agent": {
            "llm.provider":  {
                "type": "string",
                "default": "openai",
                "description": "Model Provider for the agent's steps to use.",
                "options": ["openai", "anthropic"]
            },
            "llm.model":  {
                "type": "string",
                "default": "gpt-4",
                "description": "Model for the agent's steps to use.",
                "options": ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
            },
        },
        "task": {
            "image_provider": {
                "type": "string",
                "default": "gpt-4",
                "description": "Model for the agent's steps to use.",
                "options": ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
            },
            "image_provider.hugging_face.model":  {
                "type": "string",
                "default": "gpt-4",
                "description": "Model for the agent's steps to use.",
                "options": ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
            },
        },
        "steps": {
            ...
        },
    }
}

// The config options you send to the agent
{
    ...,
    "config_options":
    {
        "agent": {
            "llm.model": "gpt-4"
        },
        "task": {
            "image_provider": "hugging_face",
            "image_provider.hugging_face.model": "IDK"
        },
        "steps": {
            ...
        },
    }
}
```

The following shows a summarized version of the changes to be made to the OpenAPI spec:

```yml
AgentInfo:
  [... Existing Agent Info Fields ...]
  config_options:
    description: List of configuration options for the agent's tasks and steps. The config is a user-defined set of key/value pairs where the values are standard but the keys are not.
    type: object
    example: |-
      {
        "debug": {
          "type": "boolean",
          "default": false,
          "description": "Whether to run the agent in debug mode."
        },
        "model": {
          "type": "string",
          "default": "gpt-4",
          "description": "The model in which the agent's tasks should run."
        }
      }
    additionalProperties:
        type: object
        properties:
            type:
            description: The type of the value.
            type: string
            enum:
                - string
                - integer
                - float
                - boolean
                - list
                - dict
            default:
            description: The default value of the config option.
            type: string
            description:
            description: 'A description of the value with type, default value, and description.'
            type: string
            options:
            description: A list of options for the config option.
            type: array
            items:
                oneOf:
                - type: string
                - type: integer
                - type: number
                - type: boolean
                - type: object
                - type: array
                    items:
                    oneOf:
                        - type: string
                        - type: integer
                        - type: number
                        - type: boolean
                        - type: object
    required:
        - type
        - default
        - description
    example: |-
        {
        "type": "string",
        "default": "gpt-4",
        "description": "Model for the agent's steps to use."
        "options": ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
        }
    description: 'A description of the value with type, default value, and description.'
  required:
  - name
  - version
  - protocol_version
  - config_options
```

### Alternatives Considered

- **[Remove]** List any options you've rejected here, along with a justification for why you think the strategy you've chosen is the best option.

### Compatibility

- Is the design backwards compatible?

  > It is not backwards compatible but it is non-breaking. The changes implemented here would enforce the structure of the additional input arguments, but a client without knowledge of the enforced parameters could still use the agent.

- How can this feature be rolled out?

  > This feature will be rolled out as part of the v2 update that is in progress.
  >
  > <small>You can check the status of the v2 milestone at [this link](https://github.com/AI-Engineer-Foundation/agent-protocol/milestone/1).</small>

- Will this affect other parts (SDK, Client SDK)?

  > All related libraries will need to be updated to support this endpoint.

## Detailed Design (Optional)

If they’re important details to understand the design but are too technical for the proposal section above, please provide more information.

## Questions and Discussion Topics

Add open questions or options you require feedback on from the community.
