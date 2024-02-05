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

| Path                               | Method | Description                                | Optionality  | Type   |
| :--------------------------------- | :----- | :----------------------------------------- | :----------- | :----- |
| `/ap/v1/agent/secrets`             | GET    | Lists all secret keys for an agent.        | **Required** | String |
|                                    | POST   | Adds a new secret to the agent.            | **Required** | String |
| `/ap/v1/agent/secrets/{secret_id}` | DELETE | Deletes a specified secret from the agent. | **Required** | String |

### Listing Secrets

This example shows what a response might look like when a client calls the endpoint to list all secret keys associated with the agent:

```json
{
  "secrets": [
    {
      "secret_id": "1a2b3c4d5e6f",
      "secret_key": "api_key"
    },
    {
      "secret_id": "6f5e4d3c2b1a",
      "secret_key": "db_password"
    }
  ]
}
```

### Adding a Secret

Here's an example of what a request body might look like when a client adds a new secret to the agent:

```json
{
  "secret_key": "new_service_api_key",
  "secret_value": "1a2b3c4d5e7f8g9h10i11j"
}
```

### Deleting a Secret

A client wishing to delete a secret would use an HTTP DELETE request to the following URL:

```
DELETE /ap/v1/agent/secrets/{secret_id}
```

### OpenAPI Schema

The OpenAPI schema for the relevant fields would be the following:

```yml
paths:
  /ap/v1/agent/secrets:
    get:
      operationId: listAgentSecretKeys
      summary: Lists all secret keys for an agent.
      responses:
        '200':
          description: Returned list of secret keys for the agent.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SecretKeysListResponse'
    post:
      operationId: addAgentSecret
      summary: Adds a new secret to the agent.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SecretRequestBody'
      responses:
        '200':
          description: A new secret was successfully added to the agent.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SecretKey'
  /ap/v1/agent/secrets/{secret_id}:
    delete:
      operationId: deleteAgentSecret
      summary: Deletes a specified secret from the agent.
      parameters:
        - name: secret_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: The secret was successfully deleted.
components:
  schemas:
    SecretKeysListResponse:
      type: object
      properties:
        secrets:
          type: array
          items:
            $ref: '#/components/schemas/SecretKey'
      required:
        - secrets
    SecretKey:
      type: object
      properties:
        secret_id:
          type: string
        secret_key:
          type: string
      required:
        - secret_id
        - secret_key
    SecretRequestBody:
      type: object
      properties:
        secret_key:
          type: string
        secret_value:
          type: string
      required:
        - secret_key
        - secret_value
```

**Components**

- `SecretKeysListResponse`: Defines the structure for the response when listing secret keys.
- `SecretKey`: Represents a single secret key, excluding its value.
- `SecretRequestBody`: Specifies the required body structure for adding a new secret.

### Alternatives Considered

**Allowing agents to access secrets:** Potential use-cases are currently very hypothetical, such as a self-improving agent.

**Storing Secrets Outside the Protocol:** This would prevent benchmarking suites on remote agents.

### Compatibility

The proposed schema is fully backwards-compatible, it only adds new paths and components.

## Questions and Discussion Topics

Interested Parties: Discussions with AutoGPT and other companies need to happen to validate the need and support for this change.
