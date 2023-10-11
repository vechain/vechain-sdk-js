import { ERRORS, RLP, type RLPValidObject, type RLPProfile } from '../../src';

/* Simple RLP encode */
const encodeTestCases = [
    {
        input: [1, 2, 3, [4, 5]],
        expected: 'c6010203c20405',
        description: 'array with multiple and nested items'
    },
    { input: 42, expected: '2a', description: 'single value' },
    { input: [], expected: 'c0', description: 'empty array' }
];

/* Simple RLP decode */
const decodeTestCases = [
    {
        input: '2a',
        expected: Buffer.from([42]),
        description: 'single value'
    },
    { input: 'c0', expected: [], description: 'empty array' }
];

/* NumericKind encode */
const numericKindEncodeTestCases = [
    {
        kind: new RLP.NumericKind(8),
        data: '0x0',
        expected: '',
        description: 'zero hex string'
    },
    {
        kind: new RLP.NumericKind(8),
        data: '0x123',
        expected: '0123',
        description: 'hex string'
    },
    {
        kind: new RLP.NumericKind(8),
        data: '0',
        expected: '',
        description: 'zero number string'
    },
    {
        kind: new RLP.NumericKind(8),
        data: '100',
        expected: '64',
        description: 'number string'
    },
    {
        kind: new RLP.NumericKind(8),
        data: 0,
        expected: '',
        description: 'zero number'
    },
    {
        kind: new RLP.NumericKind(8),
        data: 0x123,
        expected: '0123',
        description: 'number in hex format'
    },
    {
        kind: new RLP.NumericKind(8),
        data: 12524,
        expected: '30ec',
        description: 'number non hex format'
    },
    {
        kind: new RLP.NumericKind(1),
        data: '5',
        expected: '05',
        description: 'number in hex format'
    },
    {
        kind: new RLP.NumericKind(1),
        data: 255,
        expected: 'ff',
        description: 'number non hex format'
    }
];

const invalidNumericKindEncodeTestCases = [
    {
        kind: new RLP.NumericKind(8),
        data: '0x123z',
        description: 'invalid hex string',
        throws: ERRORS.RLP.INVALID_RLP(
            '',
            'expected non-negative integer in hex or dec string'
        )
    },
    {
        kind: new RLP.NumericKind(8),
        data: {},
        description: 'invalid object',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected string or number')
    },
    {
        kind: new RLP.NumericKind(8),
        data: '0x',
        description: 'invalid hex string',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected valid hex string number')
    },
    {
        kind: new RLP.NumericKind(8),
        data: -1,
        description: 'negative number',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected non-negative safe integer')
    },
    {
        kind: new RLP.NumericKind(8),
        data: '0x12345678123456780',
        description: 'number overflow',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected number in 8 bytes')
    },
    {
        kind: new RLP.NumericKind(8),
        data: 2 ** 64,
        description: 'number overflow',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected non-negative safe integer')
    },
    {
        kind: new RLP.NumericKind(1),
        data: 256,
        description: 'number overflow',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected number in 1 bytes')
    }
];

/* Numeric kind decode tests */
const numericKindDecodeTestCases = [
    {
        kind: new RLP.NumericKind(8),
        data: Buffer.alloc(0),
        description: 'empty buffer',
        expected: 0
    },
    {
        kind: new RLP.NumericKind(8),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: 0x010203
    },
    {
        kind: new RLP.NumericKind(8),
        data: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]),
        description: 'buffer with data',
        expected: '0x102030405060708'
    },
    {
        kind: new RLP.NumericKind(1),
        data: Buffer.from('ff', 'hex'),
        description: 'buffer with data',
        expected: 255
    }
];

const invalidBufferKindDecodeTestCases = [
    {
        kind: new RLP.BufferKind(),
        data: 42,
        description: 'invalid data',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected buffer')
    }
];

const invalidNumericKindDecodeTestCases = [
    {
        kind: new RLP.NumericKind(8),
        data: Buffer.alloc(9, 1),
        description: 'buffer exceeds max bytes',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected less than 8 bytes')
    },
    {
        kind: new RLP.NumericKind(8),
        data: Buffer.from([0, 1]),
        description: 'buffer with leading zero',
        throws: ERRORS.RLP.INVALID_RLP(
            '',
            'expected canonical integer (no leading zero bytes)'
        )
    }
];

/* ------ RLP Profile Objects & Data ------- */
const [bufferProfile, bufferData, invalidBufferData]: [
    RLPProfile,
    RLPValidObject,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.BufferKind() },
            { name: 'bar', kind: new RLP.BufferKind() }
        ]
    },
    {
        foo: Buffer.from([1, 2, 3]),
        bar: Buffer.from([4, 5, 6])
    },
    {
        foo: Buffer.from([1, 2, 3]),
        bar: 42
    }
];

const [numericProfile, numericData]: [RLPProfile, RLPValidObject] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.NumericKind() },
            { name: 'bar', kind: new RLP.NumericKind() },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new RLP.NumericKind() },
                        { name: 'y', kind: new RLP.NumericKind() },
                        {
                            name: 'z',
                            kind: {
                                item: [
                                    {
                                        name: 'a',
                                        kind: new RLP.NumericKind()
                                    },
                                    {
                                        name: 'b',
                                        kind: new RLP.NumericKind()
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    },
    {
        foo: 1,
        bar: 2,
        baz: [
            {
                x: 3,
                y: 4,
                z: [
                    {
                        a: 7,
                        b: 8
                    }
                ]
            },
            {
                x: 5,
                y: 6,
                z: [
                    {
                        a: 0,
                        b: 10
                    }
                ]
            }
        ]
    }
];

const [
    numericProfileWithMaxBytes,
    numericDataWithMaxBytes,
    numericDataWithString,
    numericDataInvalidArray,
    numericDataWithByteOverflow
]: [
    RLPProfile,
    RLPValidObject,
    RLPValidObject,
    RLPValidObject,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.NumericKind(1) },
            { name: 'bar', kind: new RLP.NumericKind() },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new RLP.NumericKind() },
                        { name: 'y', kind: new RLP.NumericKind() }
                    ]
                }
            }
        ]
    },
    {
        foo: 1,
        bar: 2,
        baz: [
            { x: 3, y: 4 },
            { x: 5, y: 6 }
        ]
    },
    {
        foo: 1,
        bar: 2,
        baz: [
            { x: 3, y: '4' },
            { x: 5, y: 6 }
        ]
    },
    {
        foo: 1,
        bar: 2,
        baz: 3
    },
    {
        foo: 256,
        bar: 2,
        baz: [
            { x: 1, y: 4 },
            { x: 5, y: 6 }
        ]
    }
];

/* ------ RLP Profile Encode Tests ------- */
const encodeNumericProfileTestCases = [
    {
        profile: numericProfile,
        data: numericData,
        expected: 'd10102cec60304c3c20708c60506c3c2800a',
        description: 'encode numeric profile'
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataWithMaxBytes,
        expected: 'c90102c6c20304c20506',
        description: 'encode numeric profile with max bytes'
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataWithString,
        expected: 'c90102c6c20304c20506',
        description: 'encode numeric profile with string'
    }
];

const encodeBufferProfileTestCases = [
    {
        profile: bufferProfile,
        data: bufferData,
        expected: 'c88301020383040506',
        description: 'encode buffer profile'
    }
];

const invalidEncodeObjectTestCases = [
    {
        profile: bufferProfile,
        data: invalidBufferData,
        description: 'encode buffer profile with invalid data',
        throws: new Error('bar: expected buffer')
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataInvalidArray,
        description: 'encode numeric profile with invalid array',
        throws: new Error('baz: expected array')
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataWithByteOverflow,
        description: 'encode numeric profile with byte overflow',
        throws: new Error('foo: expected number in 1 bytes')
    }
];

/* ------ RLP Profile Decode Tests ------- */
const decodeBufferProfileTestCases = [
    {
        profile: bufferProfile,
        data: Buffer.from('c88301020383040506', 'hex'),
        expected: bufferData,
        description: 'decode buffer profile'
    }
];

const invalidDecodeObjectTestCases = [
    {
        profile: numericProfile,
        data: Buffer.from('c60102c3c20304', 'hex'),
        description: 'decode buffer profile with invalid data',
        throws: new Error('baz.#0: expected 3 items, but got 2')
    },
    {
        profile: numericProfile,
        data: Buffer.from('c3010202', 'hex'),
        description: 'decode buffer profile with invalid data',
        throws: new Error('baz: expected array')
    },
    {
        profile: numericProfile,
        data: Buffer.from('d1c7c60304c3c2070802c7c60304c3c20708', 'hex'),
        description: 'decode buffer profile with invalid data',
        throws: new Error('foo: expected buffer')
    }
];

const decodeNumericProfileTestCases = [
    {
        profile: numericProfileWithMaxBytes,
        data: Buffer.from('c90102c6c20304c20506', 'hex'),
        expected: numericDataWithMaxBytes,
        description: 'decode numeric profile'
    },
    {
        profile: numericProfile,
        data: Buffer.from('d10102cec60304c3c20708c60506c3c2800a', 'hex'),
        expected: numericData,
        description: 'decode numeric profile'
    }
];

export {
    encodeTestCases,
    decodeTestCases,
    numericKindEncodeTestCases,
    numericKindDecodeTestCases,
    invalidNumericKindEncodeTestCases,
    invalidNumericKindDecodeTestCases,
    invalidBufferKindDecodeTestCases,
    bufferProfile,
    bufferData,
    invalidBufferData,
    numericProfile,
    numericData,
    numericProfileWithMaxBytes,
    numericDataWithMaxBytes,
    numericDataWithString,
    numericDataInvalidArray,
    numericDataWithByteOverflow,
    encodeNumericProfileTestCases,
    encodeBufferProfileTestCases,
    invalidEncodeObjectTestCases,
    decodeBufferProfileTestCases,
    invalidDecodeObjectTestCases,
    decodeNumericProfileTestCases
};
