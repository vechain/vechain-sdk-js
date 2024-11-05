import { InvalidDataType } from '@vechain/sdk-errors';

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
        expected: 'ws://testnet.vechain.org:8669'
    }
];

/**
 * invalid sanitizeWebsocketBaseURL test cases fixture
 */
const invalidSanitizeWebsocketBaseURLTestCases = [
    {
        url: 'www.test',
        expectedError: InvalidDataType
    },
    {
        url: 'http://www..test.com',
        expectedError: InvalidDataType
    },
    {
        url: 'https://www.test..com',
        expectedError: InvalidDataType
    },
    {
        url: 'localhost:8669',
        expectedError: InvalidDataType
    }
];

export {
    toQueryStringTestCases,
    sanitizeWebsocketBaseURLTestCases,
    invalidSanitizeWebsocketBaseURLTestCases
};
