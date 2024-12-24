import { afterEach, beforeEach, describe } from '@jest/globals';
import { MozillaWebSocketClient } from '../../src/ws/MozillaWebSocketClient';
import { type WebSocketListener } from '../../src/ws';

describe('MozillaWebSocketClient solo tests', () => {
    let wsc: MozillaWebSocketClient;
    beforeEach(() => {
        wsc = new MozillaWebSocketClient('ws://localhost:8669');
    });

    test('data <- open', (done) => {
        wsc.addMessageListener({
            onMessage: (message) => {
                console.log(message.data);
                done();
            }
        } satisfies WebSocketListener<unknown>).open({
            path: '/subscriptions/beat2'
        });
    }, 30000);

    afterEach(() => {
        wsc.close();
    });
});
