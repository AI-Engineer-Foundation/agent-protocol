# Agent Heartbeat Endpoint Proposal

| Feature name  | Agent Heartbeat Endpoint                    |
| :------------ | :------------------------------------------ |
| **Author(s)** | Craig Swift [(@TechySwift)](https://twitter.com/TechySwift)        |
| **RFC PR:**   | [#27](https://github.com/e2b-dev/agent-protocol/pull/27) |
| **Updated**   | 2023-08-15                                 |
| **Obsoletes** | None                                       |

## Summary

This RFC proposes the addition of a heartbeat endpoint to the agent protocol to allow for active health checks and uptime monitoring of agents.

## Motivation

As agents grow in number and are deployed in diverse environments, there's an increasing need to monitor their health and availability actively. A simple, standardized way of checking if an agent is alive can streamline monitoring and reduce downtime.

Several users have reported issues with agents becoming unresponsive without a clear understanding of when or why this happens. Monitoring agent uptime and health becomes imperative to maintain a high quality of service.

## Agent Builders Benefit

- **Improved Monitoring**: Agent builders can quickly and effectively monitor the health and uptime of their agents.
- **Reduced Downtime**: Proactive detection of issues can lead to faster resolution times.

## Design Proposal

The heartbeat endpoint will be a lightweight HTTP GET method that responds with a 200 OK status when the agent is healthy and running. The response may optionally contain metadata about the agent, like its current version.

### Alternatives Considered

- **Websocket Keep-alive**: Use a persistent websocket connection with periodic keep-alive messages. While this would provide real-time monitoring, it could lead to increased resource usage and might be overkill for the simple health check requirement.

### Compatibility

- The design is backwards compatible. Existing agents can continue to function without the heartbeat endpoint.
- This addition might necessitate updates in the monitoring tools or the Client SDK to leverage the heartbeat functionality.

## Detailed Design (Optional)

1. **Endpoint Structure**:
    - URL: `/heartbeat`
    - Method: `GET`
    - Response: 
        - Status: `200 OK`
        - Body (Optional JSON)

2. **Error Handling**:
    - Any response other than a 200 OK (or lack of response within a set timeout) should be treated as an indication that the agent might be down or facing issues.

## Questions and Discussion Topics

- Should there be additional metadata in the heartbeat response? - If yes, what should it be? 
    - Adding any processing in the heartbeat endpoint will make the heartbeat less reliable, so might be better to have a health endpoint for that

