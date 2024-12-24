import { afterEach, beforeEach, describe } from '@jest/globals';

describe('FetchHttpClient testnet tests', () => {
    let ws: WebSocket;
    beforeEach(() => {
        ws = new WebSocket('ws://localhost:8669/subscriptions/beat2');
    });

    test('should connect to WebSocket and receive data', (done) => {
        ws.onmessage = (event) => {
            console.log(event);
            done(); // Call 'done' when the test is complete.
        };
    }, 30000);

    afterEach(() => {
        ws.close();
    });
});
