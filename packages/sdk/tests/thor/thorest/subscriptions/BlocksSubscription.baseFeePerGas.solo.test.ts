import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import {
    BlocksSubscription,
    type SubscriptionBlockResponse
} from '@thor/thorest/subscriptions';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

/**
 * VeChain blocks subscription with baseFeePerGas field - solo test
 *
 * @group integration/thor/subscriptions
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
                    const data = message.data;
                    log.debug('Received block notification:', fastJsonStableStringify(data));
                    
                    // Check if baseFeePerGas field is present
                    if (data.baseFeePerGas !== undefined) {
                        log.debug('baseFeePerGas field found:', data.baseFeePerGas);
                        notificationReceived = true;
                        done();
                    } else {
                        log.debug('baseFeePerGas field not present in this notification, waiting...');
                    }
                },
                onOpen: () => {
                    log.debug('WebSocket connection opened');
                },
                onClose: () => {
                    log.debug(`WebSocket connection closed`);
                },
                onError: (error) => {
                    log.error('WebSocket encountered an error:', error);
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
