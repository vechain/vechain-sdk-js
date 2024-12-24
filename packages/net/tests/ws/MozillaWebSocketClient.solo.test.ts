import { afterEach, beforeEach, describe } from '@jest/globals';
import { MozillaWebSocketClient } from '../../src/ws/MozillaWebSocketClient';
import { type WebSocketListener } from '../../src/ws';

describe('FetchHttpClient testnet tests', () => {
    let wsc: MozillaWebSocketClient;
    beforeEach(() => {
        wsc = new MozillaWebSocketClient();
    });

    test('should connect to WebSocket and receive data', (done) => {
        wsc.open('ws://localhost:8669/subscriptions/beat2');
        wsc.addMessageListener({
            onMessage: (message) => {
                console.log(message.data);
                done();
            }
        } satisfies WebSocketListener<unknown>);
    }, 30000);

    afterEach(() => {
        wsc.close();
    });
});
