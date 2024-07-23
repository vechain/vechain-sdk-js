---
description: Subscriptions URLs
---

# Subscriptions

## Getting Started with Subscriptions

The subscriptions module of the VeChain sdk provides various endpoints for subscribing to different types of blockchain data, including blocks, events, and transfers. These subscriptions are useful for real-time monitoring of blockchain activities.
To use the subscription endpoints, import the `subscriptions`` object from the VeChain sdk. You can then call various methods on this object to create WebSocket URLs for different types of subscriptions.

### Smart contract event subscription

Subscribe to specific contract events through the `subscriptions.getEventSubscriptionUrl`. You can filter events based on contract address and topics.

```typescript { name=event-subscriptions, category=example }
import { subscriptions, TESTNET_URL } from '@vechain/sdk-network';
import WebSocket from 'isomorphic-ws';

/**
 * The event to subscribe to.
 * The event can be defined as an object or as a string.
 *
 * @see [Event format type examples](https://github.com/vechain/vechain-sdk/blob/9720551d165b706662c13fac657f55e5a506ea4d/packages/core/tests/abi/fixture.ts#L126)
 */
const swapEvent =
    'event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)';

// The address of the sender to filter events by
const senderSampleAddress = '0x9e7911de289c3c856ce7f421034f66b6cde49c39';

// The address of the recipient to filter events by
const toSampleAddress = '0xfe7911df289c3c856ce7f421034f66b6cd249c39';

const wsURL = subscriptions.getEventSubscriptionUrl(
    TESTNET_URL,
    swapEvent,
    /**
     * The values of the indexed parameters to construct the topic filters.
     *
     * @note The order of the values must match the order of the indexed parameters in the event.
     * @note You can omit the first indexed parameter with `null` and only specify the second indexed parameter if you only want to filter by the second indexed parameter.
     */
    [senderSampleAddress, toSampleAddress],
    {
        address: '0x6c0A6e1d922E0e63901301573370b932AE20DAdB' // Vexchange contract address
    }
);

// Any websocket library can be used to connect to the websocket
const ws = new WebSocket(wsURL);

// Simple websocket event handlers

// Error handling
ws.on('error', console.error);

// Connection opened
ws.on('open', () => {
    console.log('connected');
});

// Connection closed
ws.on('close', () => {
    console.log('disconnected');
});

// Message received
ws.on('message', (data: unknown) => {
    console.log('received: %s', data);
});

// Close the connection to the websocket
ws.close();

```

This example demonstrates how to create a WebSocket URL for subscribing to swap events of a specific contract.

The VeChain sdk also provides other subscription endpoints for subscribing to different types of blockchain data. These include:

### Block subscription

Subscribe to new blocks as they are added to the blockchain through the `subscriptions.getBlockSubscriptionUrl` method.

```typescript { name=block-subscriptions, category=example }
import { subscriptions, TESTNET_URL } from '@vechain/sdk-network';
import WebSocket from 'isomorphic-ws';

// The URL for subscribing to the block
const wsURL = subscriptions.getBlockSubscriptionUrl(TESTNET_URL);

// Any websocket library can be used to connect to the websocket
const ws = new WebSocket(wsURL);

// Simple websocket event handlers

// Error handling
ws.on('error', console.error);

// Connection opened
ws.on('open', () => {
    console.log('connected');
});

// Connection closed
ws.on('close', () => {
    console.log('disconnected');
});

// Message received
ws.on('message', (data: unknown) => {
    console.log('received: %s', data);
});

// Close the connection to the websocket
ws.close();

```

### Other subscriptions

The VeChain sdk also provides other subscription endpoints for subscribing to different types of blockchain data. These include:
- `subscriptions.getVETtransfersSubscriptionUrl` for subscribing to VET transfers
- `subscriptions.getNewTransactionsSubscriptionUrl` for subscribing to new transactions
- `subscriptions.getBeatSubscriptionUrl` for subscribing to new blockchain beats (A beat is a notification that a new block has been added to the blockchain with a bloom filter which can be used to check if the block contains any relevant account.)
- `subscriptions.getLegacyBeatSubscriptionUrl` for subscribing to the legacy beats.

