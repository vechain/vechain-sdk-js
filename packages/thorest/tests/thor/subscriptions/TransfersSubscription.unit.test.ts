import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import {
    TransfersSubscription,
    SubscriptionTransferResponse,
    type SubscriptionTransferJSON
} from '@thor/subscriptions';
import { Address, BlockId } from '@vechain/sdk-core';
import type { LogMetaJSON } from '@thor/logs';

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

// Factory functions for creating TransfersSubscription instances with different parameters
// This avoids using reflection and provides a cleaner test approach
const createWithPosition = (
    baseURL: string,
    pos: BlockId
): TransfersSubscription => {
    // @ts-expect-error - We're accessing a protected constructor for testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new TransfersSubscription(
        new MozillaWebSocketClient(baseURL),
        // Using internal class for testing
        new (class {
            readonly pos = pos;
            get query(): string {
                return `?pos=${this.pos}`;
            }
        })()
    );
};

const createWithSender = (
    baseURL: string,
    sender: Address
): TransfersSubscription => {
    // @ts-expect-error - We're accessing a protected constructor for testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new TransfersSubscription(
        new MozillaWebSocketClient(baseURL),
        // Using internal class for testing
        new (class {
            readonly sender = sender;
            get query(): string {
                return `?sender=${this.sender}`;
            }
        })()
    );
};

const createWithRecipient = (
    baseURL: string,
    recipient: Address
): TransfersSubscription => {
    // @ts-expect-error - We're accessing a protected constructor for testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new TransfersSubscription(
        new MozillaWebSocketClient(baseURL),
        // Using internal class for testing
        new (class {
            readonly recipient = recipient;
            get query(): string {
                return `?recipient=${this.recipient}`;
            }
        })()
    );
};

const createWithTxOrigin = (
    baseURL: string,
    txOrigin: Address
): TransfersSubscription => {
    // @ts-expect-error - We're accessing a protected constructor for testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new TransfersSubscription(
        new MozillaWebSocketClient(baseURL),
        // Using internal class for testing
        new (class {
            readonly txOrigin = txOrigin;
            get query(): string {
                return `?txOrigin=${this.txOrigin}`;
            }
        })()
    );
};

const createWithMultipleParams = (
    baseURL: string,
    pos: BlockId,
    recipient: Address,
    sender: Address,
    txOrigin: Address
): TransfersSubscription => {
    // @ts-expect-error - We're accessing a protected constructor for testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new TransfersSubscription(
        new MozillaWebSocketClient(baseURL),
        // Using internal class for testing
        new (class {
            readonly pos = pos;
            readonly recipient = recipient;
            readonly sender = sender;
            readonly txOrigin = txOrigin;
            get query(): string {
                return `?pos=${this.pos}&recipient=${this.recipient}&sender=${this.sender}&txOrigin=${this.txOrigin}`;
            }
        })()
    );
};

/**
 * VeChain transfers subscription - unit
 *
 * @group unit/subscriptions
 */
describe('TransfersSubscription unit tests', () => {
    let subscription: TransfersSubscription;
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
        subscription = TransfersSubscription.at(mockWebSocketClient);
    });

    test('should receive transfer data when subscribed', (done) => {
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

        const mockTransferData = {
            sender: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            recipient: '0x9567d83b7b8d80addcb281a71d54fc7b3364ffed',
            amount: '0x0de0b6b3a7640000', // 1 ETH in wei
            obsolete: false,
            meta: mockLogMeta
        } satisfies SubscriptionTransferJSON;

        const mockListener = {
            onMessage: jest.fn(
                (event: MessageEvent<SubscriptionTransferResponse>) => {
                    // Verify we received the event with the correct data
                    expect(event).toBeTruthy();
                    expect(event.data).toBeTruthy();
                    expect(event.data.sender.toString().toLowerCase()).toBe(
                        mockTransferData.sender.toLowerCase()
                    );
                    expect(event.data.recipient.toString().toLowerCase()).toBe(
                        mockTransferData.recipient.toLowerCase()
                    );
                    expect(event.data.obsolete).toBe(mockTransferData.obsolete);

                    if (mockListener !== null && mockListener !== undefined) {
                        expect(mockListener.onOpen).toHaveBeenCalled();
                    }
                    done();
                }
            ),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        // Add listener and open connection
        subscription
            .addListener(mockListener as WebSocketListener<unknown>)
            .open();

        // Verify WebSocket was created with correct URL
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/transfer'
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
            data: JSON.stringify(mockTransferData)
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
                if (mockListener !== null && mockListener !== undefined) {
                    expect(mockListener.onError).toHaveBeenCalled();
                }
                done();
            }),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        // Add listener and open connection
        subscription
            .addListener(mockListener as WebSocketListener<unknown>)
            .open();

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
                if (mockListener !== null && mockListener !== undefined) {
                    expect(mockListener.onClose).toHaveBeenCalled();
                }
                done();
            }),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

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
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        const mockListener2 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

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

    test('should create subscription with query parameters', () => {
        // Testing with various query parameters using our factory functions
        jest.clearAllMocks();

        // Test with position
        const pos = BlockId.of(
            '0x00003e9000000000000000000000000000000000000000000000000000000000'
        );
        const posSubscription = createWithPosition('ws://localhost:8669', pos);
        posSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/transfer?pos=${pos}`
        );

        jest.clearAllMocks();

        // Test with sender
        const sender = Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');
        const senderSubscription = createWithSender(
            'ws://localhost:8669',
            sender
        );
        senderSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/transfer?sender=${sender}`
        );

        jest.clearAllMocks();

        // Test with recipient
        const recipient = Address.of(
            '0x9567d83b7b8d80addcb281a71d54fc7b3364ffed'
        );
        const recipientSubscription = createWithRecipient(
            'ws://localhost:8669',
            recipient
        );
        recipientSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/transfer?recipient=${recipient}`
        );

        jest.clearAllMocks();

        // Test with txOrigin
        const txOrigin = Address.of(
            '0x5567d83b7b8d80addcb281a71d54fc7b3364ffed'
        );
        const txOriginSubscription = createWithTxOrigin(
            'ws://localhost:8669',
            txOrigin
        );
        txOriginSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/transfer?txOrigin=${txOrigin}`
        );

        jest.clearAllMocks();

        // Test with all parameters
        const allParamsSubscription = createWithMultipleParams(
            'ws://localhost:8669',
            pos,
            recipient,
            sender,
            txOrigin
        );
        allParamsSubscription.open();
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            `ws://localhost:8669/subscriptions/transfer?pos=${pos}&recipient=${recipient}&sender=${sender}&txOrigin=${txOrigin}`
        );
    });

    test('should convert SubscriptionTransferResponse to JSON', () => {
        // Create mock JSON data
        const mockLogMeta: LogMetaJSON = {
            blockID:
                '0x00003e9000000000000000000000000000000000000000000000000000000000',
            blockNumber: 12345,
            blockTimestamp: 1630000000,
            txID: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            clauseIndex: 0,
            txIndex: 0,
            logIndex: 0
        };

        const mockData: SubscriptionTransferJSON = {
            sender: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            recipient: '0x9567d83b7b8d80addcb281a71d54fc7b3364ffed',
            amount: '0x0de0b6b3a7640000', // 1 ETH in wei
            obsolete: false,
            meta: mockLogMeta
        };

        // Create the response object
        const response = new SubscriptionTransferResponse(mockData);

        // Convert back to JSON
        const jsonResult = response.toJSON();

        // Verify fields match (case-insensitive for addresses and hex strings)
        expect(jsonResult.sender.toLowerCase()).toEqual(
            mockData.sender.toLowerCase()
        );
        expect(jsonResult.recipient.toLowerCase()).toEqual(
            mockData.recipient.toLowerCase()
        );
        expect(jsonResult.amount.toLowerCase()).toEqual(
            mockData.amount.toLowerCase()
        );
        expect(jsonResult.obsolete).toEqual(mockData.obsolete);
        expect(jsonResult.meta.blockNumber).toEqual(mockData.meta.blockNumber);
        expect(jsonResult.meta.blockTimestamp).toEqual(
            mockData.meta.blockTimestamp
        );
        expect(jsonResult.meta.clauseIndex).toEqual(mockData.meta.clauseIndex);
        expect(jsonResult.meta.blockID.toLowerCase()).toEqual(
            mockData.meta.blockID.toLowerCase()
        );
        expect(jsonResult.meta.txID.toLowerCase()).toEqual(
            mockData.meta.txID.toLowerCase()
        );
        expect(jsonResult.meta.txOrigin.toLowerCase()).toEqual(
            mockData.meta.txOrigin.toLowerCase()
        );
    });

    test('should test event handling with all event types', () => {
        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Test onOpen event
        const openEvent = new Event('open');
        if (
            mockWebSocketInstance.onopen !== null &&
            mockWebSocketInstance.onopen !== undefined
        ) {
            mockWebSocketInstance.onopen(openEvent);
        }
        if (mockListener !== null && mockListener !== undefined) {
            expect(mockListener.onOpen).toHaveBeenCalledWith(openEvent);
        }

        // Test onError event
        const errorEvent = new Event('error');
        if (
            mockWebSocketInstance.onerror !== null &&
            mockWebSocketInstance.onerror !== undefined
        ) {
            mockWebSocketInstance.onerror(errorEvent);
        }
        if (mockListener !== null && mockListener !== undefined) {
            expect(mockListener.onError).toHaveBeenCalledWith(errorEvent);
        }

        // Test onClose event
        const closeEvent = new Event('close') as CloseEvent;
        if (
            mockWebSocketInstance.onclose !== null &&
            mockWebSocketInstance.onclose !== undefined
        ) {
            mockWebSocketInstance.onclose(closeEvent);
        }
        if (mockListener !== null && mockListener !== undefined) {
            expect(mockListener.onClose).toHaveBeenCalledWith(closeEvent);
        }

        // Test onMessage event with valid data
        const validData = {
            sender: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            recipient: '0x9567d83b7b8d80addcb281a71d54fc7b3364ffed',
            amount: '0x0de0b6b3a7640000',
            obsolete: false,
            meta: {
                blockID:
                    '0x00003e9000000000000000000000000000000000000000000000000000000000',
                blockNumber: 12345,
                blockTimestamp: 1630000000,
                txID: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                clauseIndex: 0,
                txIndex: 0,
                logIndex: 0
            }
        };
        const validMessage = new MessageEvent('message', {
            data: JSON.stringify(validData)
        });
        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(validMessage);
        }
        if (mockListener !== null && mockListener !== undefined) {
            expect(mockListener.onMessage).toHaveBeenCalled();
        }
    });

    test('should handle error when removing a non-existent listener', () => {
        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        // Try to remove a listener that doesn't exist
        // This should not throw an error
        subscription.removeListener(mockListener);

        // Add the listener and remove it twice
        subscription.addListener(mockListener);
        subscription.removeListener(mockListener);

        // Removing it again should not cause an error
        subscription.removeListener(mockListener);
    });

    test('should safely handle message event with various data formats', () => {
        const mockListener = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        // Add listener and open connection
        subscription.addListener(mockListener).open();

        // Test with valid JSON
        const validData = {
            sender: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            recipient: '0x9567d83b7b8d80addcb281a71d54fc7b3364ffed',
            amount: '0x0de0b6b3a7640000',
            obsolete: false,
            meta: {
                blockID:
                    '0x00003e9000000000000000000000000000000000000000000000000000000000',
                blockNumber: 12345,
                blockTimestamp: 1630000000,
                txID: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                txOrigin: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                clauseIndex: 0,
                txIndex: 0,
                logIndex: 0
            }
        };

        const validMessage = new MessageEvent('message', {
            data: JSON.stringify(validData)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(validMessage);
        }
        if (mockListener !== null && mockListener !== undefined) {
            expect(mockListener.onMessage).toHaveBeenCalled();
        }
    });

    test('should handle chaining of methods correctly', () => {
        // Reset the mock before this test
        jest.clearAllMocks();

        // Reset the mock instance properties to ensure clean state
        Object.assign(mockWebSocketInstance, {
            onopen: null as ((event: Event) => void) | null,
            onclose: null as ((event: CloseEvent) => void) | null,
            onerror: null as ((event: Event) => void) | null,
            onmessage: null as ((event: MessageEvent) => void) | null
        });

        const mockListener1 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        const mockListener2 = {
            onMessage: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<SubscriptionTransferResponse>;

        // Use the actual mockWebSocketClient that's connected to the global mockWebSocketInstance
        mockWebSocketClient = new MozillaWebSocketClient('ws://localhost:8669');
        const sub = TransfersSubscription.at(mockWebSocketClient);

        // Add listeners first
        sub.addListener(
            mockListener1 as WebSocketListener<unknown>
        ).addListener(mockListener2 as WebSocketListener<unknown>);

        // Then open the connection
        sub.open();

        // Verify WebSocket constructor was called with correct URL
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/transfer'
        );

        // Manually trigger the onopen callback which should call both listeners
        if (
            mockWebSocketInstance.onopen !== null &&
            mockWebSocketInstance.onopen !== undefined
        ) {
            mockWebSocketInstance.onopen(new Event('open'));
        }

        // Verify both listeners received onOpen event
        expect(mockListener1.onOpen).toHaveBeenCalled();
        expect(mockListener2.onOpen).toHaveBeenCalled();

        // Verify method chaining by checking that sub is returned
        const result = sub.close();
        expect(result).toBe(sub);

        // Verify close was called
        expect(mockWebSocketInstance.close).toHaveBeenCalled();
    });
});
