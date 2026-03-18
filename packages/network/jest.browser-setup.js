/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '../../customEnv.js',
  setupFiles: ['./jest.browser-setup.js'],
  coverageReporters: ['html', 'lcov', 'json'],
  runner: 'groups',
  reporters: ['default', 'jest-junit'],
  workerThreads: true
};


require('whatwg-fetch');

const fetchMock = require('jest-fetch-mock');

// Don't auto-enable mocks
fetchMock.dontMock();

// Jest configuration for WebSocket mocking based on environment
if (typeof window === 'undefined') {
// Running in Node.js environment
jest.mock('ws', () => require('ws'));
if (!global.fetch) {
  global.fetch = require('node-fetch');
}
} else {
// Running in browser (jsdom) environment
global.WebSocket = window.WebSocket;
// Use node-fetch for reliable HTTP requests in jsdom + worker thread context.
// Native Node.js fetch (undici) can fail in jsdom environments on older Node
// versions (e.g. Node 20) due to incompatible globals (Headers, AbortSignal).
global.fetch = require('node-fetch');
}