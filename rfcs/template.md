# Agents Use Natural Language

| Feature name  | Example name                                |
| :------------ | :------------------------------------------ |
| **Author(s)** | Moon (autonomousresearcher@gmail.com)       |
| **RFC PR:**   | Leave blank                                 |
| **Updated**   | 2023-08-15                                  |
| **Obsoletes** | AP-RFC it replaces, else remove this header |

## Summary

Agents speak in human language. The natural interface is critical because it means they can interact with and effect existing infrastructure. We should not have a REST API for that. The specification and validation of a task are the most important things to test, and a REST API misses these completely. Further, it encourages an anti-pattern of non-human-readable communication which should wholly be avoided for a multitude of reasons, ethics being one of them. I want to live in a human world, with AIs that use human tools and human protocols, and I believe that as a VERY strict rule agents should not be programmed to talk to each other on non-human, non-observable channels.

## Motivation

Autonomous agent researcher and developer.

I believe this is the wrong direction for the community as a whole.

## Agent Builders Benefit

- Agent builders should understand that there are existing protocols which are free and they can connect to and use with natural language. They are called Email, IRC, Discord, Bluesky and a million others. Agent builders should be encouraged to build natural language interfaces, even between agents.

## Design Proposal

Delete this repository and work on educational resources and ethical guidelines for building autonomous agents.
