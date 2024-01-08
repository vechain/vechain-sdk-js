---
description: Subscriptions URLs
---

# Subscriptions

## Getting Started with Subscriptions

The subscriptions module of the vechain sdk provides various endpoints for subscribing to different types of blockchain data, including blocks, events, and transfers. These subscriptions are useful for real-time monitoring of blockchain activities.
To use the subscription endpoints, import the `subscriptions`` object from the vechain sdk. You can then call various methods on this object to create WebSocket URLs for different types of subscriptions.

### Smart contract event subscription

Subscribe to specific contract events through the `subscriptions.getEventSubscriptionUrl`. You can filter events based on contract address and topics.

[example](examples/subscriptions/event-subscriptions.ts)

This example demonstrates how to create a WebSocket URL for subscribing to swap events of a specific contract.

The vechain sdk also provides other subscription endpoints for subscribing to different types of blockchain data. These include:

### Block subscription

Subscribe to new blocks as they are added to the blockchain through the `subscriptions.getBlockSubscriptionUrl` method.

[example](examples/subscriptions/block-subscriptions.ts)

### Other subscriptions

The vechain sdk also provides other subscription endpoints for subscribing to different types of blockchain data. These include:
- `subscriptions.getVETtransfersSubscriptionUrl` for subscribing to VET transfers
- `subscriptions.getNewTransactionsSubscriptionUrl` for subscribing to new transactions
- `subscriptions.getBeatSubscriptionUrl` for subscribing to new blockchain beats (A beat is a notification that a new block has been added to the blockchain with a bloom filter which can be used to check if the block contains any relevant account.)
- `subscriptions.getLegacyBeatSubscriptionUrl` for subscribing to the legacy beats.
