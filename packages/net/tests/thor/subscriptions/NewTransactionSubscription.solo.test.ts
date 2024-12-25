import { afterEach, beforeEach, describe } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    NewTransactionSubscription,
    type TXID
} from '../../../src/thor/subscriptions';

describe('NewTransactionSubscription solo tests', () => {
    let subscription: NewTransactionSubscription;
    beforeEach(() => {
        subscription = NewTransactionSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        subscription
            .addMessageListener({
                onMessage: (message) => {
                    const data = message.data;
                    console.log(JSON.stringify(data, null, 2));
                    done();
                }
            } satisfies WebSocketListener<TXID>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
