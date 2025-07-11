import { jest } from '@jest/globals';

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

export { mockWebSocketInstance, mockWebSocketConstructor };
