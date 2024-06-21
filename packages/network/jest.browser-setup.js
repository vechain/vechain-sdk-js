global.WebSocket = window.WebSocket;

// Mock isomorphic-ws to use the native WebSocket in the browser environment
jest.mock('isomorphic-ws', () => {
    return window.WebSocket;
  });