import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import {
    MozillaWebSocketClient,
    type WebSocketListener
} from '../../../src/ws';
import { NewTransactionSubscription } from '../../../src/thor/subscriptions';
import { type TXID } from '../../../src';

global.WebSocket = jest.fn(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    send: jest.fn(),
    close: jest.fn()
})) as unknown as typeof WebSocket;

/**
 * VeChain new transaction subscription - unit
 *
 * @group unit/subscriptions
 */
describe('NewTransactionSubscription unit tests', () => {
    let subscription: NewTransactionSubscription;
    let mockWebSocketClient: MozillaWebSocketClient;

    beforeEach(() => {
        mockWebSocketClient = new MozillaWebSocketClient('ws://localhost:8669');
        subscription = NewTransactionSubscription.at(mockWebSocketClient);
    });

    test('data <- open', (done) => {
        const mockListener: WebSocketListener<TXID> = {
            onMessage: jest.fn((event: MessageEvent<TXID>) => {
                const data = event.data;
                expect(data).toEqual({ id: 'txid123' });
                done();
            }),
            onClose: jest.fn(),
            onError: jest.fn(),
            onOpen: jest.fn()
        };

        subscription.addListener(mockListener).open();

        // Simulate the onMessage event
        const mockMessage = {
            data: { id: 'txid123' }
        } as unknown as MessageEvent<TXID>;
        mockListener.onMessage(mockMessage);
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
