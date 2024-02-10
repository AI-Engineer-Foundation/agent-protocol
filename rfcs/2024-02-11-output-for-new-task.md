# Output for New Task

| Feature name  | Output for New Task                 |
| :------------ | :---------------------------------- |
| **Author(s)** | Nicholas Albion (nalbion@yahoo.com) |
| **RFC PR:**   | Leave blank                         |
| **Updated**   | 2024-02-11                          |

## Summary

`POST /ap/v1/agent/task` should allow an `output`

## Motivation

I struggle to understand how people would be using `POST /ap/v1/agent/task`, which accepts an optional (!!) `input` but allows for no `output`. Can you imagine calling somebody on the phone and the person at the other end picks up, but doesn't say anything? You generally _want_ to hear "Hi, thanks for calling XYZ, if you're calling about ..." - or atleast "Hello..."

An agent could:

- _Ignore_ (or just log) the `task.input` and provide a generic welcome/instructional prompt.
- Use an LLM to process `task.input` and select a specialist agent to handle the task/steps, and provide a welcome prompt from the specialist agent
- Provide a rejection message explaining why subsequent requests will not be accepted
- The client might use the `task.output` as a title for the task?

## Agent Builders Benefit

Agents would be able to provide a welcome message, guiding the user on what to say first.

This allows for greater flexibility & more options:

<table>
  <tr>
    <th>task.input</th><th>task.ouput</th><th>comments</th>
  </tr>
  <tr>
    <td>Write the word 'Washington' to a .txt file"</td>
    <td>undefined</td>
    <td>AutoGPT logs `task.input`.<br/>User initiates conversation in `POST /agent/task/id/step`</td>
  </tr>
  <tr>
    <td>Write the word 'Washington' to a .txt file"</td>
    <td>"Sorry, I'm unable to write to files"</td>
    <td>Agent responds to `task.input`<br/>maybe sets `"is_last": true`?</td>
  </tr>
  <tr>
    <td>undefined</td>
    <td>"Hi, welcome to XYZ bank, can we start with your account number?"</td>
    <td>Agent initiates with welcome prompt</td>
  </tr>
  <tr>
    <td>undefined</td>
    <td>undefined</td>
    <td>User initiates conversation in `POST /agent/task/id/step`</td>
  </tr>
</table>

## Design Proposal

### Alternatives Considered

- Remove `task.input` if the Agent can not respond with `task.output`.

### Compatibility

AutoGPT seems to be sending the same `message` to `createTask()` and `sendChatMessage()` in [chat_view.dart#L126](https://github.com/Significant-Gravitas/AutoGPT/blob/fe0923ba6c9abb42ac4df79da580e8a4391e0418/frontend/lib/views/chat/chat_view.dart#L126):

```dart
                  if (widget.viewModel.currentTaskId != null) {
...
                  } else {
                    String newTaskId = await taskViewModel.createTask(message);
                    widget.viewModel.setCurrentTaskId(newTaskId);
                    widget.viewModel.sendChatMessage(
                        (message == "") ? null : message,
```

In [ForgeAgent](https://github.com/Significant-Gravitas/AutoGPT/blob/master/autogpts/forge/forge/agent.py#L79C15-L79C26) they suggest that in `create_task` you might _just log_ the `task.input`.

```python
   async def create_task(self, task_request: TaskRequestBody) -> Task:
        """
        The agent protocol, which is the core of the Forge, works by creating a task and then
        executing steps for that task. This method is called when the agent is asked to create
        a task.

        We are hooking into function to add a custom log message. Though you can do anything you
        want here.
        """
        task = await super().create_task(task_request)
        LOG.info(
            f"📦 Task created: {task.task_id} input: {task.input[:40]}{'...' if len(task.input) > 40 else ''}"
        )
        return task
```

## Questions and Discussion Topics

Add open questions or options you require feedback on from the community.
