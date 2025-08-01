import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { type WebSocketListener, MozillaWebSocketClient } from '@thor/ws';
import fastJsonStableStringify from 'fast-json-stable-stringify';

// Mock CloseEvent since it's not available in the test environment
class MockCloseEvent extends Event {
    code: number;
    reason: string;
    wasClean: boolean;

    constructor(
        type: string,
        options?: { code?: number; reason?: string; wasClean?: boolean }
    ) {
        super(type);
        this.code = options?.code ?? 1000;
        this.reason = options?.reason ?? '';
        this.wasClean = options?.wasClean ?? true;
    }
}

global.CloseEvent = MockCloseEvent as unknown as typeof CloseEvent;

// Create a proper mock class instead of an interface
class MockWebSocket implements WebSocket {
    CONNECTING = 0 as const;
    OPEN = 1 as const;
    CLOSING = 2 as const;
    CLOSED = 3 as const;

    onopen: ((event: Event) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;

    readyState: number = 0;
    binaryType: BinaryType = 'blob';
    bufferedAmount = 0;
    extensions = '';
    protocol = '';
    url = '';

    close = jest.fn();
    send = jest.fn();

    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    dispatchEvent = jest.fn((_event: Event) => true);
}

// Create instance of mock
const mockWebSocketInstance = new MockWebSocket();

const MockWebSocketConstructor = jest.fn().mockImplementation(() => {
    // Simulate connection process
    setTimeout(() => {
        mockWebSocketInstance.readyState = mockWebSocketInstance.OPEN;
        mockWebSocketInstance.onopen?.(new Event('open'));
    }, 0);
    return mockWebSocketInstance;
});

/**
 * VeChain websocket - unit
 *
 * @group unit/websocket
 */
describe('MozillaWebSocketClient unit tests', () => {
    let client: MozillaWebSocketClient;
    let mockListener: WebSocketListener<unknown>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Reset mock instance state
        Object.assign(mockWebSocketInstance, {
            onopen: null,
            onclose: null,
            onerror: null,
            onmessage: null,
            close: jest.fn(),
            readyState: mockWebSocketInstance.CONNECTING
        });

        global.WebSocket =
            MockWebSocketConstructor as unknown as typeof WebSocket;
        client = new MozillaWebSocketClient('ws://localhost:8669');
        mockListener = {
            onOpen: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onMessage: jest.fn()
        };
    });

    test('connection lifecycle', () => {
        client.addListener(mockListener);
        client.open({ path: '/test' });

        expect(mockWebSocketInstance.readyState).toBe(
            mockWebSocketInstance.CONNECTING
        );

        // Simulate connection success
        jest.runAllTimers();

        expect(mockWebSocketInstance.readyState).toBe(
            mockWebSocketInstance.OPEN
        );
        expect(mockListener.onOpen).toHaveBeenCalled();

        // Simulate closing
        client.close();
        mockWebSocketInstance.readyState = mockWebSocketInstance.CLOSED;
        mockWebSocketInstance.onclose?.(
            new MockCloseEvent('close', {
                code: 1000,
                reason: 'Normal closure'
            })
        );

        expect(mockListener.onClose).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 1000,
                reason: 'Normal closure'
            })
        );
    });

    test('handles connection failure', () => {
        client.addListener(mockListener);

        // Simulate connection failure
        MockWebSocketConstructor.mockImplementationOnce(() => {
            setTimeout(() => {
                mockWebSocketInstance.onerror?.(new Event('error'));
                mockWebSocketInstance.onclose?.(
                    new MockCloseEvent('close', {
                        code: 1006,
                        reason: 'Connection failed'
                    })
                );
            }, 0);
            return mockWebSocketInstance;
        });

        client.open({ path: '/test' });
        jest.runAllTimers();

        expect(mockListener.onError).toHaveBeenCalled();
        expect(mockListener.onClose).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 1006,
                reason: 'Connection failed'
            })
        );
    });

    test('handles message with different data types', () => {
        client.addListener(mockListener);
        client.open({ path: '/test' });
        jest.runAllTimers();

        // Test string data
        const stringMessage = new MessageEvent('message', {
            data: 'test data'
        });
        mockWebSocketInstance.onmessage?.(stringMessage);
        expect(mockListener.onMessage).toHaveBeenCalledWith(stringMessage);

        // Test JSON data
        const jsonMessage = new MessageEvent('message', {
            data: fastJsonStableStringify({
                type: 'event',
                data: { value: 123 }
            })
        });
        mockWebSocketInstance.onmessage?.(jsonMessage);
        expect(mockListener.onMessage).toHaveBeenCalledWith(jsonMessage);

        // Test binary data
        const binaryMessage = new MessageEvent('message', {
            data: new Uint8Array([1, 2, 3]).buffer
        });
        mockWebSocketInstance.onmessage?.(binaryMessage);
        expect(mockListener.onMessage).toHaveBeenCalledWith(binaryMessage);
    });

    test('multiple listeners handle all events correctly', () => {
        const secondListener = {
            onOpen: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onMessage: jest.fn()
        };

        client.addListener(mockListener);
        client.addListener(secondListener);
        client.open({ path: '/test' });

        // Test connection open
        jest.runAllTimers();
        expect(mockListener.onOpen).toHaveBeenCalled();
        expect(secondListener.onOpen).toHaveBeenCalled();

        // Test message handling
        const messageEvent = new MessageEvent('message', { data: 'test' });
        mockWebSocketInstance.onmessage?.(messageEvent);
        expect(mockListener.onMessage).toHaveBeenCalledWith(messageEvent);
        expect(secondListener.onMessage).toHaveBeenCalledWith(messageEvent);

        // Test error handling
        const errorEvent = new Event('error');
        mockWebSocketInstance.onerror?.(errorEvent);
        expect(mockListener.onError).toHaveBeenCalledWith(errorEvent);
        expect(secondListener.onError).toHaveBeenCalledWith(errorEvent);
    });

    test('removeListener stops event propagation', () => {
        client.addListener(mockListener);
        client.open({ path: '/test' });
        jest.runAllTimers();

        const messageEvent = new MessageEvent('message', { data: 'test' });
        mockWebSocketInstance.onmessage?.(messageEvent);
        expect(mockListener.onMessage).toHaveBeenCalledWith(messageEvent);

        // Remove listener and verify no more events are received
        client.removeListener(mockListener);
        const newMessage = new MessageEvent('message', { data: 'test2' });
        mockWebSocketInstance.onmessage?.(newMessage);
        expect(mockListener.onMessage).toHaveBeenCalledTimes(1); // Only from the first message
    });

    test('reconnection behavior', () => {
        client.open({ path: '/test1' });
        jest.runAllTimers();

        const firstConnection = mockWebSocketInstance.close;
        client.open({ path: '/test2' });

        expect(firstConnection).toHaveBeenCalled();
        expect(MockWebSocketConstructor).toHaveBeenCalledTimes(2);
        expect(MockWebSocketConstructor).toHaveBeenLastCalledWith(
            'ws://localhost:8669/test2'
        );
    });
});
