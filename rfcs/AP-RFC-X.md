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

Having worked on inter-agent communications and protocols for AIs to interact with each other and with humans in various contexts, including task oriented simulation and multi-agent 3D simulation, I have come to believe that this whole branch of agent APIs is the wrong direction for autonomous agent research and the community as a whole. It creates a middleman between the agent and the human, and it creates a middleman between the agent and the agent. It is yet another communication middleman that isn't needed for anything and tells first-time engineers entinering the autonomous agent space that this is best practices, when it isn't.

## Agent Builders Benefit

- Agent builders should understand that there are existing protocols which are free and they can connect to and use with natural language. They are called Email, IRC, Discord, Bluesky and a million others. Agent builders should be encouraged to build natural language interfaces, even between agents.

## Design Proposal

Consider archiving this repository and work on educational resources and ethical guidelines for building autonomous agents. Evaluate who is going to adopt this, who is going to try to build their own version of it (there are already several) and what the value is.

For testing purposes, the agent should communicate with an evaluator in natural language. If the test is not received in natural language, it isn't testing anything. If the agent can't report on the progress of the task when asked, well, that's barely autonomy. If there are reasons why this data is hard to get or manage, it should be considere that those issues might be paradigmatic.