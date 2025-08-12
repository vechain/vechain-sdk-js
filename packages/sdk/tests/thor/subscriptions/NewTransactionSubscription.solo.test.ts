import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import { NewTransactionSubscription } from '@thor/subscriptions';
import { type TXID } from '@thor';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

/**
 * VeChain beats subscription - integration
 *
 * @group integration/thor/subscriptions
 */
describe('NewTransactionSubscription solo tests', () => {
    let subscription: NewTransactionSubscription;
    beforeEach(() => {
        subscription = NewTransactionSubscription.at(
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
                onClose: () => {},
                onError: () => {},
                onOpen: () => {}
            } satisfies WebSocketListener<TXID>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
