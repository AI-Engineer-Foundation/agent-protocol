# List tasks, artifacts and steps in a paginated way.

| Feature name  | Support Pagination                                                            |
| :------------ | :---------------------------------------------------------------------------- |
| **Author(s)** | Merwane Hamadi (merwanehamadi@gmail.com) Craig Swift (craigswift13@gmail.com) |
| **RFC PR:**   |                                                                               |
| **Updated**   | 2023-08-28                                                                    |
| **Obsoletes** |                                                                               |

## Summary

Allows to list resources.

## Motivation

We can't build any app without an index. An index is a GET /tasks endpoint that list information about tasks.
It's like a table.

Currently to build that you need to get the list of task ids. And if you want to display 20 tasks. You will make 20 GET calls to show them.

## Agent Builders Benefit

- They can allow their users to list things: Currently they get a list of ids, that's not useful.

## Design Proposal

Just do what everyone does: return an array of objects that represent the resource

### Alternatives Considered

- Just make 26 calls when you need to display a table of 25 tasks (1 call to get an id and then 25 calls to get the information of each task)

### Compatibility

- This is not backwards compatible.
