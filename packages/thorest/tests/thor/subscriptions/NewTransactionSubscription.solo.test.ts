import { afterEach, beforeEach, describe, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import { NewTransactionSubscription } from '../../../src/thor/subscriptions';
import { type TXID } from '../../../src';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/subscriptions/NewTransactionSubscription.solo.test.ts'
);

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
                    logger.debug(JSON.stringify(data, null, 2));
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
