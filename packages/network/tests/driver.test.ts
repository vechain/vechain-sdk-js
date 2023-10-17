import { describe, expect, test, jest } from '@jest/globals';
import { SimpleNet } from '../src/driver/simple-net';
import axios from 'axios';
import { firstTestnetBlock, testnetUrl } from './utils/fixture';
// import { SimpleWebSocketReader } from '../src/driver/simple-websocket-reader';

describe('SimpleNet', () => {
    test('should perform an HTTP GET request and resolve with response data', async () => {
        // Mock the Axios request method to return a successful response
        const axiosRequest = jest.spyOn(axios, 'request');
        axiosRequest.mockResolvedValue({
            data: 'Test Response Data',
            headers: {}
        });

        const net = new SimpleNet(testnetUrl);
        const response = await net.http('GET', '/blocks/1?expanded=false');

        expect(JSON.stringify(response)).toEqual(
            JSON.stringify(firstTestnetBlock)
        );

        // Restore the original method after the test
        axiosRequest.mockRestore();
    });

    test('should reject with an error if the HTTP request fails', async () => {
        // Mock the Axios request method to simulate an error
        const axiosRequest = jest.spyOn(axios, 'request');
        axiosRequest.mockRejectedValue(new Error('Test Error'));

        const net = new SimpleNet(testnetUrl);

        await expect(net.http('GET', '/error-test-path')).rejects.toThrow(
            '404 get /error-test-path: 404 page not found'
        );

        // Restore the original method after the test
        axiosRequest.mockRestore();
    });
});

// describe('SimpleWebSocketReader', () => {
//     test('should resolve with data from the WebSocket', async () => {
//         // Mock WebSocket and MessageEvent
//         const mockWebSocket = {
//             onmessage: (cb: (ev: MessageEvent) => void) => {
//                 const event = new MessageEvent('message', {
//                     data: 'Test WebSocket Data'
//                 });
//                 cb(event);
//             },
//             onerror: () => {},
//             onclose: () => {},
//             close: () => {}
//         };
//         global.WebSocket = jest.fn(() => mockWebSocket) as never;

//         const reader = new SimpleWebSocketReader('ws://localhost:8669/');
//         const data = await reader.read();
//         console.log('data', data);

//         expect(data).toBe('Test WebSocket Data');
//     });

//     test('should reject on WebSocket error', async () => {
//         // Mock WebSocket to simulate an error
//         const mockWebSocket = {
//             onmessage: () => {},
//             onerror: (cb: (event: Event) => void) => {
//                 const errorEvent = new Event('error');
//                 cb(errorEvent);
//             },
//             onclose: () => {},
//             close: () => {}
//         };
//         global.WebSocket = jest.fn(() => mockWebSocket) as never;

//         const reader = new SimpleWebSocketReader('ws://localhost:8669/');

//         await expect(reader.read()).rejects.toThrow('WebSocket Error');
//     });
// });
