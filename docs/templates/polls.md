# Polling Mechanisms

## Synchronous Polling

Synchronous polling mechanisms are implemented to await the fulfillment of specific conditions. Upon the satisfaction of these conditions, the polling process yields the result of the given condition.

### Monitoring for a New Block Production
This section illustrates the methodology for monitoring the production of a new block. Utilizing synchronous polling, the waitUntil function is employed to efficiently wait for the production of a new block.

[example](examples/polls/sync-poll-wait-new-block.ts)

### Observing Balance Changes Post-Transfer
Here, we explore the approach to monitor balance changes after a transfer. Synchronous polling leverages the waitUntil function to detect balance changes following a transfer.

[example](examples/polls/sync-poll-wait-balance-update.ts)

## Asynchronous Polling

Asynchronous polling is utilized for waiting in a non-blocking manner until a specific condition is met or to capture certain events. This type of polling makes use of the Event Emitter pattern, providing notifications when the specified condition or event has been met or emitted.

### Implementing a Simple Async Poll in a DAPP
This example demonstrates the application of an asynchronous poll for tracking transaction events, allowing for the execution of additional operations concurrently.

[example](examples/polls/event-poll-dapp.ts)



