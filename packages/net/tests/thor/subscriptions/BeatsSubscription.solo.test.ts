import { afterEach, beforeEach, describe } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    BeatsSubscription,
    type SubscriptionBeat2ResponseJSON
} from '../../../src/thor/subscriptions';

describe('BlocksSubscription solo tests', () => {
    let subscription: BeatsSubscription;
    beforeEach(() => {
        subscription = BeatsSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        subscription
            .addMessageListener({
                onMessage: (message) => {
                    const data = message.data as SubscriptionBeat2ResponseJSON;
                    console.log(JSON.stringify(data, null, 2));
                    done();
                }
            } satisfies WebSocketListener<unknown>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
