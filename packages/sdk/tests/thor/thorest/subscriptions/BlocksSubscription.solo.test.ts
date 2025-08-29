import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import {
    BlocksSubscription,
    type SubscriptionBlockResponse
} from '@thor/thorest/subscriptions';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
                    log.debug(fastJsonStableStringify(data));
                    done();
                },
                onOpen: () => {},
                onClose: () => {},
                onError: (error) => {
                    log.error('WebSocket error:', error);
                }
            } satisfies WebSocketListener<SubscriptionBlockResponse>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
