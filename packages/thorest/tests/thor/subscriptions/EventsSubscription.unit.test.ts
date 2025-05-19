import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '@ws';
import {
    EventsSubscription,
    SubscriptionEventResponse,
    type SubscriptionEventResponseJSON
} from '@thor/subscriptions';
import { Address, ThorId } from '@vechain/sdk-core';
import { type LogMetaJSON } from '@thor/logs';

const mockLogMeta = {
    blockID:
        '0x00003e9000000000000000000000000000000000000000000000000000000000',
    blockNumber: 12345,
    blockTimestamp: 1630000000,
    txID: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    clauseIndex: 0,
    txIndex: 0,
    logIndex: 0
} satisfies LogMetaJSON;

const mockEventData = {
    address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    topics: [
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        '0x0000000000000000000000000000000000000000000000000000000000000002'
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000003',
    obsolete: false,
    meta: mockLogMeta
} satisfies SubscriptionEventResponseJSON;

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
 * VeChain events subscription - unit
 *
 * @group unit/subscriptions
 */
describe('EventsSubscription unit tests', () => {
    let subscription: EventsSubscription;
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
        subscription = EventsSubscription.at(mockWebSocketClient);
    });

    test('should receive event data when subscribed', (done) => {
        const mockListener = {
            onMessage: jest.fn(
                (event: MessageEvent<SubscriptionEventResponse>) => {
                    // Verify we received the event with the correct data
                    expect(event).toBeTruthy();
                    expect(event.data).toBeTruthy();
                    expect(event.data.address.toString().toLowerCase()).toBe(
                        mockEventData.address.toLowerCase()
                    );
                    expect(event.data.topics.length).toBe(
                        mockEventData.topics.length
                    );
                    expect(event.data.obsolete).toBe(mockEventData.obsolete);

                    if (mockListener !== null && mockListener !== undefined) {
                        expect(mockListener.onOpen).toHaveBeenCalled();
                    }
                    done();
                }
            ),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionEventResponse>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Verify WebSocket was created with correct URL
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/event'
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
            data: JSON.stringify(mockEventData)
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
        } satisfies WebSocketListener<SubscriptionEventResponse>;

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
        } satisfies WebSocketListener<SubscriptionEventResponse>;

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
        } satisfies WebSocketListener<SubscriptionEventResponse>;

        const mockListener2 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionEventResponse>;

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

    test('should return the correct baseURL', () => {
        // Check that the baseURL is correctly returned
        expect(subscription.baseURL).toBe('ws://localhost:8669');
    });

    test('should create subscription with filters', () => {
        const contractAddress = Address.of(
            '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        );
        const t0 = ThorId.of(
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        );
        const t1 = ThorId.of(
            '0x0000000000000000000000000000000000000000000000000000000000000002'
        );
        const t2 = ThorId.of(
            '0x0000000000000000000000000000000000000000000000000000000000000003'
        );
        const t3 = ThorId.of(
            '0x0000000000000000000000000000000000000000000000000000000000000004'
        );
        const pos = ThorId.of(
            '0x00003e9000000000000000000000000000000000000000000000000000000000'
        );

        // Create subscription with contract address
        const addrSubscription =
            subscription.withContractAddress(contractAddress);
        addrSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?addr=${contractAddress}`
        );

        // Reset mock
        jest.clearAllMocks();

        // Create subscription with position
        const posSubscription = subscription.atPos(pos);
        posSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?pos=${pos}`
        );

        // Reset mock
        jest.clearAllMocks();

        // Create subscription with filters - one at a time to ensure all branches are covered
        const t0Subscription = subscription.withFilters(t0);
        t0Subscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?t0=${t0}`
        );

        // Reset mock
        jest.clearAllMocks();

        const t1Subscription = subscription.withFilters(undefined, t1);
        t1Subscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?t1=${t1}`
        );

        // Reset mock
        jest.clearAllMocks();

        const t2Subscription = subscription.withFilters(
            undefined,
            undefined,
            t2
        );
        t2Subscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?t2=${t2}`
        );

        // Reset mock
        jest.clearAllMocks();

        const t3Subscription = subscription.withFilters(
            undefined,
            undefined,
            undefined,
            t3
        );
        t3Subscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?t3=${t3}`
        );

        // Reset mock
        jest.clearAllMocks();

        // Create subscription with all filters
        const filterSubscription = subscription.withFilters(t0, t1, t2, t3);
        filterSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?t0=${t0}&t1=${t1}&t2=${t2}&t3=${t3}`
        );

        // Reset mock
        jest.clearAllMocks();

        // Create subscription with all parameters
        const fullSubscription = subscription
            .withContractAddress(contractAddress)
            .atPos(pos)
            .withFilters(t0, t1, t2, t3);
        fullSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/event?addr=${contractAddress}&pos=${pos}&t0=${t0}&t1=${t1}&t2=${t2}&t3=${t3}`
        );

        // Reset mock
        jest.clearAllMocks();

        // Test with empty parameters
        const emptySubscription = subscription
            .withContractAddress()
            .atPos()
            .withFilters();
        emptySubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/event'
        );
    });

    test('should convert SubscriptionEventResponse to JSON', () => {
        // Create the response object
        const response = new SubscriptionEventResponse(mockEventData);

        // Convert back to JSON
        const jsonResult = response.toJSON();

        // Verify fields match (case-insensitive for addresses and hex strings)
        expect(jsonResult.address.toLowerCase()).toEqual(
            mockEventData.address.toLowerCase()
        );
        expect(jsonResult.topics.length).toEqual(mockEventData.topics.length);
        expect(jsonResult.topics[0].toLowerCase()).toEqual(
            mockEventData.topics[0].toLowerCase()
        );
        expect(jsonResult.topics[1].toLowerCase()).toEqual(
            mockEventData.topics[1].toLowerCase()
        );
        expect(jsonResult.data.toLowerCase()).toEqual(
            mockEventData.data.toLowerCase()
        );
        expect(jsonResult.obsolete).toEqual(mockEventData.obsolete);
        expect(jsonResult.meta.blockNumber).toEqual(
            mockEventData.meta.blockNumber
        );
        expect(jsonResult.meta.blockTimestamp).toEqual(
            mockEventData.meta.blockTimestamp
        );
        expect(jsonResult.meta.clauseIndex).toEqual(
            mockEventData.meta.clauseIndex
        );
        expect(jsonResult.meta.blockID.toLowerCase()).toEqual(
            mockEventData.meta.blockID.toLowerCase()
        );
        expect(jsonResult.meta.txID.toLowerCase()).toEqual(
            mockEventData.meta.txID.toLowerCase()
        );
        expect(jsonResult.meta.txOrigin.toLowerCase()).toEqual(
            mockEventData.meta.txOrigin.toLowerCase()
        );
    });
});
