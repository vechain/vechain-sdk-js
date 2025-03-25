import { afterEach, beforeEach, describe, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import { NewTransactionSubscription } from '../../../src/thor/subscriptions';
import { type TXID } from '../../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
