import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import {
    BeatsSubscription,
    type SubscriptionBeat2Response
} from '@thor/thorest/subscriptions';
import { log } from '@common/logging';

/**
 * VeChain beats subscription - unit
 *
 * @group solo/thor/subscriptions
 */
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
                    const { data } = message;
                    log.debug({ message: JSON.stringify(data) });
                    done();
                },
                onOpen: () => {
                    log.debug({ message: 'WebSocket connection opened' });
                },
                onClose: () => {
                    log.debug({ message: 'WebSocket connection closed' });
                },
                onError: (error) => {
                    log.error({
                        message: 'WebSocket encountered an error',
                        context: { error }
                    });
                }
            } satisfies WebSocketListener<SubscriptionBeat2Response>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
