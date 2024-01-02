import { subscriptions } from '@vechainfoundation/vechain-sdk-network';
import expect from 'expect';
import WebSocket from 'ws';

// The URL of the node to request the subscription from.
const testnetUrl = 'https://testnet.vechain.org';

// The URL for subscribing to the block
const wsURL = subscriptions.getBlockSubscriptionUrl(testnetUrl);

// Any websocket library can be used to connect to the websocket
const ws = new WebSocket(wsURL);

// Listen for messages from the websocket
ws.onmessage = (event: MessageEvent) => {
    // Perform any action here upon receiving a message from the websocket
    console.log(event.data);
};

expect(wsURL).toEqual(
    'wss://testnet.vechain.org/subscriptions/event?&addr=0x0000000000000000000000000000456E65726779&t0=0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822&t1=0x9e7911de289c3c856ce7f421034f66b6cde49c39}&t2=0xfe7911df289c3c856ce7f421034f66b6cd249c39'
);
