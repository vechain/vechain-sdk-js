import { describe, test } from '@jest/globals';

// eslint-disable-next-line import/no-named-default
import { default as NodeWebSocket } from 'ws';

const isBrowser: boolean = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const url: string = 'wss://echo.websocket.org';
let webSocket: WebSocket | NodeWebSocket = isBrowser
    ? new WebSocket(url)
    : new NodeWebSocket(url);

// Function to create and manage WebSocket connection
async function testWebSocketConnection(url: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        const ws = webSocket;

        ws.onopen = function open() {
            console.log('connected');
        };

        ws.onclose = function close() {
            console.log('disconnected');
        };
    });
}

// Example usage
const wsURL: string = 'wss://echo.websocket.org'; // Replace with your WebSocket server URL

testWebSocketConnection(wsURL)
    .then(() => {
        console.log('WebSocket test successful.');
    })
    .catch((error) => {
        console.error('WebSocket test failed:', error);
    });

describe('WebSocket connection', () => {
    test('should connect to the server', async () => {
        const wsURL: string = 'wss://echo.websocket.org'; // Replace with your WebSocket server URL
        const result = await testWebSocketConnection(wsURL);
        console.log(result);
    });
});