# Add Secrets Management

| Feature name  | Secrets Management                                               |
| :------------ | :--------------------------------------------------------------- |
| **Author(s)** | Kai Faust (kaifaust@gmail.com), Nicholas Tindle (ntindle.com)    |
| **RFC PR:**   | https://github.com/AI-Engineer-Foundation/agent-protocol/pull/98 |
| **Updated**   | 2024-02-05                                                       |

## Summary

This proposal introduces secrets management to the Agent Protocol. The goal is to allow end-users and third-party APIs to submit secrets to remote agents.

Significant credit to the conceptualization of the design of this new schema belongs to @ntindle.

## Motivation

Currently, the Agent Protocol lacks a standardized method for handling sensitive information, limiting its applicability in scenarios requiring secure authentication across machines. By introducing secrets management, we address a critical gap, enabling agents to run on remote machines while handling sensitive information. This feature is particularly important for organizations that use the Agent Protocol for offering agent runners on remote machines.

## Agent Builders Benefit

Title in Changelog: Introduction of Secrets Management

## Design Proposal

The proposal involves extending the Agent Protocol schema to include new paths and components.

**paths**

- `'/ap/v1/agent/secrets'`
- GET: `listAgentSecretKeys`
- POST: `addAgentSecret`

**components**

- `TaskSecretKeysListResponse`
- `SecretKey`
- `SecretRequestBody`

### Alternatives Considered

**Allowing agents to access secrets:** Potential use-cases are currently very hypothetical, such as a self-improving agent.

**Storing Secrets Outside the Protocol:** This would prevent benchmarking suites on remote agents.

### Compatibility

The proposed schema is fully backwards-compatible, it only adds new paths and components.

## Questions and Discussion Topics

Interested Parties: Discussions with AutoGPT and other companies need to happen to validate the need and support for this change.
