import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import {
    BlocksSubscription,
    type SubscriptionBlockResponse
} from '@thor/thorest/subscriptions';
import { log } from '@common/logging';

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
                    const { data } = message;
                    log.debug({ message: JSON.stringify(data) });
                    done();
                },
                onOpen: () => {},
                onClose: () => {},
                onError: (error) => {
                    log.error({
                        message: 'WebSocket error',
                        context: { error }
                    });
                }
            } satisfies WebSocketListener<SubscriptionBlockResponse>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
