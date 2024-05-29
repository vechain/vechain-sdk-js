import { RLP_CODER, type RLPProfile, type RLPValidObject } from '../../src';

/* Simple RLP_CODER encode */
const encodeTestCases = [
    {
        input: [1, 2, 3, [4, 5]],
        expected: 'c6010203c20405',
        description: 'array with multiple and nested items'
    },
    { input: 42, expected: '2a', description: 'single value' },
    { input: [], expected: 'c0', description: 'empty array' }
];

/* Simple RLP_CODER decode */
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
        kind: new RLP_CODER.NumericKind(8),
        data: '0x0',
        expected: '',
        description: 'zero hex string'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: '0x123',
        expected: '0123',
        description: 'hex string'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: '0',
        expected: '',
        description: 'zero number string'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: '100',
        expected: '64',
        description: 'number string'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: 0,
        expected: '',
        description: 'zero number'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: 0x123,
        expected: '0123',
        description: 'number in hex format'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: 12524,
        expected: '30ec',
        description: 'number non hex format'
    },
    {
        kind: new RLP_CODER.NumericKind(1),
        data: '5',
        expected: '05',
        description: 'number in hex format'
    },
    {
        kind: new RLP_CODER.NumericKind(1),
        data: 255,
        expected: 'ff',
        description: 'number non hex format'
    }
];

const invalidNumericKindEncodeTestCases = [
    {
        kind: new RLP_CODER.NumericKind(8),
        data: '0x123z',
        description: 'invalid hex string'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: {},
        description: 'invalid object'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: '0x',
        description: 'invalid hex string'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: -1,
        description: 'negative number'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: '0x12345678123456780',
        description: 'number overflow'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: 2 ** 64,
        description: 'number overflow'
    },
    {
        kind: new RLP_CODER.NumericKind(1),
        data: 256,
        description: 'number overflow'
    }
];

/* Numeric kind decode tests */
const numericKindDecodeTestCases = [
    {
        kind: new RLP_CODER.NumericKind(8),
        data: Buffer.alloc(0),
        description: 'empty buffer',
        expected: 0
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: 0x010203
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]),
        description: 'buffer with data',
        expected: '0x102030405060708'
    },
    {
        kind: new RLP_CODER.NumericKind(1),
        data: Buffer.from('ff', 'hex'),
        description: 'buffer with data',
        expected: 255
    }
];

const invalidBufferKindDecodeTestCases = [
    {
        kind: new RLP_CODER.BufferKind(),
        data: 42,
        description: 'invalid data'
    }
];

const invalidNumericKindDecodeTestCases = [
    {
        kind: new RLP_CODER.NumericKind(8),
        data: Buffer.alloc(9, 1),
        description: 'buffer exceeds max bytes'
    },
    {
        kind: new RLP_CODER.NumericKind(8),
        data: Buffer.from([0, 1]),
        description: 'buffer with leading zero'
    }
];

/* Hex Blob Kind encode tests */
const hexBlobKindEncodeTestCases = [
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: '0x010203',
        expected: '010203',
        description: 'hex string'
    }
];

const invalidHexBlobKindEncodeTestCases = [
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: '0x123z',
        description: 'invalid hex string'
    },
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: {},
        description: 'invalid object'
    },
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: '0x123',
        description: 'invalid hex string'
    }
];

/* Fixed Hex Blob Kind encode tests */
const fixedHexBlobKindEncodeTestCases = [
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: '0x01',
        expected: '01',
        description: 'hex string'
    }
];

const invalidFixedHexBlobEncodeTestCases = [
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: '0x123z',
        description: 'invalid hex string'
    },
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: {},
        description: 'invalid data type'
    },
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: '0x123',
        description: 'invalid hex string'
    },
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: '0x012345',
        description: 'overflow hex string'
    }
];

/* Hex Blob Kind decode tests */
const hexBlobKindDecodeTestCases = [
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: Buffer.alloc(0),
        description: 'empty buffer',
        expected: '0x'
    },
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x010203'
    },
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: Buffer.from([1, 2, 3, 4, 5]),
        description: 'buffer with data',
        expected: '0x0102030405'
    }
];

const invalidHexBlobKindDecodeTestCases = [
    {
        kind: new RLP_CODER.HexBlobKind(),
        data: 42,
        description: 'invalid data'
    }
];

/* Fixed Hex Blob Kind decode tests */
const fixedHexBlobKindDecodeTestCases = [
    {
        kind: new RLP_CODER.FixedHexBlobKind(3),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x010203'
    },
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: Buffer.from([1]),
        description: 'buffer with data',
        expected: '0x01'
    }
];

const invalidFixedBlobKindDecodeTestCases = [
    {
        kind: new RLP_CODER.FixedHexBlobKind(3),
        data: Buffer.from([1, 2]),
        description: 'buffer with data'
    },
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: Buffer.from([1, 2]),
        description: 'buffer with data'
    },
    {
        kind: new RLP_CODER.FixedHexBlobKind(1),
        data: '0x123',
        description: 'invalid data buffer'
    }
];

const compactFixedHexBlobKindEncodeTestCases = [
    {
        kind: new RLP_CODER.CompactFixedHexBlobKind(4),
        data: '0x00112233',
        description: 'buffer with data',
        expected: '112233'
    },
    {
        kind: new RLP_CODER.CompactFixedHexBlobKind(1),
        data: '0x00',
        description: 'buffer with data',
        expected: ''
    }
];

const compactFixedHexBlobKindDecodeTestCases = [
    {
        kind: new RLP_CODER.CompactFixedHexBlobKind(4),
        data: Buffer.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x00010203'
    },
    {
        kind: new RLP_CODER.CompactFixedHexBlobKind(1),
        data: Buffer.from([1]),
        description: 'buffer with data',
        expected: '0x01'
    }
];

/* ------ RLP_CODER Profile Objects & Data ------- */
const [bufferProfile, bufferData, invalidBufferData]: [
    RLPProfile,
    RLPValidObject,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new RLP_CODER.BufferKind() },
            { name: 'bar', kind: new RLP_CODER.BufferKind() }
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
            { name: 'foo', kind: new RLP_CODER.NumericKind() },
            { name: 'bar', kind: new RLP_CODER.NumericKind() },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new RLP_CODER.NumericKind() },
                        { name: 'y', kind: new RLP_CODER.NumericKind() },
                        {
                            name: 'z',
                            kind: {
                                item: [
                                    {
                                        name: 'a',
                                        kind: new RLP_CODER.NumericKind()
                                    },
                                    {
                                        name: 'b',
                                        kind: new RLP_CODER.NumericKind()
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
            { name: 'foo', kind: new RLP_CODER.NumericKind(1) },
            { name: 'bar', kind: new RLP_CODER.NumericKind() },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new RLP_CODER.NumericKind() },
                        { name: 'y', kind: new RLP_CODER.NumericKind() }
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
            { name: 'foo', kind: new RLP_CODER.HexBlobKind() },
            { name: 'bar', kind: new RLP_CODER.HexBlobKind() }
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
            { name: 'foo', kind: new RLP_CODER.FixedHexBlobKind(1) },
            { name: 'bar', kind: new RLP_CODER.FixedHexBlobKind(3) }
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
            { name: 'foo', kind: new RLP_CODER.OptionalFixedHexBlobKind(1) },
            { name: 'bar', kind: new RLP_CODER.OptionalFixedHexBlobKind(3) }
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
            { name: 'foo', kind: new RLP_CODER.CompactFixedHexBlobKind(1) },
            { name: 'bar', kind: new RLP_CODER.CompactFixedHexBlobKind(3) }
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
            { name: 'foo', kind: new RLP_CODER.NumericKind() },
            { name: 'bar', kind: new RLP_CODER.FixedHexBlobKind(4) },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new RLP_CODER.HexBlobKind() },
                        { name: 'y', kind: new RLP_CODER.NumericKind() }
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
            { name: 'chainTag', kind: new RLP_CODER.NumericKind(1) },
            {
                name: 'blockRef',
                kind: new RLP_CODER.CompactFixedHexBlobKind(8)
            },
            { name: 'expiration', kind: new RLP_CODER.NumericKind(4) },
            {
                name: 'clauses',
                kind: {
                    item: [
                        {
                            name: 'to',
                            kind: new RLP_CODER.OptionalFixedHexBlobKind(20)
                        },
                        { name: 'value', kind: new RLP_CODER.NumericKind(32) },
                        { name: 'data', kind: new RLP_CODER.HexBlobKind() }
                    ]
                }
            },
            { name: 'gasPriceCoef', kind: new RLP_CODER.NumericKind(1) },
            { name: 'gas', kind: new RLP_CODER.NumericKind(8) },
            {
                name: 'dependsOn',
                kind: new RLP_CODER.OptionalFixedHexBlobKind(32)
            },
            { name: 'nonce', kind: new RLP_CODER.NumericKind(8) }
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

/* ------ RLP_CODER Profile Encode Tests ------- */
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
        description: 'encode buffer profile with invalid data'
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataInvalidArray,
        description: 'encode numeric profile with invalid array'
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataWithByteOverflow,
        description: 'encode numeric profile with byte overflow'
    },
    {
        profile: hexBlobProfile,
        data: hexBlobDataWithInvalidHex,
        description: 'encode hex blob profile with invalid hex'
    }
];

/* ------ RLP_CODER Profile Decode Tests ------- */
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
        description: 'decode buffer profile with invalid data'
    },
    {
        profile: numericProfile,
        data: Buffer.from('c3010202', 'hex'),
        description: 'decode buffer profile with invalid data'
    },
    {
        profile: numericProfile,
        data: Buffer.from('d1c7c60304c3c2070802c7c60304c3c20708', 'hex'),
        description: 'decode buffer profile with invalid data'
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
