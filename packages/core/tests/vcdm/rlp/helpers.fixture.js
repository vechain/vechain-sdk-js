"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidCompactFixedHexBlobKindBufferTestCases = exports.validCompactFixedHexBlobKindBufferTestCases = exports.invalidFixedHexBlobKindBufferTestCases = exports.validFixedHexBlobKindBufferTestCases = exports.invalidFixedHexBlobKindDataTestCases = exports.validFixedHexBlobKindDataTestCases = exports.invalidHexBlobKindBufferTestCases = exports.validHexBlobKindBufferTestCases = exports.invalidHexBlobKindDataTestCases = exports.validHexBlobKindDataTestCases = exports.invalidNumericBufferTestCases = exports.validNumericBufferTestCases = exports.invalidNumberTestCases = exports.validateNumberTestCases = void 0;
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
exports.validateNumberTestCases = validateNumberTestCases;
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
exports.invalidNumberTestCases = invalidNumberTestCases;
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
exports.validNumericBufferTestCases = validNumericBufferTestCases;
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
exports.invalidNumericBufferTestCases = invalidNumericBufferTestCases;
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
exports.validHexBlobKindDataTestCases = validHexBlobKindDataTestCases;
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
exports.invalidHexBlobKindDataTestCases = invalidHexBlobKindDataTestCases;
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
exports.validHexBlobKindBufferTestCases = validHexBlobKindBufferTestCases;
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
exports.invalidHexBlobKindBufferTestCases = invalidHexBlobKindBufferTestCases;
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
exports.validFixedHexBlobKindDataTestCases = validFixedHexBlobKindDataTestCases;
const invalidFixedHexBlobKindDataTestCases = [
    {
        data: '0x1234567890',
        context: 'testContext',
        bytes: 1
    }
];
exports.invalidFixedHexBlobKindDataTestCases = invalidFixedHexBlobKindDataTestCases;
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
exports.validFixedHexBlobKindBufferTestCases = validFixedHexBlobKindBufferTestCases;
const invalidFixedHexBlobKindBufferTestCases = [
    {
        buffer: Uint8Array.from([1, 2]),
        context: 'testContext',
        bytes: 1
    }
];
exports.invalidFixedHexBlobKindBufferTestCases = invalidFixedHexBlobKindBufferTestCases;
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
exports.validCompactFixedHexBlobKindBufferTestCases = validCompactFixedHexBlobKindBufferTestCases;
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
exports.invalidCompactFixedHexBlobKindBufferTestCases = invalidCompactFixedHexBlobKindBufferTestCases;
