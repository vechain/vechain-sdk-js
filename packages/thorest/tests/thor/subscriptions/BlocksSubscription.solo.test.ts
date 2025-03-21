import { afterEach, beforeEach, describe, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    BlocksSubscription,
    type SubscriptionBlockResponse
} from '../../../src/thor/subscriptions';

describe('BlocksSubscription solo tests', () => {
    let subscription: BlocksSubscription;
    beforeEach(() => {
        subscription = BlocksSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        subscription
            .addListener({
                onMessage: (message) => {
                    const data = message.data;
                    console.log(JSON.stringify(data, null, 2));
                    done();
                },
                onOpen: () => {},
                onClose: () => {},
                onError: (error) => {
                    console.error('WebSocket error:', error);
                }
            } satisfies WebSocketListener<SubscriptionBlockResponse>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
