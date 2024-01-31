# Add Secrets Management

| Feature name  | Kai Faust                                     |
| :------------ | :------------------------------------------   |
| **Author(s)** | Kai Faust (kaifaust@gmail.com)                |
| **RFC PR:**   |                                               |
| **Updated**   | 2024-01-30                                    |

## Summary

This proposal introduces secrets management to the Agent Protocol. This will allow agents to securely interact with third-party APIs by storing and retrieving authentication information, such as API keys and tokens. The objective is to enable a wider range of tasks involving external data sources and services.

## Motivation

As automation and agent-based interactions with external services becomes relevant, so does the need for secure secret management. Currently, the Agent Protocol lacks a standardized method for handling sensitive information, limiting its applicability in scenarios requiring secure authentication to third-party APIs. By introducing secrets management, we address a critical gap, enabling agents to perform a broader spectrum of tasks securely and efficiently.

This feature is particularly important for developers and organizations that rely on the Agent Protocol for automating tasks involving external services, such as cloud storage, payment processing, and data analytics platforms. The absence of a secure method to handle authentication information limits the usability of the protocol for sensitive or proprietary tasks.

## Agent Builders Benefit

Title in Changelog: Introduction of Secrets Management for Secure Third-Party API Integration

## Design Proposal

The proposal involves extending the Agent Protocol schema to include new paths, components, and other changes. The new schema will provide a standardized way to store, retrieve, and manage secrets, such as API keys, tokens, and passwords, required for interacting with third-party APIs.

An early draft of the new schema can be found here: https://github.com/kaifaust/agent-protocol/commit/7c9a998d50d04d87a6af2427c7c393c95aad62e1

### Alternatives Considered

**Storing Secrets Outside the Protocol:** This approach was rejected because it would prevent benchmarking agents that use third-party APIs, and it would complicate the architecture and potentially introduce security vulnerabilities.

**Encryption of Sensitive Information in Existing Fields:** While encrypting sensitive information within the current schema is possible, it does not provide a standardized or user-friendly method for managing secrets, leading to inconsistent implementations and increased complexity.

### Compatibility

Backwards compatibility and roll-out strategy remain open questions until further collaboration and development is done on the SDK.

It will necessitate updates to the SDK to support the new secrets management capabilities.

## Detailed Design (Optional)

If they’re important details to understand the design but are too technical for the proposal section above, please provide more information.

## Questions and Discussion Topics

Feedback on Schema Design: Are there any concerns or suggestions regarding the proposed schema changes for secrets management?

Interested Parties: Are there interested parties that want to be early adopters of Agent Protocol with secrets management?