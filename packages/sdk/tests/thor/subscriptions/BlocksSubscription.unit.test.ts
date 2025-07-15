import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import {
    BlocksSubscription,
    SubscriptionBlockResponse
} from '@thor/subscriptions';
import { BlockId } from '@vcdm';
import {
    mockWebSocketInstance,
    mockWebSocketConstructor
} from '../../utils/MockWSClient';

const mockBlockData = {
    number: 12345,
    id: '0x00003e9000000000000000000000000000000000000000000000000000000000',
    size: 1000,
    parentID:
        '0x00003e8000000000000000000000000000000000000000000000000000000000',
    timestamp: 1630000000,
    gasLimit: 21000,
    beneficiary: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
    gasUsed: 15000,
    totalScore: 12345,
    txsRoot:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    txsFeatures: 0,
    stateRoot:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    receiptsRoot:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    com: false,
    signer: '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed',
    obsolete: false,
    transactions: [
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    ]
};

/**
 * VeChain blocks subscription - unit
 *
 * @group unit/subscriptions
 */
describe('BlocksSubscription unit tests', () => {
    let subscription: BlocksSubscription;
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
        subscription = BlocksSubscription.at(mockWebSocketClient);
    });

    test('should receive block data when subscribed', (done) => {
        const mockListener = {
            onMessage: jest.fn(
                (event: MessageEvent<SubscriptionBlockResponse>) => {
                    // Verify we received the event with the correct data
                    expect(event).toBeTruthy();
                    expect(event.data).toBeTruthy();

                    // Check that the block number is correctly parsed
                    // The SubscriptionBlockResponse class wraps the number in a UInt object
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
        } satisfies WebSocketListener<SubscriptionBlockResponse>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Verify WebSocket was created with correct URL
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/block'
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
            data: JSON.stringify(mockBlockData)
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
            onError: jest.fn((_event: Event) => {
                if (mockListener !== null && mockListener !== undefined) {
                    expect(mockListener.onError).toHaveBeenCalled();
                }
                done();
            }),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBlockResponse>;

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
            onClose: jest.fn((_event: Event) => {
                if (mockListener !== null && mockListener !== undefined) {
                    expect(mockListener.onClose).toHaveBeenCalled();
                }
                done();
            }),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBlockResponse>;

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
        } satisfies WebSocketListener<SubscriptionBlockResponse>;

        const mockListener2 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBlockResponse>;

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
        const mockBlockData2 = { ...mockBlockData, number: 12346 };

        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionBlockResponse>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Simulate WebSocket open event
        if (
            mockWebSocketInstance.onopen !== null &&
            mockWebSocketInstance.onopen !== undefined
        ) {
            mockWebSocketInstance.onopen(new Event('open'));
        }

        // Simulate receiving first block data
        const mockMessage1 = new MessageEvent('message', {
            data: JSON.stringify(mockBlockData)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(mockMessage1);
        }

        // Simulate receiving second block data
        const mockMessage2 = new MessageEvent('message', {
            data: JSON.stringify(mockBlockData2)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(mockMessage2);
        }

        // Verify listener was called twice
        if (mockListener !== null && mockListener !== undefined) {
            expect(mockListener.onMessage).toHaveBeenCalledTimes(2);
        }
    });

    test('should close WebSocket connection', () => {
        // Open connection
        subscription.open();

        // Close connection
        subscription.close();

        // Verify WebSocket.close was called
        expect(mockWebSocketInstance.close).toHaveBeenCalled();
    });

    test('should create subscription with position', () => {
        const positionId = BlockId.of(
            '0x00003e9000000000000000000000000000000000000000000000000000000000'
        );

        // Create subscription with position
        const posSubscription = subscription.atPos(positionId);

        // Open connection
        posSubscription.open();

        // Verify WebSocket was created with correct URL including position
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/block?pos=${positionId}`
        );
    });

    test('should return the correct baseURL', () => {
        // Check that the baseURL is correctly returned
        expect(subscription.baseURL).toBe('ws://localhost:8669');
    });

    test('should convert SubscriptionBlockResponse to JSON', () => {
        // Create the response object
        const response = new SubscriptionBlockResponse(mockBlockData);

        // Convert back to JSON
        const jsonResult = response.toJSON();

        // Verify the result matches our original data
        expect(jsonResult).toEqual(mockBlockData);
    });
});
