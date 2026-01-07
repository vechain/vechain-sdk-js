import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import {
    BlocksSubscription,
    type SubscriptionBlockResponse
} from '@thor/thorest/subscriptions';
import { log } from '@common/logging';

/**
 * VeChain blocks subscription with baseFeePerGas field - solo test
 *
 * @group solo/thor/subscriptions
 */
describe('BlocksSubscription baseFeePerGas solo tests', () => {
    let subscription: BlocksSubscription;
    beforeEach(() => {
        subscription = BlocksSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open with baseFeePerGas field', (done) => {
        let notificationReceived = false;

        subscription
            .addListener({
                onMessage: (message) => {
                    const { data } = message;
                    log.debug({
                        message: 'Received block notification',
                        context: { data: JSON.stringify(data) }
                    });
                    // Check if baseFeePerGas field is present
                    if (data.baseFeePerGas !== undefined) {
                        log.debug({
                            message: 'baseFeePerGas field found',
                            context: { baseFeePerGas: data.baseFeePerGas }
                        });
                        notificationReceived = true;
                        done();
                    } else {
                        log.debug({
                            message:
                                'baseFeePerGas field not present in this notification, waiting...',
                            context: { data: JSON.stringify(data) }
                        });
                    }
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
                    if (!notificationReceived) {
                        done(error);
                    }
                }
            } satisfies WebSocketListener<SubscriptionBlockResponse>)
            .open();
    }, 60000); // Increased timeout to 60 seconds to allow more time for notifications

    afterEach(() => {
        subscription.close();
    });
});
