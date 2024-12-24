import { afterEach, beforeEach, describe } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import { BlocksSubscription } from '../../../src/thor/subscriptions';

describe('BlocksSubscription solo tests', () => {
    let subscription: BlocksSubscription;
    beforeEach(() => {
        subscription = new BlocksSubscription(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        subscription
            .addMessageListener({
                onMessage: (message) => {
                    console.log(message.data);
                    done();
                }
            } satisfies WebSocketListener<unknown>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
