// Jest configuration for mocking isomorphic-ws based on environment
if (typeof window === 'undefined') {
  // Running in Node.js environment
  jest.mock('isomorphic-ws', () => require('ws'));
} else {
  // Running in browser environment
  global.WebSocket = window.WebSocket;
  jest.mock('isomorphic-ws', () => window.WebSocket);
}