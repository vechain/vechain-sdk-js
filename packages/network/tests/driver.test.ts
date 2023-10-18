import { describe, expect, test } from '@jest/globals';
import { SimpleNet } from '../src/driver/simple-net';
import { firstTestnetBlock, testnetUrl } from './utils/fixture';
import { SimpleWebSocketReader } from '../src/driver/simple-websocket-reader';

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
        const path = '/subscriptions/block?pos=';
        const reader = net.openWebSocketReader(path);

        const readPromise = reader.read();

        const result = await readPromise;

        expect(result).toBeDefined();
        reader.close();
    }, 7000);

    test('Handles WebSocket timeout gracefully', async () => {
        const path = '/subscriptions/block?pos=aaaa';
        const reader = net.openWebSocketReader(path);
        const readPromise = reader.read();

        // Create a promise that resolves after 3 seconds
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                resolve('Timeout');
            }, 3000);
        });

        // Use Promise.race to await either the readPromise or the timeout
        await Promise.race([readPromise, timeoutPromise]);

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
});
