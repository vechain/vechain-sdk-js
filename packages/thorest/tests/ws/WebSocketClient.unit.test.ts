import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { type WebSocketClient, type WebSocketListener } from '../../src/ws';
import { type HttpPath } from '../../src/http';

// Mock implementation of WebSocketClient for testing
class MockWebSocketClient implements WebSocketClient {
    private readonly _baseURL: string;
    private readonly listeners: Array<WebSocketListener<unknown>> = [];
    private isOpen = false;

    constructor(baseURL: string) {
        this._baseURL = baseURL;
    }

    get baseURL(): string {
        return this._baseURL;
    }

    addListener = jest.fn(
        (listener: WebSocketListener<unknown>): WebSocketClient => {
            this.listeners.push(listener);
            return this;
        }
    );

    removeListener = jest.fn(
        (listener: WebSocketListener<unknown>): WebSocketClient => {
            const index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
            return this;
        }
    );

    open = jest.fn((_path: HttpPath): WebSocketClient => {
        this.isOpen = true;
        this.listeners.forEach((listener) => {
            listener.onOpen?.(new Event('open'));
        });
        return this;
    });

    close = jest.fn((): WebSocketClient => {
        if (this.isOpen) {
            this.isOpen = false;
            this.listeners.forEach((listener) => {
                listener.onClose?.(new MockCloseEvent('close', { code: 1000 }));
            });
        }
        return this;
    });
}

// Mock CloseEvent for testing
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

/**
 * VeChain websocket - unit
 *
 * @group unit/websocket
 */
describe('WebSocketClient interface tests', () => {
    let client: MockWebSocketClient;
    let mockListener: WebSocketListener<unknown>;

    beforeEach(() => {
        client = new MockWebSocketClient('ws://localhost:8669');
        mockListener = {
            onOpen: jest.fn(),
            onClose: jest.fn(),
            onError: jest.fn(),
            onMessage: jest.fn()
        };
    });

    test('baseURL property returns the correct URL', () => {
        expect(client.baseURL).toBe('ws://localhost:8669');
    });

    test('addListener adds a listener and returns this', () => {
        const result = client.addListener(mockListener);
        expect(client.addListener).toHaveBeenCalledWith(mockListener);
        expect(result).toBe(client);
    });

    test('removeListener removes a listener and returns this', () => {
        client.addListener(mockListener);
        const result = client.removeListener(mockListener);
        expect(client.removeListener).toHaveBeenCalledWith(mockListener);
        expect(result).toBe(client);
    });

    test('open calls onOpen on all listeners and returns this', () => {
        const secondListener = { ...mockListener, onOpen: jest.fn() };
        client.addListener(mockListener);
        client.addListener(secondListener);

        const result = client.open({ path: '/test' });

        expect(client.open).toHaveBeenCalledWith({ path: '/test' });
        expect(mockListener.onOpen).toHaveBeenCalled();
        expect(secondListener.onOpen).toHaveBeenCalled();
        expect(result).toBe(client);
    });

    test('close calls onClose on all listeners and returns this', () => {
        const secondListener = { ...mockListener, onClose: jest.fn() };
        client.addListener(mockListener);
        client.addListener(secondListener);
        client.open({ path: '/test' }); // Open first

        const result = client.close();

        expect(client.close).toHaveBeenCalled();
        expect(mockListener.onClose).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 1000,
                type: 'close'
            })
        );
        expect(secondListener.onClose).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 1000,
                type: 'close'
            })
        );
        expect(result).toBe(client);
    });

    test('close is idempotent', () => {
        client.addListener(mockListener);
        client.open({ path: '/test' });

        client.close();
        client.close();

        expect(mockListener.onClose).toHaveBeenCalledTimes(1);
    });

    test('removeListener prevents further events', () => {
        client.addListener(mockListener);
        client.open({ path: '/test' });
        expect(mockListener.onOpen).toHaveBeenCalledTimes(1);

        client.removeListener(mockListener);
        client.open({ path: '/test2' });
        expect(mockListener.onOpen).toHaveBeenCalledTimes(1);
    });

    test('multiple listeners receive events in order', () => {
        const calls: string[] = [];
        const listener1 = {
            ...mockListener,
            onOpen: jest.fn(() => calls.push('listener1'))
        };
        const listener2 = {
            ...mockListener,
            onOpen: jest.fn(() => calls.push('listener2'))
        };

        client.addListener(listener1);
        client.addListener(listener2);
        client.open({ path: '/test' });

        expect(calls).toEqual(['listener1', 'listener2']);
    });

    test('chaining methods works correctly', () => {
        const result = client
            .addListener(mockListener)
            .open({ path: '/test' })
            .close()
            .removeListener(mockListener);

        expect(result).toBe(client);
        expect(client.addListener).toHaveBeenCalled();
        expect(client.open).toHaveBeenCalled();
        expect(client.close).toHaveBeenCalled();
        expect(client.removeListener).toHaveBeenCalled();
    });
});
