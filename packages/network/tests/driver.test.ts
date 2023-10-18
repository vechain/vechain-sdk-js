import { describe, expect, test } from '@jest/globals';
import { SimpleNet } from '../src/driver/simple-net';
import { firstTestnetBlock, testnetUrl, testAccount } from './utils/fixture';
import { SimpleWebSocketReader } from '../src/driver/simple-websocket-reader';
import { type NetParams } from '../src/driver/interfaces';

describe('SimpleNet', () => {
    test('Should perform an HTTP GET request and resolve with response data', async () => {
        // Create a new instance of SimpleNet with the testnet URL
        const net = new SimpleNet(testnetUrl);

        // Perform an HTTP GET request using the SimpleNet instance
        const response = await net.http('GET', '/blocks/1?expanded=false');

        // Assert that the response matches the expected firstTestnetBlock
        expect(JSON.stringify(response)).toEqual(
            JSON.stringify(firstTestnetBlock)
        );
    });

    test('Should reject with an error if the HTTP request fails', async () => {
        // Create a new instance of SimpleNet with the testnet URL
        const net = new SimpleNet(testnetUrl);

        // Assert that the HTTP request fails with an error
        await expect(net.http('GET', '/error-test-path')).rejects.toThrow(
            '404 get /error-test-path: 404 page not found'
        );
    });

    test('Should validate response headers', async () => {
        // Create a new instance of SimpleNet with the testnet URL
        const net = new SimpleNet(testnetUrl);

        const customParams: NetParams = {
            query: {},
            body: {},
            headers: {
                'X-Custom-Header': 'custom-value'
            },
            validateResponseHeader: function (
                headers: Record<string, string>
            ): void {
                expect(headers).toBeDefined();
            }
        };

        // Make an actual HTTP GET request and pass the validateResponseHeaders function
        const response = await net.http(
            'GET',
            '/accounts/' + testAccount,
            customParams
        );

        // You can also check the response data if needed
        expect(response).toBeDefined();
    });
});

describe('SimpleWebSocketReader', () => {
    const net = new SimpleNet(testnetUrl);

    test('Should create an instance of SimpleWebSocketReader', () => {
        const wsServerUrl = 'ws://testnet.vechain.org';
        const reader = new SimpleWebSocketReader(wsServerUrl);
        expect(reader).toBeInstanceOf(SimpleWebSocketReader);
        reader.close();
    });

    test('Should create a WebSocket reader for a valid path', async () => {
        const reader = new SimpleWebSocketReader(
            'wss://testnet.vechain.org/subscriptions/block?pos=',
            8000
        );
        const data = await reader.read();
        expect(data).toBeDefined();
        reader.close();
    }, 10000);

    test('Should open a WebSocket reader', () => {
        const path = '/node/network/peers';
        const reader = net.openWebSocketReader(path);
        reader.close();
    });

    test('Should log an error if the path is empty', () => {
        const path = '';
        let reader;

        // Use a try-catch block to capture the error
        try {
            reader = net.openWebSocketReader(path);
        } catch (error) {
            expect((error as Error).message).toBe('path is empty');
        }
        reader?.close();
    });

    test('Should log an error if the url is empty', () => {
        const path = '/path';
        const net = new SimpleNet('');
        let reader;

        // Use a try-catch block to capture the error
        try {
            reader = net.openWebSocketReader(path);
        } catch (error) {
            expect((error as Error).message).toBe('baseURL is empty');
        }
        reader?.close();
    });

    test('Should handle WebSocket read timeout', async () => {
        const wsServerUrl = 'wss://testnet.vechain.org/wrong-path';
        let reader;

        try {
            reader = new SimpleWebSocketReader(wsServerUrl, 3000);
            await reader.read();
        } catch (error) {
            expect((error as Error).message).toBe('ws read timeout');
        }

        reader?.close();
    });
});
