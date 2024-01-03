import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';

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
        url: 'http://testnet.vechain.org:8669/',
        expected: 'ws://testnet.vechain.org:8669'
    }
];

/**
 * invalid sanitizeWebsocketBaseURL test cases fixture
 */
const invalidSanitizeWebsocketBaseURLTestCases = [
    {
        url: 'www.test',
        expectedError: InvalidDataTypeError
    },
    {
        url: 'http://www..test.com',
        expectedError: InvalidDataTypeError
    },
    {
        url: 'https://www.test..com',
        expectedError: InvalidDataTypeError
    },
    {
        url: 'localhost:8669',
        expectedError: InvalidDataTypeError
    }
];

export {
    toQueryStringTestCases,
    sanitizeWebsocketBaseURLTestCases,
    invalidSanitizeWebsocketBaseURLTestCases
};
