import { afterEach, beforeEach, describe, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    BlocksSubscription,
    type SubscriptionBlockResponse
} from '../../../src/thor/subscriptions';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/subscriptions/BlocksSubscription.solo.test.ts'
);

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
                    logger.debug(JSON.stringify(data, null, 2));
                    done();
                },
                onOpen: () => {},
                onClose: () => {},
                onError: (error) => {
                    logger.error('WebSocket error:', error);
                }
            } satisfies WebSocketListener<SubscriptionBlockResponse>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
