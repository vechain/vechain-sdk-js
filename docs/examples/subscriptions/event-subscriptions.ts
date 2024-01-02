import { subscriptions } from '@vechainfoundation/vechain-sdk-network';
import expect from 'expect';
import WebSocket from 'ws';

// The URL of the node to request the subscription from.
const testnetUrl = 'https://testnet.vechain.org';

/**
 * The event to subscribe to.
 * The event can be defined as an object or as a string.
 *
 * @see [Event format type examples](https://github.com/vechainfoundation/vechain-sdk/blob/9720551d165b706662c13fac657f55e5a506ea4d/packages/core/tests/abi/fixture.ts#L126)
 */
const swapEvent =
    'event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)';

// The address of the sender to filter events by
const senderSampleAddress = '0x9e7911de289c3c856ce7f421034f66b6cde49c39';

// The address of the recipient to filter events by
const toSampleAddress = '0xfe7911df289c3c856ce7f421034f66b6cd249c39';

const wsURL = subscriptions.getEventSubscriptionUrl(
    testnetUrl,
    swapEvent,
    /**
     * The values of the indexed parameters to construct the topic filters.
     *
     * @note The order of the values must match the order of the indexed parameters in the event.
     * @note You can omit the first indexed parameter with `null` and only specify the second indexed parameter if you only want to filter by the second indexed parameter.
     */
    [senderSampleAddress, toSampleAddress],
    {
        address: '0x0000000000000000000000000000456E65726779' // VTHO contract address
    }
);

// Any websocket library can be used to connect to the websocket
const ws = new WebSocket(wsURL);

// Listen for messages from the websocket
ws.onmessage = (event: MessageEvent) => {
    // Perform any action here upon receiving a message from the websocket
    console.log(event.data);
};

// The URL for subscribing to the event
expect(wsURL).toEqual(
    'wss://testnet.vechain.org/subscriptions/event?&addr=0x0000000000000000000000000000456E65726779&t0=0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822&t1=0x9e7911de289c3c856ce7f421034f66b6cde49c39}&t2=0xfe7911df289c3c856ce7f421034f66b6cd249c39'
);
