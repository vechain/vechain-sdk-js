import { afterEach, beforeEach, describe, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    BeatsSubscription,
    type SubscriptionBeat2Response
} from '../../../src/thor/subscriptions';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/subscriptions/BeatsSubscription.solo.test.ts'
);

describe('BlocksSubscription solo tests', () => {
    let subscription: BeatsSubscription;
    beforeEach(() => {
        subscription = BeatsSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        subscription
            .addListener({
                onMessage: (message) => {
                    const data = message.data;
                    logger.debug(fastJsonStableStringify(data));
                    done();
                },
                onOpen: () => {
                    logger.debug('WebSocket connection opened');
                },
                onClose: () => {
                    logger.debug(`WebSocket connection closed`);
                },
                onError: (error) => {
                    logger.error('WebSocket encountered an error:', error);
                }
            } satisfies WebSocketListener<SubscriptionBeat2Response>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
