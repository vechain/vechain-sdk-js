"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidSanitizeWebsocketBaseURLTestCases = exports.sanitizeWebsocketBaseURLTestCases = exports.toQueryStringTestCases = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * toQueryString test cases fixture
 */
const toQueryStringTestCases = [
    {
        records: {
            a: 1,
            b: 2,
            c: 3
        },
        expected: '?a=1&b=2&c=3'
    },
    {
        records: {
            a: 1,
            b: 2,
            c: 3,
            d: undefined
        },
        expected: '?a=1&b=2&c=3'
    },
    {
        records: {
            a: undefined,
            b: 2,
            c: 3,
            d: undefined
        },
        expected: '?b=2&c=3'
    },
    {
        records: {},
        expected: ''
    }
];
exports.toQueryStringTestCases = toQueryStringTestCases;
/**
 * sanitizeWebsocketBaseURL test cases fixture
 */
const sanitizeWebsocketBaseURLTestCases = [
    {
        url: 'http://localhost:8669',
        expected: 'ws://localhost:8669'
    },
    {
        url: 'https://localhost:8669',
        expected: 'wss://localhost:8669'
    },
    {
        url: 'https://localhost:8669/',
        expected: 'wss://localhost:8669'
    },
    {
        url: 'https://mainnet.vechain.org/',
        expected: 'wss://mainnet.vechain.org'
    },
    {
        url: 'https://testnet.vechain.org:8669/',
        expected: 'wss://testnet.vechain.org:8669'
    }
];
exports.sanitizeWebsocketBaseURLTestCases = sanitizeWebsocketBaseURLTestCases;
/**
 * invalid sanitizeWebsocketBaseURL test cases fixture
 */
const invalidSanitizeWebsocketBaseURLTestCases = [
    {
        url: 'www.test',
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        url: 'http://www..test.com',
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        url: 'https://www.test..com',
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        url: 'localhost:8669',
        expectedError: sdk_errors_1.InvalidDataType
    }
];
exports.invalidSanitizeWebsocketBaseURLTestCases = invalidSanitizeWebsocketBaseURLTestCases;
