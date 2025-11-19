import { subscriptions, TESTNET_URL } from '@vechain/sdk-network';
import WebSocket from 'ws';
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
ws.on('message', (data) => {
    console.log('received: %s', data);
});
// Close the connection to the websocket
ws.close();
