import { describe, expect, test, jest } from '@jest/globals';
import { SimpleNet } from '../src/driver/simple-net';
import axios from 'axios';
// import { SimpleWebSocketReader } from '../src/driver/simple-websocket-reader';

describe('SimpleNet', () => {
    test('should perform an HTTP GET request and resolve with response data', async () => {
        // Mock the Axios request method to return a successful response
        const axiosRequest = jest.spyOn(axios, 'request');
        axiosRequest.mockResolvedValue({
            data: 'Test Response Data',
            headers: {}
        });

        const net = new SimpleNet('http://localhost:8669');
        const response = await net.http('GET', '/blocks/1?expanded=false');

        expect(JSON.stringify(response)).toEqual(
            JSON.stringify({
                number: 1,
                id: '0x00000001da951e6d3eb8ed62891a79c843978f1ec3194e761df85b6627f1ba16',
                size: 358,
                parentID:
                    '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
                timestamp: 1697470610,
                gasLimit: 10000000000000,
                beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gasUsed: 0,
                totalScore: 1,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 1,
                stateRoot:
                    '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                com: false,
                signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                isTrunk: true,
                isFinalized: false,
                transactions: []
            })
        );

        // Restore the original method after the test
        axiosRequest.mockRestore();
    });

    test('should reject with an error if the HTTP request fails', async () => {
        // Mock the Axios request method to simulate an error
        const axiosRequest = jest.spyOn(axios, 'request');
        axiosRequest.mockRejectedValue(new Error('Test Error'));

        const net = new SimpleNet('http://localhost:8669');

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
