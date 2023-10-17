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

        const net = new SimpleNet('https://testnet.vechain.org/');
        const response = await net.http('GET', '/blocks/1?expanded=false');

        expect(JSON.stringify(response)).toEqual(
            JSON.stringify({
                number: 1,
                id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
                size: 236,
                parentID:
                    '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
                timestamp: 1530014410,
                gasLimit: 10000000,
                beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
                gasUsed: 0,
                totalScore: 1,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 0,
                stateRoot:
                    '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                com: false,
                signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
                isTrunk: true,
                isFinalized: true,
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

        const net = new SimpleNet('https://testnet.vechain.org/');

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
