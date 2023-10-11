import BigNumber from 'bignumber.js';

const validateNumberTestCases = [
    {
        number: 123,
        context: 'testContext',
        expected: new BigNumber(123)
    },
    {
        number: '123',
        context: 'testContext',
        expected: new BigNumber('123')
    }
];

const invalidNumberTestCases = [
    {
        number: {},
        context: 'testContext',
        expected: 'expected string or number'
    },
    {
        number: -1,
        context: 'testContext',
        expected: 'expected non-negative safe integer'
    },
    {
        number: Number.MAX_SAFE_INTEGER + 1,
        context: 'testContext',
        expected: 'expected non-negative safe integer'
    },
    {
        number: 'zgy',
        context: 'testContext',
        expected: 'expected non-negative integer in hex or dec string'
    },
    {
        number: '0x',
        context: 'testContext',
        expected: 'expected valid hex string number'
    },
    {
        number: '-123',
        context: 'testContext',
        expected: 'expected non-negative integer in hex or dec string'
    }
];

const validNumericBufferTestCases = [
    {
        buffer: Buffer.from([1, 2, 3]),
        context: 'testContext',
        maxBytes: undefined
    },
    {
        buffer: Buffer.from([1, 2, 3]),
        context: 'testContext',
        maxBytes: 3
    },
    {
        buffer: Buffer.from([]),
        context: 'testContext',
        maxBytes: undefined
    },
    {
        buffer: Buffer.from([]),
        context: 'testContext',
        maxBytes: 2
    }
];

const invalidNumericBufferTestCases = [
    {
        buffer: Buffer.from([1, 2, 3, 4]),
        context: 'testContext',
        maxBytes: 3,
        expected: 'expected less than 3 bytes'
    },
    {
        buffer: Buffer.from([0, 2, 3]),
        context: 'testContext',
        maxBytes: undefined,
        expected: 'expected canonical integer (no leading zero bytes)'
    },
    {
        buffer: Buffer.from([0]),
        context: 'testContext',
        maxBytes: 1,
        expected: 'expected canonical integer (no leading zero bytes)'
    }
];

export {
    validateNumberTestCases,
    invalidNumberTestCases,
    validNumericBufferTestCases,
    invalidNumericBufferTestCases
};
