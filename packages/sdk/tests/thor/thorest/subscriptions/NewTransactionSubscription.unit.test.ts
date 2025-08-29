import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import { NewTransactionSubscription } from '@thor/thorest/subscriptions';
import { type TXID } from '@thor/thorest';
import {
    mockWebSocketInstance,
    mockWebSocketConstructor
} from '../../../MockWSClient';

/**
 * VeChain new transaction subscription - unit
 *
 * @group unit/thor/subscriptions
 */
describe('NewTransactionSubscription unit tests', () => {
    let subscription: NewTransactionSubscription;
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
        subscription = NewTransactionSubscription.at(mockWebSocketClient);
    });

    test('should receive transaction data when subscribed', (done) => {
        const mockTXID = {
            id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        };

        const mockListener = {
            onMessage: jest.fn((event: MessageEvent<TXID>) => {
                // Verify we received the event with the correct data
                expect(event).toBeTruthy();
                expect(event.data).toBeTruthy();
                expect(event.data.id.toString()).toBe(mockTXID.id);

                if (mockListener !== null && mockListener !== undefined) {
                    expect(mockListener.onOpen).toHaveBeenCalled();
                }
                done();
            }),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        } satisfies WebSocketListener<TXID>;

        // Add listener and open connection
        subscription
            .addListener(mockListener as WebSocketListener<unknown>)
            .open();

        // Verify WebSocket was created with correct URL
        expect(mockWebSocketConstructor).toHaveBeenCalledWith(
            'ws://localhost:8669/subscriptions/txpool'
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
            data: JSON.stringify(mockTXID)
        });

        if (
            mockWebSocketInstance.onmessage !== null &&
            mockWebSocketInstance.onmessage !== undefined
        ) {
            mockWebSocketInstance.onmessage(mockMessage);
        }
    });

    afterEach(() => {
        subscription.close();
    });
});
