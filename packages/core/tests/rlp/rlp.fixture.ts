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

/* Hex Blob Kind encode tests */
const hexBlobKindEncodeTestCases = [
    {
        kind: new RLP.HexBlobKind(),
        data: '0x010203',
        expected: '010203',
        description: 'hex string'
    }
];

const invalidHexBlobKindEncodeTestCases = [
    {
        kind: new RLP.HexBlobKind(),
        data: '0x123z',
        description: 'invalid hex string',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected hex string')
    },
    {
        kind: new RLP.HexBlobKind(),
        data: {},
        description: 'invalid object',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected string')
    },
    {
        kind: new RLP.HexBlobKind(),
        data: '0x123',
        description: 'invalid hex string',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected even length string')
    }
];

/* Fixed Hex Blob Kind encode tests */
const fixedHexBlobKindEncodeTestCases = [
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: '0x01',
        expected: '01',
        description: 'hex string'
    }
];

const invalidFixedHexBlobEncodeTestCases = [
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: '0x123z',
        description: 'invalid hex string',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected hex string')
    },
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: {},
        description: 'invalid data type',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected string')
    },
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: '0x123',
        description: 'invalid hex string',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected even length string')
    },
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: '0x012345',
        description: 'overflow hex string',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected hex string to be 1 bytes')
    }
];

/* Hex Blob Kind decode tests */
const hexBlobKindDecodeTestCases = [
    {
        kind: new RLP.HexBlobKind(),
        data: Buffer.alloc(0),
        description: 'empty buffer',
        expected: '0x'
    },
    {
        kind: new RLP.HexBlobKind(),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x010203'
    },
    {
        kind: new RLP.HexBlobKind(),
        data: Buffer.from([1, 2, 3, 4, 5]),
        description: 'buffer with data',
        expected: '0x0102030405'
    }
];

const invalidHexBlobKindDecodeTestCases = [
    {
        kind: new RLP.HexBlobKind(),
        data: 42,
        description: 'invalid data',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected buffer')
    }
];

/* Fixed Hex Blob Kind decode tests */
const fixedHexBlobKindDecodeTestCases = [
    {
        kind: new RLP.FixedHexBlobKind(3),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x010203'
    },
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: Buffer.from([1]),
        description: 'buffer with data',
        expected: '0x01'
    }
];

const invalidFixedBlobKindDecodeTestCases = [
    {
        kind: new RLP.FixedHexBlobKind(3),
        data: Buffer.from([1, 2]),
        description: 'buffer with data',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected buffer to be 3 bytes')
    },
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: Buffer.from([1, 2]),
        description: 'buffer with data',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected buffer to be 1 bytes')
    },
    {
        kind: new RLP.FixedHexBlobKind(1),
        data: '0x123',
        description: 'invalid data buffer',
        throws: ERRORS.RLP.INVALID_RLP('', 'expected buffer')
    }
];

const compactFixedHexBlobKindEncodeTestCases = [
    {
        kind: new RLP.CompactFixedHexBlobKind(4),
        data: '0x00112233',
        description: 'buffer with data',
        expected: '112233'
    },
    {
        kind: new RLP.CompactFixedHexBlobKind(1),
        data: '0x00',
        description: 'buffer with data',
        expected: ''
    }
];

const compactFixedHexBlobKindDecodeTestCases = [
    {
        kind: new RLP.CompactFixedHexBlobKind(4),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x00010203'
    },
    {
        kind: new RLP.CompactFixedHexBlobKind(1),
        data: Buffer.from([1]),
        description: 'buffer with data',
        expected: '0x01'
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

const [hexBlobProfile, hexBlobData, hexBlobDataWithInvalidHex]: [
    RLPProfile,
    RLPValidObject,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.HexBlobKind() },
            { name: 'bar', kind: new RLP.HexBlobKind() }
        ]
    },
    {
        foo: '0x010203',
        bar: '0x040506'
    },
    {
        foo: '0x010203',
        bar: '0x0405z6'
    }
];

const [fixedHexBlobProfile, fixedHexBlobData]: [RLPProfile, RLPValidObject] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.FixedHexBlobKind(1) },
            { name: 'bar', kind: new RLP.FixedHexBlobKind(3) }
        ]
    },
    {
        foo: '0x01',
        bar: '0x010203'
    }
];

const [
    optionalFixedHexBlobProfile,
    optionalFixedHexBlobData,
    optionalFixedHexBlobDataNull,
    optionalFixedHexBlobDataMixed,
    optionalFixedHexBlobDataMixed2,
    optionalFixedHexBlobDataMixed3
]: [
    RLPProfile,
    RLPValidObject,
    RLPValidObject,
    RLPValidObject,
    RLPValidObject,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.OptionalFixedHexBlobKind(1) },
            { name: 'bar', kind: new RLP.OptionalFixedHexBlobKind(3) }
        ]
    },
    {
        foo: '0x01',
        bar: '0x010203'
    },
    {
        foo: null,
        bar: null
    },
    {
        foo: '0x01',
        bar: null
    },
    {
        foo: null,
        bar: '0x010203'
    },
    {
        foo: null,
        bar: undefined
    }
];

const [compactFixedHexBlobProfile, compactFixedHexBlobData]: [
    RLPProfile,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.CompactFixedHexBlobKind(1) },
            { name: 'bar', kind: new RLP.CompactFixedHexBlobKind(3) }
        ]
    },
    {
        foo: '0x01',
        bar: '0x010203'
    }
];

const [mixedKindProfile1, mixedKindData1]: [RLPProfile, RLPValidObject] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP.NumericKind() },
            { name: 'bar', kind: new RLP.FixedHexBlobKind(4) },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new RLP.HexBlobKind() },
                        { name: 'y', kind: new RLP.NumericKind() }
                    ]
                }
            }
        ]
    },
    {
        foo: 123,
        bar: '0x12345678',
        baz: [
            { x: '0x11', y: 1234 },
            { x: '0x12', y: 5678 }
        ]
    }
];

const [mixedKindProfile2, mixedKindData2]: [RLPProfile, RLPValidObject] = [
    {
        name: 'tx',
        kind: [
            { name: 'chainTag', kind: new RLP.NumericKind(1) },
            { name: 'blockRef', kind: new RLP.CompactFixedHexBlobKind(8) },
            { name: 'expiration', kind: new RLP.NumericKind(4) },
            {
                name: 'clauses',
                kind: {
                    item: [
                        {
                            name: 'to',
                            kind: new RLP.OptionalFixedHexBlobKind(20)
                        },
                        { name: 'value', kind: new RLP.NumericKind(32) },
                        { name: 'data', kind: new RLP.HexBlobKind() }
                    ]
                }
            },
            { name: 'gasPriceCoef', kind: new RLP.NumericKind(1) },
            { name: 'gas', kind: new RLP.NumericKind(8) },
            { name: 'dependsOn', kind: new RLP.OptionalFixedHexBlobKind(32) },
            { name: 'nonce', kind: new RLP.NumericKind(8) }
        ]
    },
    {
        chainTag: 1,
        blockRef: '0x00000000aabbccdd',
        expiration: 32,
        clauses: [
            {
                to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                value: 10000,
                data: '0x000000606060'
            },
            {
                to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                value: 20000,
                data: '0x000000606060'
            }
        ],
        gasPriceCoef: 128,
        gas: 21000,
        dependsOn: null,
        nonce: 12345678
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

const encodeHexBlobProfileTestCases = [
    {
        profile: hexBlobProfile,
        data: hexBlobData,
        expected: 'c88301020383040506',
        description: 'encode hex blob profile'
    }
];

const encodeFixedHexBlobProfileTestCases = [
    {
        profile: fixedHexBlobProfile,
        data: fixedHexBlobData,
        expected: 'c50183010203',
        description: 'encode fixed hex blob profile'
    }
];

const encodeOptionalFixedHexBlobProfileTestCases = [
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobData,
        expected: 'c50183010203',
        description: 'encode nullable fixed hex blob profile'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataNull,
        expected: 'c28080',
        description: 'encode nullable fixed hex blob profile with null'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataMixed,
        expected: 'c20180',
        description: 'encode nullable fixed hex blob profile with mixed data'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataMixed2,
        expected: 'c58083010203',
        description: 'encode nullable fixed hex blob profile with mixed data 2'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataMixed3,
        expected: 'c28080',
        description: 'encode nullable fixed hex blob profile with mixed data 3'
    }
];

const encodeCompactFixedHexBlobProfileTestCases = [
    {
        profile: compactFixedHexBlobProfile,
        data: compactFixedHexBlobData,
        expected: 'c50183010203',
        description: 'encode compact fixed hex blob profile'
    }
];

const encodeMixedKindProfileTestCases = [
    {
        profile: mixedKindProfile1,
        data: mixedKindData1,
        expected: 'd17b8412345678cac4118204d2c41282162e',
        description: 'encode mixed kind profile'
    },
    {
        profile: mixedKindProfile2,
        data: mixedKindData2,
        expected:
            'f8530184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614e',
        description: 'encode mixed kind profile with transaction like data'
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
    },
    {
        profile: hexBlobProfile,
        data: hexBlobDataWithInvalidHex,
        description: 'encode hex blob profile with invalid hex',
        throws: new Error('bar: expected hex string')
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

const decodeHexBlobProfileTestCases = [
    {
        profile: hexBlobProfile,
        data: Buffer.from('c88301020383040506', 'hex'),
        expected: hexBlobData,
        description: 'decode hex blob profile'
    }
];

const decodeCompactFixedHexBlobProfileTestCases = [
    {
        profile: compactFixedHexBlobProfile,
        data: Buffer.from('c50183010203', 'hex'),
        expected: compactFixedHexBlobData,
        description: 'decode compact fixed hex blob profile'
    }
];

const decodeMixedKindProfileTestCases = [
    {
        profile: mixedKindProfile1,
        data: Buffer.from('d17b8412345678cac4118204d2c41282162e', 'hex'),
        expected: mixedKindData1,
        description: 'decode mixed kind profile'
    },
    {
        profile: mixedKindProfile2,
        data: Buffer.from(
            'f8530184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614e',
            'hex'
        ),
        expected: mixedKindData2,
        description: 'decode mixed kind profile with transaction like data'
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
    hexBlobKindEncodeTestCases,
    decodeNumericProfileTestCases,
    decodeHexBlobProfileTestCases,
    hexBlobProfile,
    hexBlobData,
    encodeHexBlobProfileTestCases,
    invalidHexBlobKindEncodeTestCases,
    hexBlobKindDecodeTestCases,
    invalidHexBlobKindDecodeTestCases,
    fixedHexBlobProfile,
    fixedHexBlobData,
    encodeFixedHexBlobProfileTestCases,
    fixedHexBlobKindEncodeTestCases,
    invalidFixedHexBlobEncodeTestCases,
    fixedHexBlobKindDecodeTestCases,
    invalidFixedBlobKindDecodeTestCases,
    encodeOptionalFixedHexBlobProfileTestCases,
    encodeCompactFixedHexBlobProfileTestCases,
    decodeCompactFixedHexBlobProfileTestCases,
    encodeMixedKindProfileTestCases,
    decodeMixedKindProfileTestCases,
    compactFixedHexBlobKindEncodeTestCases,
    compactFixedHexBlobKindDecodeTestCases
};
