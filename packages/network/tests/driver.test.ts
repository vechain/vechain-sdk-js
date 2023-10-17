import { describe, expect, test, jest } from '@jest/globals';
import { SimpleNet } from '../src/driver/simple-net';
import axios from 'axios';
import { firstTestnetBlock, testnetUrl } from './utils/fixture';

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

    // describe('openWebSocketReader', () => {
    //     test('should create a WebSocket reader with the correct URL', () => {
    //         // Mock the SimpleWebSocketReader class
    //         const mockWebSocketReader = jest.fn();
    //         jest.mock('../src/driver/simple-websocket-reader', () => {
    //             return {
    //                 SimpleWebSocketReader: mockWebSocketReader
    //             };
    //         });

    //         const net = new SimpleNet(testnetUrl);

    //         // Call the function
    //         const path =
    //             '/subscriptions/block?pos=0x00ff96a04c916f714d31ff8a73ceb32e3267ce1f60526d80ecb19b33a37c0203';
    //         net.openWebSocketReader(path);

    //         // Verify that SimpleWebSocketReader was called with the correct URL
    //         const expectedURL =
    //             testnetUrl +
    //             '/subscriptions/block?pos=0x00ff96a04c916f714d31ff8a73ceb32e3267ce1f60526d80ecb19b33a37c0203';
    //         expect(mockWebSocketReader).toHaveBeenCalledWith(
    //             expectedURL,
    //             expect.any(Number)
    //         );
    //     });
    // });
});

describe('SimpleWebSocketReader', () => {
    // test('should resolve with data from the WebSocket', async () => {
    //     // Mock WebSocket and MessageEvent
    //     const mockWebSocket = {
    //         onmessage: (cb: (ev: MessageEvent) => void) => {
    //             const event = new MessageEvent('message', {
    //                 data: 'Test WebSocket Data'
    //             });
    //             cb(event);
    //         },
    //         onerror: () => {},
    //         onclose: () => {},
    //         close: () => {}
    //     };
    //     global.WebSocket = jest.fn(() => mockWebSocket) as never;

    //     const reader = new SimpleWebSocketReader(
    //         'wss://testnet.vechain.org/subscriptions/block?pos=0x00ff96a04c916f714d31ff8a73ceb32e3267ce1f60526d80ecb19b33a37c0203'
    //     );
    //     const data = await reader.read();

    //     expect(data).toBe(subscriptionBlockExpectedResponse);
    // });

    describe('openWebSocketReader', () => {
        // Create a new instance of SimpleNet before each test
        const net = new SimpleNet(testnetUrl);

        test('should create a WebSocket reader for a valid path', () => {
            const path =
                '/subscriptions/block?pos=0x00ff96a04c916f714d31ff8a73ceb32e3267ce1f60526d80ecb19b33a37c0203';
            const reader = net.openWebSocketReader(path);

            // You can add assertions here to check the reader or any other valid behavior
            expect(reader).toBeDefined();
        });

        // Restore the original console.log behavior after each test
        jest.restoreAllMocks();

        // test('should throw an error for an empty baseURL', () => {
        //     const path =
        //         '/subscriptions/block?pos=0x00ff96a04c916f714d31ff8a73ceb32e3267ce1f60526d80ecb19b33a37c0203';
        //     // netNoUrl.baseURL = ''; // Set baseURL to an empty string
        //     const netNoUrl = new SimpleNet('');

        //     // Create a variable to capture console output
        //     let consoleOutput = '';

        //     // Expect an error to be thrown
        //     expect(() => netNoUrl.openWebSocketReader(path)).toThrow(Error);
        //     // Replace console.error with a function that captures the output
        //     console.error = (message) => {
        //         consoleOutput += message;
        //     };

        //     // Expect the captured console output to contain the expected error message
        //     expect(consoleOutput).toContain('baseURL is empty');
        // });

        // test('should throw an error for an empty baseURL', () => {
        //     const path =
        //         '/subscriptions/block?pos=0x00ff96a04c916f714d31ff8a73ceb32e3267ce1f60526d80ecb19b33a37c0203';
        //     // netNoUrl.baseURL = ''; // Set baseURL to an empty string
        //     const netNoUrl = new SimpleNet('');

        //     // Spy on console.error to capture the error message
        //     const consoleErrorSpy = jest
        //         .spyOn(console, 'error')
        //         .mockImplementation(() => {});

        //     // Expect an error to be thrown
        //     expect(() => netNoUrl.openWebSocketReader(path)).toThrow(Error);

        //     // Expect a specific error message to be logged
        //     expect(consoleErrorSpy).toHaveBeenCalledWith('baseURL is empty');
        // });
    });

    // test('should reject on WebSocket error', async () => {
    //     // Mock WebSocket to simulate an error
    //     const mockWebSocket = {
    //         onmessage: () => {},
    //         onerror: (cb: (event: Event) => void) => {
    //             const errorEvent = new Event('error');
    //             cb(errorEvent);
    //         },
    //         onclose: () => {},
    //         close: () => {}
    //     };
    //     global.WebSocket = jest.fn(() => mockWebSocket) as never;

    //     const reader = new SimpleWebSocketReader('wss://testnet.vechain.org/');

    //     await expect(reader.read()).rejects.toThrow('WebSocket Error');
    // });
});
