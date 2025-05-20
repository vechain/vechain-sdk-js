import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import {
    BeatsSubscription,
    type SubscriptionBeat2Response
} from '@thor/subscriptions';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
                    log.debug(fastJsonStableStringify(data));
                    done();
                },
                onOpen: () => {
                    log.debug('WebSocket connection opened');
                },
                onClose: () => {
                    log.debug(`WebSocket connection closed`);
                },
                onError: (error) => {
                    log.error('WebSocket encountered an error:', error);
                }
            } satisfies WebSocketListener<SubscriptionBeat2Response>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
