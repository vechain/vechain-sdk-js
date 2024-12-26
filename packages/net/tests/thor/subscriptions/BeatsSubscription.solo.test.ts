import { afterEach, beforeEach, describe } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    BeatsSubscription,
    type SubscriptionBeat2Response
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
            .addListener({
                onMessage: (message) => {
                    const data = message.data;
                    console.log(JSON.stringify(data, null, 2));
                    done();
                }
            } satisfies WebSocketListener<SubscriptionBeat2Response>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
