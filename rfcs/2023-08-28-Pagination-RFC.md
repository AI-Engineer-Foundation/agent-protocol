# List tasks, artifacts and steps in a paginated way.

| Feature name  | Support Pagination                                                            |
| :------------ | :---------------------------------------------------------------------------- |
| **Author(s)** | Merwane Hamadi (merwanehamadi@gmail.com) Craig Swift (craigswift13@gmail.com) |
| **RFC PR:**   | [PR 53](https://github.com/e2b-dev/agent-protocol/pull/53)                    |
| **Updated**   | 2023-08-28                                                                    |
| **Obsoletes** |                                                                               |

## Summary

We just want to be able to list tasks, artifacts and steps in a paginated way.

## Motivation

Every app needs this. It's not really farfetched

## Agent Builders Benefit

- They can paginate their tasks, steps and artifacts.

## Design Proposal

Query parameters for now.

### Alternatives Considered

- query parameter is the simplest, leanest design. We can add more later (body, headers, etc) => let's start lean.
- for now, we won't add the pages in the response of the requests, this is another RFC.

### Compatibility

- This is backwards compatible. We're just adding things.
