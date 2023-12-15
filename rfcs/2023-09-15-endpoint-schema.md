# Standardized Endpoint Schema

| Feature name  | Example name                                                              |
| :------------ | :------------------------------------------------------------------------ |
| **Author(s)** | J. Zane Cook (jzanecook@z90.studio)                                       |
| **RFC PR:**   | [PR 66](https://github.com/AI-Engineer-Foundation/agent-protocol/pull/66) |
| **Updated**   | 2023-09-18                                                                |

## Summary

This RFC proposes several changes to the Agent Protocol API to improve task, step, and artifact management. Key changes include:

- Prefixing endpoint schema with `/ap/v1/`

## Motivation

The motivation for the changes is to simplify the protocol for users while making it more extensible and feature-rich. Each change aims to refine the protocol to better suit practical needs.

## Agent Builders Benefit

- The new endpoint schema clarifies versioning.

## Design Proposal

#### Endpoint Schema Update

Change the current `/agent/` endpoint schema to `/ap/v1/agent/`. This brings clarity in versioning and separates the agent-specific endpoints under a versioned umbrella. Additionally, the `ap` solidifies the `agent-protocol` URL for clear identification of its usage.

### Alternatives Considered

- Considered different naming conventions, but `/ap/v1/` is both intuitive and consistent with standard RESTful practices.
- Considered not enforcing the full path, but enforcing the full path not only looks better but also creates a better standard for future improvements.

### Compatibility

These changes are not backwards compatible for the following reasons:

- The change in the endpoint schema will break existing client implementations tied to the old URL structure.

Clients will need to update their integrations to accomodate these changes, necessitating a major version bump.

## Questions and Discussion Topics

- Should the endpoint be enforced after the hostname/port?
- Should the versioning be an integer or a decimal?
