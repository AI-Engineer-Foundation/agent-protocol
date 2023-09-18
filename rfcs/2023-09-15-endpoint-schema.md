# Standardized Endpoint Schema

| Feature name  | Example name                                |
| :------------ | :------------------------------------------ |
| **Author(s)** | J. Zane Cook (jzanecook@z90.studio)                      |
| **RFC PR:**   | [PR 66](https://github.com/AI-Engineers-Foundation/agent-protocol/pull/66)                                 |
| **Updated**   | 2023-09-15                                  |

## Summary

This RFC proposes several changes to the Agent Protocol API to improve task, step, and artifact management. Key changes include:

- Prefixing endpoint schema with `/ap/v1/`
- Removal of `additional_input` from tasks and steps
- Introduction of the `/ap/v1/agent/info` endpoint
- Addition of the config field to tasks and steps

## Motivation

The motivation for the changes is to simplify the protocol for users while making it more extensible and feature-rich. Each change aims to refine the protocol to better suit practical needs.

## Agent Builders Benefit

- The new endpoint schema clarifies versioning.
- The removal of additional_input leads to a leaner API.
- The new /ap/v1/agent/info endpoint aids in better config management.
- The config field offers more flexibility for tasks and steps.

## Design Proposal

#### Endpoint Schema Update
Change the current `/agent/` endpoint schema to `/ap/v1/agent/`. This brings clarity in versioning and separates the agent-specific endpoints under a versioned umbrella. Additionally, the `ap` solidifies the `agent-protocol` URL for clear identification of its usage.

#### Removal of `additional_input`
Remove the `additional_input` field from both tasks and steps. It complicates the API and most use-cases can be fulfilled without it. If additional data are required, they can be included in the config field.

#### New `/ap/v1/agent/info` Endpoint
Introduce a new endpoint `/ap/v1/agent/info` that returns metadata about the agent, including a config_options object. This object will specify configurable options available for tasks and steps.

#### Addition of `config` field
Add a config field to both tasks and steps. This field will allow the user to specify additional parameters or configurations necessary for completing the task or step.

### Alternatives Considered

- Considered keeping `additional_input` but found it redundant when config is introduced. It is also confusing to know what the difference between the input and `additional_input` is for a newcomer, or how it would be used in a standardized way across multiple agents..
- Considered different naming conventions, but `/ap/v1/` is both intuitive and consistent with standard RESTful practices.
- Considered not enforcing the full path, but enforcing the full path not only looks better but also creates a better standard for future improvements.

### Compatibility
These changes are not backwards compatible for the following reasons:
- The change in the endpoint schema will break existing client implementations tied to the old URL structure.
- The removal of the `additional_input` field will lead to unexpected behavior for older clients that rely on this field.

Clients will need to update their integrations to accomodate these changes, necessitating a major version bump.

## Questions and Discussion Topics

Are there any edge cases where these changes are insufficient?