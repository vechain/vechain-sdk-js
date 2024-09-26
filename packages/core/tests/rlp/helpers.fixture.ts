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
        context: 'testContext'
    },
    {
        number: -1,
        context: 'testContext'
    },
    {
        number: Number.MAX_SAFE_INTEGER + 1,
        context: 'testContext'
    },
    {
        number: 'zgy',
        context: 'testContext'
    },
    {
        number: '0x',
        context: 'testContext'
    },
    {
        number: '-123',
        context: 'testContext'
    }
];

const validNumericBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2, 3]),
        context: 'testContext',
        maxBytes: undefined
    },
    {
        buffer: Uint8Array.from([1, 2, 3]),
        context: 'testContext',
        maxBytes: 3
    },
    {
        buffer: Uint8Array.from([]),
        context: 'testContext',
        maxBytes: undefined
    },
    {
        buffer: Uint8Array.from([]),
        context: 'testContext',
        maxBytes: 2
    }
];

const invalidNumericBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2, 3, 4]),
        context: 'testContext',
        maxBytes: 3
    },
    {
        buffer: Uint8Array.from([0, 2, 3]),
        context: 'testContext',
        maxBytes: undefined
    },
    {
        buffer: Uint8Array.from([0]),
        context: 'testContext',
        maxBytes: 1
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
        buffer: Uint8Array.from([1, 2, 3]),
        context: 'testContext'
    },
    {
        buffer: Uint8Array.from([]),
        context: 'testContext'
    }
];

const invalidHexBlobKindBufferTestCases = [
    {
        buffer: '0x123',
        context: 'testContext'
    },
    {
        buffer: {},
        context: 'testContext'
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
        bytes: 1
    }
];

const validFixedHexBlobKindBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2]),
        context: 'testContext',
        bytes: 2
    },
    {
        buffer: Uint8Array.from([]),
        context: 'testContext',
        bytes: 0
    }
];

const invalidFixedHexBlobKindBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2]),
        context: 'testContext',
        bytes: 1
    }
];

const validCompactFixedHexBlobKindBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2, 3]),
        context: 'testContext',
        bytes: 5
    },
    {
        buffer: Uint8Array.from([1, 2]),
        context: 'testContext',
        bytes: 2
    },
    {
        buffer: Uint8Array.from([]),
        context: 'testContext',
        bytes: 0
    }
];

const invalidCompactFixedHexBlobKindBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2, 3]),
        context: 'testContext',
        bytes: 2
    },
    {
        buffer: Uint8Array.from([0, 2, 3]),
        context: 'testContext',
        bytes: 3
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
