# Configuration Options

| Feature name  | Config Options                               |
| :------------ | :------------------------------------------ |
| **Author(s)** | Nick Tindle (<nicholas.tindle@agpt.co>), J. Zane Cook (<jzanecook@z90.studio>)                      |
| **Relevant Issue:**   | [#39](https://github.com/AI-Engineer-Foundation/agent-protocol/issues/39)                                 |
| **RFC PR:**   | [TBD](https://github.com/AI-Engineer-Foundation/agent-protocol/pulls)                                 |
| **Created**   | 2023-12-07                                  |
| **Updated**   | 2024-02-27                                  |

## Summary

This RFC adds support for `config_options` as a way to specify the schema of the `additional_input` field that is passed when creating new tasks, steps, or artifacts. The intention is to provide clear and structured configurations for our agents. This will fix the "unknown unknowns" problem that exists with the agent protocol currently where there is no transparency of the valid additional inputs for an agent.

## Motivation

Currently, there is no way to know on an agent-by-agent basis the valid options for sending additional inputs. They can change across agents, tasks, steps, and are not necessarily consistent within a task or step either. This RFC seeks to solve that by providing a structured list of valid config options broken down by agent, task, and step.

The users most effected by this are consumers of the agent protocol. A client cannot dynamically provide settings, configs or other knobs that can tweak the agents behavior without knowing the knobs that can be turned beforehand. An example of this is AutoGPT's UI. The AutoGPT team would like their UI to be able to read the various settings available for an agent and show those to the consumer but currently those settings must be hard coded into each build of the UI and only work with AutoGPT's own agents. Others who wish to use their agents with the UI and tools AutoGPT built would need to read their code and determine the valid options independently.

## Agent Builders Benefit

The builders who would benefit the most would be consumers of Agent Protocol based apps. Whether its via Discord, CLI, UI or a different UX, there is no way to see what buttons you can press for an agent. There's also no way for agents to "see" each other, and discover each other's parameters. That needs to change so that builders can spend less time coding specific things for specific agents and versions and instead pull the configs and generate UIs dynamically.

## Design Proposal

The proposed design is rather simple. We add an additional field, `config_options` to the existing `/ap/vx/info` endpoint. It will return the available config options in an object, broken down by `type`, `default`, `description`, `options`, and `scope`. Each provided config option is a setting that a consumer of the agent would be able to set in the `additional_info` field of the POSTs to their respective routes.

For more context, below the config option fields are described further in this table:

| Name | Reason | Required |
| :--- | :----- | :------- |
| Type | So that consumers know the valid types to consume it | **Required** |
| Default | So that when not provided, it has a value and that is conveyed to consumers of the endpoint | **Required** |
| Description | Description of the config option. | **Required** |
| Options | An array of applicable options. If specified, a consumer of the agent should use the one of the specified options. | **Optional** |
| Scope | Optional array of scoping strings that enforce usage only in the respective routes, available options are "task", "step", and "artifact". | **Optional** |


The following is a snippet of the response that the `/ap/vx/agent/info`
```json
{
  ...,
  "config_options": {
    "llm.provider":{
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
    "image_provider": {
        "type": "string",
        "default": "huggingface",
        "description": "Provider for the agent's image generator to use.",
        "options": ["dalle", "stable_diffusion", "huggingface"]
    },
    "image_provider.huggingface.model":  {
        "type": "string",
        "default": "CompVis/stable-diffusion-v1-4",
        "description": "Model for the agent's image generator to use.",
    },
    "image_provider.dalle.model":  {
        "type": "string",
        "default": "dalle-3",
        "description": "Model for the agent's image generator to use.",
    },
    "max_steps": {
        "type": "integer",
        "default": 10,
        "description": "The max number of steps a task can take",
        "scope": ["task"]
    }
    "artifact_provider":{
        "type": "string",
        "default": "localstorage",
        "description": "The provider for the storage of artifacts",
        "options": ["s3","gcp","localstorage"],
        "scope": ["artifact"]
    }
  }
}
```

> Note that there is some discrepancy between `llm.provider` and `image_provider`, this is because this RFC does not enforce any naming structure for the keys in the `config_options`. As long as it fits the example schema, and passes the OpenAPI validation, the developer or agent can use any naming structure they wish. We recommend using simple terms that can be "NLP-ified" for agentic understanding.

Below is an example where we're POSTing to create a task, specifying the LLM model and maximum steps. Note that the config options used in this example only specifies a handful of options from the ones available. A consumer that POSTs to the agent should only specify what options would be differing from the defaults. 

```json
// POST /ap/vx/agent/tasks
{
  ...,
  "config_options":
  {
    "llm.model": "gpt-3.5-turbo-16k",
    "max_steps": 50
  }
}
```

### Alternatives Considered

- Considered a different scoping method that would have individual options contained within an key that specifies the scope. Chose the array method since it allows for options to be applicable to more than one scope.
- Considered enforcing that the output would return with the enabled settings, decided against it in order to 

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
          "description": "The model the agent should use",
          "scope": ["task", "step"]
        },
      }
    additionalProperties:
      type: object
      properties:
        type:
          description: The type of the value
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
          oneOf:
            - type: string
            - type: integer
            - type: number
            - type: boolean
            - type: object
            - type: array
        description:
          type: string
          description: A description of the config option.
        options:
          description: An array of applicable options. If specified, a consumer of the agent should use the one of the specified options.
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
        scope:
          description: An optional array of strings that scope the config option to the specified routes. If empty, assume all.
          type: array
          items:
            oneOf:
              - type: string
                enum:
                  - task
                  - step
                  - artifact
      required:
        - type
        - default
        - description
required:
  - name
  - protocol
  - version
  - config_options
```

Other changes to the spec are:
- Descriptions for additional_input on tasks and steps, to replace "Any value is allowed" with "Reference the config_options"

## Questions and Discussion Topics

Add open questions or options you require feedback on from the community.
