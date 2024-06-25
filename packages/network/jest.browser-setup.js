// Jest configuration for WebSocket mocking based on environment
if (typeof window === 'undefined') {
  // Running in Node.js environment
  jest.mock('ws', () => require('ws'));
} else {
  // Running in browser environment
  global.WebSocket = window.WebSocket;
}
