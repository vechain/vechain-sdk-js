import { beforeEach, describe, jest, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import {
    BeatsSubscription,
    SubscriptionBeat2Response,
    type SubscriptionBeat2ResponseJSON
} from '../../../src/thor/subscriptions';

// Create a mock WebSocket instance that will be returned by the constructor
const mockWebSocketInstance = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
    onopen: null as ((event: Event) => void) | null,
    onclose: null as ((event: CloseEvent) => void) | null,
    onerror: null as ((event: Event) => void) | null,
    onmessage: null as ((event: MessageEvent) => void) | null
};

// Mock WebSocket constructor to return our instance
const mockWebSocketConstructor = jest
    .fn()
    .mockImplementation(() => mockWebSocketInstance);

// Set up global WebSocket
global.WebSocket = mockWebSocketConstructor as unknown as typeof WebSocket;

/**
 * VeChain beats subscription - unit
 *
 * @group unit/subscriptions
 */
describe('BeatsSubscription unit tests', () => {
    let subscription: BeatsSubscription;
    let mockWebSocketClient: MozillaWebSocketClient;

    beforeEach(() => {
        jest.clearAllMocks();

        // Reset the mock instance properties
        Object.assign(mockWebSocketInstance, {
            onopen: null as ((event: Event) => void) | null,
            onclose: null as ((event: CloseEvent) => void) | null,
            onerror: null as ((event: Event) => void) | null,
            onmessage: null as ((event: MessageEvent) => void) | null
        });

        mockWebSocketClient = new MozillaWebSocketClient('ws://localhost:8669');
        subscription = BeatsSubscription.at(mockWebSocketClient);
    });

    test('should receive beat data when subscribed', (done) => {
        const mockBeatData = {
            gasLimit: 21000,
            obsolete: false,
            number: 12345,
            id: '0x00003e9000000000000000000000000000000000000000000000000000000000',
            parentID:
                '0x00003e8000000000000000000000000000000000000000000000000000000000',
            timestamp: 1630000000,
            txsFeatures: 0,
            bloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            k: 0
        } satisfies SubscriptionBeat2ResponseJSON;

        const mockListener = {
            onMessage: jest.fn(
                (event: MessageEvent<SubscriptionBeat2Response>) => {
                    // Verify we received the event with the correct data
                    expect(event).toBeTruthy();
                    expect(event.data).toBeTruthy();

                    // Check that the beat number is correctly parsed
                    // The SubscriptionBeat2Response class wraps the number in a UInt object
                    // which has a valueOf() method that returns the number
                    expect(event.data.number.valueOf()).toBe(12345);

                    if (mockListener !== null && mockListener !== undefined) {
                        expect(mockListener.onOpen).toHaveBeenCalled();
                    }
                    done();
                }
            ),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBeat2Response>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Verify WebSocket was created with correct URL
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/beat2'
        );

        // Simulate WebSocket open event
        if (
            mockWebSocketInstance.onopen !== null &&
            mockWebSocketInstance.onopen !== undefined
        ) {
            mockWebSocketInstance.onopen(new Event('open'));
        }

        // Create a message event with the raw string data
        const mockMessage = new MessageEvent('message', {
            data: JSON.stringify(mockBeatData)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(mockMessage);
        }
    });

    test('should handle connection errors', (done) => {
        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(() => {
                expect(mockListener.onError).toHaveBeenCalled();
                done();
            }),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBeat2Response>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Simulate WebSocket error event
        if (
            mockWebSocketInstance.onerror !== null &&
            mockWebSocketInstance.onerror !== undefined
        ) {
            mockWebSocketInstance.onerror(new Event('error'));
        }
    });

    test('should handle connection close', (done) => {
        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(() => {
                expect(mockListener.onClose).toHaveBeenCalled();
                done();
            }),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBeat2Response>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Simulate WebSocket close event
        const closeEvent = new Event('close') as CloseEvent;
        if (
            mockWebSocketInstance.onclose !== null &&
            mockWebSocketInstance.onclose !== undefined
        ) {
            mockWebSocketInstance.onclose(closeEvent);
        }
    });

    test('should properly remove listeners', () => {
        const mockListener1 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBeat2Response>;

        const mockListener2 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBeat2Response>;

        // Add both listeners
        subscription.addListener(mockListener1).addListener(mockListener2);

        // Remove first listener
        subscription.removeListener(mockListener1);

        // Open connection
        subscription.open();

        // Simulate WebSocket open event
        if (
            mockWebSocketInstance.onopen !== null &&
            mockWebSocketInstance.onopen !== undefined
        ) {
            mockWebSocketInstance.onopen(new Event('open'));
        }

        // First listener should not be called, second one should be
        if (mockListener1 !== null && mockListener1 !== undefined) {
            expect(mockListener1.onOpen).not.toHaveBeenCalled();
        }
        if (mockListener2 !== null && mockListener2 !== undefined) {
            expect(mockListener2.onOpen).toHaveBeenCalled();
        }
    });

    test('should handle multiple message events', () => {
        const mockBeatData1 = {
            gasLimit: 21000,
            obsolete: false,
            number: 12345,
            id: '0x00003e9000000000000000000000000000000000000000000000000000000000',
            parentID:
                '0x00003e8000000000000000000000000000000000000000000000000000000000',
            timestamp: 1630000000,
            txsFeatures: 0,
            bloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            k: 0
        } satisfies SubscriptionBeat2ResponseJSON;

        const mockBeatData2 = { ...mockBeatData1, number: 12346 };

        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBeat2Response>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Simulate WebSocket open event
        if (
            mockWebSocketInstance.onopen !== null &&
            mockWebSocketInstance.onopen !== undefined
        ) {
            mockWebSocketInstance.onopen(new Event('open'));
        }

        // Simulate receiving first beat data
        const mockMessage1 = new MessageEvent('message', {
            data: JSON.stringify(mockBeatData1)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(mockMessage1);
        }

        // Simulate receiving second beat data
        const mockMessage2 = new MessageEvent('message', {
            data: JSON.stringify(mockBeatData2)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(mockMessage2);
        }

        // Verify listener was called twice
        expect(mockListener.onMessage).toHaveBeenCalledTimes(2);
    });

    test('should close WebSocket connection', () => {
        // Open connection
        subscription.open();

        // Close connection
        subscription.close();

        // Verify WebSocket.close was called
        expect(mockWebSocketInstance.close).toHaveBeenCalled();
    });

    test('should return the correct baseURL', () => {
        // Check that the baseURL is correctly returned
        expect(subscription.baseURL).toBe('ws://localhost:8669');
    });

    test('should convert SubscriptionBeat2Response to JSON', () => {
        // Create mock JSON data
        const mockData = {
            gasLimit: 21000,
            obsolete: false,
            number: 12345,
            id: '0x00003e9000000000000000000000000000000000000000000000000000000000',
            parentID:
                '0x00003e8000000000000000000000000000000000000000000000000000000000',
            timestamp: 1630000000,
            txsFeatures: 0,
            bloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            k: 0
        } satisfies SubscriptionBeat2ResponseJSON;

        // Create the response object
        const response = new SubscriptionBeat2Response(mockData);

        // Convert back to JSON
        const jsonResult = response.toJSON();

        // Verify the result matches our original data
        expect(jsonResult).toEqual(mockData);
    });
});
