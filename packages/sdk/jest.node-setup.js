// Jest setup for Node.js environment
require('whatwg-fetch');
const fetchMock = require('jest-fetch-mock');
const WebSocket = require('ws');
const { LoggerRegistry, PrettyLogger } = require('@common/logging');

// Don't auto-enable fetch mocks
fetchMock.dontMock();

// Polyfill WebSocket for Node.js environment
if (typeof global !== 'undefined' && typeof global.WebSocket === 'undefined') {
    global.WebSocket = WebSocket;
}

// Make fetch global
global.fetch = fetch;

// Add common test utilities that are missing in Node.js
if (typeof global.Event === 'undefined') {
    global.Event = class Event {
        constructor(type, eventInitDict = {}) {
            this.type = type;
            this.bubbles = eventInitDict.bubbles || false;
            this.cancelable = eventInitDict.cancelable || false;
            this.defaultPrevented = false;
        }
    };
}

if (typeof global.MessageEvent === 'undefined') {
    global.MessageEvent = class MessageEvent extends Event {
        constructor(type, eventInitDict = {}) {
            super(type, eventInitDict);
            this.data = eventInitDict.data;
            this.origin = eventInitDict.origin || '';
            this.lastEventId = eventInitDict.lastEventId || '';
            this.source = eventInitDict.source || null;
            this.ports = eventInitDict.ports || [];
        }
    };
}

if (typeof global.CloseEvent === 'undefined') {
    global.CloseEvent = class CloseEvent extends Event {
        constructor(type, eventInitDict = {}) {
            super(type, eventInitDict);
            this.code = eventInitDict.code || 0;
            this.reason = eventInitDict.reason || '';
            this.wasClean = eventInitDict.wasClean || false;
        }
    };
} 

// Setup the logger to use for tests
beforeAll(() => {
    LoggerRegistry.getInstance().registerLogger(new PrettyLogger());
});

// Clear and reset the logger after each test
// This is to avoid the logger being polluted by other tests
afterEach(() => {
    LoggerRegistry.getInstance().clearRegisteredLogger();
    LoggerRegistry.getInstance().registerLogger(new PrettyLogger());
});