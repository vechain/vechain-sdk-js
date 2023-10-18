const validateNumberTestCases = [
    {
        number: 123,
        context: 'testContext',
        expected: 123n
    },
    {
        number: '123',
        context: 'testContext',
        expected: 123n
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

const validHexBlobKindDataTestCases = [
    {
        data: '0x1233',
        context: 'testContext'
    },
    {
        data: '0x1234567890',
        context: 'testContext'
    }
];

const invalidHexBlobKindDataTestCases = [
    {
        data: '123',
        context: 'testContext',
        expected: 'expected hex string'
    },
    {
        data: '0x1234567890z',
        context: 'testContext',
        expected: 'expected hex string'
    },
    {
        data: '0x123',
        context: 'testContext',
        expected: 'expected even length string'
    },
    {
        data: 123,
        context: 'testContext',
        expected: 'expected string'
    }
];

const validHexBlobKindBufferTestCases = [
    {
        buffer: Buffer.from([1, 2, 3]),
        context: 'testContext'
    },
    {
        buffer: Buffer.from([]),
        context: 'testContext'
    }
];

const invalidHexBlobKindBufferTestCases = [
    {
        buffer: '0x123',
        context: 'testContext',
        expected: 'expected buffer'
    },
    {
        buffer: {},
        context: 'testContext',
        expected: 'expected buffer'
    }
];

const validFixedHexBlobKindDataTestCases = [
    {
        data: '0x1233',
        context: 'testContext',
        bytes: 2
    },
    {
        data: '0x1234567890',
        context: 'testContext',
        bytes: 5
    }
];

const invalidFixedHexBlobKindDataTestCases = [
    {
        data: '0x1234567890',
        context: 'testContext',
        bytes: 1,
        expected: 'expected hex string to be 1 bytes'
    }
];

const validFixedHexBlobKindBufferTestCases = [
    {
        buffer: Buffer.from([1, 2]),
        context: 'testContext',
        bytes: 2
    },
    {
        buffer: Buffer.from([]),
        context: 'testContext',
        bytes: 0
    }
];

const invalidFixedHexBlobKindBufferTestCases = [
    {
        buffer: Buffer.from([1, 2]),
        context: 'testContext',
        bytes: 1,
        expected: 'expected buffer to be 1 bytes'
    }
];

const validCompactFixedHexBlobKindBufferTestCases = [
    {
        buffer: Buffer.from([1, 2, 3]),
        context: 'testContext',
        bytes: 5
    },
    {
        buffer: Buffer.from([1, 2]),
        context: 'testContext',
        bytes: 2
    },
    {
        buffer: Buffer.from([]),
        context: 'testContext',
        bytes: 0
    }
];

const invalidCompactFixedHexBlobKindBufferTestCases = [
    {
        buffer: Buffer.from([1, 2, 3]),
        context: 'testContext',
        bytes: 2,
        expected: 'expected buffer to be at most 2 bytes'
    },
    {
        buffer: Buffer.from([0, 2, 3]),
        context: 'testContext',
        bytes: 3,
        expected: 'expected no leading zero bytes'
    }
];

export {
    validateNumberTestCases,
    invalidNumberTestCases,
    validNumericBufferTestCases,
    invalidNumericBufferTestCases,
    validHexBlobKindDataTestCases,
    invalidHexBlobKindDataTestCases,
    validHexBlobKindBufferTestCases,
    invalidHexBlobKindBufferTestCases,
    validFixedHexBlobKindDataTestCases,
    invalidFixedHexBlobKindDataTestCases,
    validFixedHexBlobKindBufferTestCases,
    invalidFixedHexBlobKindBufferTestCases,
    validCompactFixedHexBlobKindBufferTestCases,
    invalidCompactFixedHexBlobKindBufferTestCases
};
