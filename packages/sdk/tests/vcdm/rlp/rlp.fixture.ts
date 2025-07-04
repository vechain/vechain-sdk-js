import {
    BufferKind,
    CompactFixedHexBlobKind,
    FixedHexBlobKind,
    HexBlobKind,
    HexUInt,
    NumericKind,
    OptionalFixedHexBlobKind,
    type RLPProfile,
    type RLPValidObject
} from '@vcdm';

/* Simple encode */
const encodeTestCases = [
    {
        input: [1, 2, 3, [4, 5]],
        expected: '0xc6010203c20405',
        description: 'array with multiple and nested items'
    },
    { input: 42, expected: '0x2a', description: 'single value' },
    { input: [], expected: '0xc0', description: 'empty array' }
];

/* Simple decode */
const decodeTestCases = [
    {
        input: '0x2a',
        expected: Uint8Array.from([42]),
        description: 'single value'
    },
    { input: '0xc0', expected: [], description: 'empty array' }
];

/* NumericKind encode */
const numericKindEncodeTestCases = [
    {
        kind: new NumericKind(8),
        data: '0x0',
        expected: '0x',
        description: 'zero hex string'
    },
    {
        kind: new NumericKind(8),
        data: '0x123',
        expected: '0x0123',
        description: 'hex string'
    },
    {
        kind: new NumericKind(8),
        data: '0',
        expected: '0x',
        description: 'zero number string'
    },
    {
        kind: new NumericKind(8),
        data: '100',
        expected: '0x64',
        description: 'number string'
    },
    {
        kind: new NumericKind(8),
        data: 0,
        expected: '0x',
        description: 'zero number'
    },
    {
        kind: new NumericKind(8),
        data: 0x123,
        expected: '0x0123',
        description: 'number in hex format'
    },
    {
        kind: new NumericKind(8),
        data: 12524,
        expected: '0x30ec',
        description: 'number non hex format'
    },
    {
        kind: new NumericKind(1),
        data: '5',
        expected: '0x05',
        description: 'number in hex format'
    },
    {
        kind: new NumericKind(1),
        data: 255,
        expected: '0xff',
        description: 'number non hex format'
    }
];

const invalidNumericKindEncodeTestCases = [
    {
        kind: new NumericKind(8),
        data: '0x123z',
        description: 'invalid hex string'
    },
    {
        kind: new NumericKind(8),
        data: {},
        description: 'invalid object'
    },
    {
        kind: new NumericKind(8),
        data: '0x',
        description: 'invalid hex string'
    },
    {
        kind: new NumericKind(8),
        data: -1,
        description: 'negative number'
    },
    {
        kind: new NumericKind(8),
        data: '0x12345678123456780',
        description: 'number overflow'
    },
    {
        kind: new NumericKind(8),
        data: 2 ** 64,
        description: 'number overflow'
    },
    {
        kind: new NumericKind(1),
        data: 256,
        description: 'number overflow'
    }
];

/* Numeric kind decode tests */
const numericKindDecodeTestCases = [
    {
        kind: new NumericKind(8),
        data: Uint8Array.from([]),
        description: 'empty buffer',
        expected: 0
    },
    {
        kind: new NumericKind(8),
        data: Uint8Array.from([1, 2, 3]),
        description: 'buffer with data',
        expected: 0x010203
    },
    {
        kind: new NumericKind(8),
        data: Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]),
        description: 'buffer with data',
        expected: '0x102030405060708'
    },
    {
        kind: new NumericKind(1),
        data: HexUInt.of('ff').bytes,
        description: 'buffer with data',
        expected: 255
    }
];

const invalidBufferKindDecodeTestCases = [
    {
        kind: new BufferKind(),
        data: 42,
        description: 'invalid data'
    }
];

const invalidNumericKindDecodeTestCases = [
    {
        kind: new NumericKind(8),
        data: new Uint8Array(9).fill(1),
        description: 'buffer exceeds max bytes'
    },
    {
        kind: new NumericKind(8),
        data: Uint8Array.from([0, 1]),
        description: 'buffer with leading zero'
    }
];

/* Hex Blob Kind encode tests */
const hexBlobKindEncodeTestCases = [
    {
        kind: new HexBlobKind(),
        data: '0x010203',
        expected: '0x010203',
        description: 'hex string'
    }
];

const invalidHexBlobKindEncodeTestCases = [
    {
        kind: new HexBlobKind(),
        data: '0x123z',
        description: 'invalid hex string'
    },
    {
        kind: new HexBlobKind(),
        data: {},
        description: 'invalid object'
    },
    {
        kind: new HexBlobKind(),
        data: '0x123',
        description: 'invalid hex string'
    }
];

/* Fixed Hex Blob Kind encode tests */
const fixedHexBlobKindEncodeTestCases = [
    {
        kind: new FixedHexBlobKind(1),
        data: '0x01',
        expected: '0x01',
        description: 'hex string'
    }
];

const invalidFixedHexBlobEncodeTestCases = [
    {
        kind: new FixedHexBlobKind(1),
        data: '0x123z',
        description: 'invalid hex string'
    },
    {
        kind: new FixedHexBlobKind(1),
        data: {},
        description: 'invalid data type'
    },
    {
        kind: new FixedHexBlobKind(1),
        data: '0x123',
        description: 'invalid hex string'
    },
    {
        kind: new FixedHexBlobKind(1),
        data: '0x012345',
        description: 'overflow hex string'
    }
];

/* Hex Blob Kind decode tests */
const hexBlobKindDecodeTestCases = [
    {
        kind: new HexBlobKind(),
        data: Uint8Array.from([]),
        description: 'empty buffer',
        expected: '0x'
    },
    {
        kind: new HexBlobKind(),
        data: Uint8Array.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x010203'
    },
    {
        kind: new HexBlobKind(),
        data: Uint8Array.from([1, 2, 3, 4, 5]),
        description: 'buffer with data',
        expected: '0x0102030405'
    }
];

/* Fixed Hex Blob Kind decode tests */
const fixedHexBlobKindDecodeTestCases = [
    {
        kind: new FixedHexBlobKind(3),
        data: Uint8Array.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x010203'
    },
    {
        kind: new FixedHexBlobKind(1),
        data: Uint8Array.from([1]),
        description: 'buffer with data',
        expected: '0x01'
    }
];

const invalidFixedBlobKindDecodeTestCases = [
    {
        kind: new FixedHexBlobKind(3),
        data: Uint8Array.from([1, 2]),
        description: 'buffer with data'
    },
    {
        kind: new FixedHexBlobKind(1),
        data: Uint8Array.from([1, 2]),
        description: 'buffer with data'
    },
    {
        kind: new FixedHexBlobKind(1),
        data: '0x123',
        description: 'invalid data buffer'
    }
];

const compactFixedHexBlobKindEncodeTestCases = [
    {
        kind: new CompactFixedHexBlobKind(4),
        data: '0x00112233',
        description: 'buffer with data',
        expected: '0x112233'
    },
    {
        kind: new CompactFixedHexBlobKind(1),
        data: '0x00',
        description: 'buffer with data',
        expected: '0x'
    }
];

const compactFixedHexBlobKindDecodeTestCases = [
    {
        kind: new CompactFixedHexBlobKind(4),
        data: Uint8Array.from([1, 2, 3]),
        description: 'buffer with data',
        expected: '0x00010203'
    },
    {
        kind: new CompactFixedHexBlobKind(1),
        data: Uint8Array.from([1]),
        description: 'buffer with data',
        expected: '0x01'
    }
];

/* ------ Profile Objects & Data ------- */
const [bufferProfile, bufferData, invalidBufferData]: [
    RLPProfile,
    RLPValidObject,
    RLPValidObject
] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new BufferKind() },
            { name: 'bar', kind: new BufferKind() }
        ]
    },
    {
        foo: Uint8Array.from([1, 2, 3]),
        bar: Uint8Array.from([4, 5, 6])
    },
    {
        foo: Uint8Array.from([1, 2, 3]),
        bar: 42
    }
];

const [numericProfile, numericData]: [RLPProfile, RLPValidObject] = [
    {
        name: '',
        kind: [
            { name: 'foo', kind: new NumericKind() },
            { name: 'bar', kind: new NumericKind() },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new NumericKind() },
                        { name: 'y', kind: new NumericKind() },
                        {
                            name: 'z',
                            kind: {
                                item: [
                                    {
                                        name: 'a',
                                        kind: new NumericKind()
                                    },
                                    {
                                        name: 'b',
                                        kind: new NumericKind()
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
            { name: 'foo', kind: new NumericKind(1) },
            { name: 'bar', kind: new NumericKind() },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new NumericKind() },
                        { name: 'y', kind: new NumericKind() }
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
            { name: 'foo', kind: new HexBlobKind() },
            { name: 'bar', kind: new HexBlobKind() }
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
            { name: 'foo', kind: new FixedHexBlobKind(1) },
            { name: 'bar', kind: new FixedHexBlobKind(3) }
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
            { name: 'foo', kind: new OptionalFixedHexBlobKind(1) },
            { name: 'bar', kind: new OptionalFixedHexBlobKind(3) }
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
            { name: 'foo', kind: new CompactFixedHexBlobKind(1) },
            { name: 'bar', kind: new CompactFixedHexBlobKind(3) }
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
            { name: 'foo', kind: new NumericKind() },
            { name: 'bar', kind: new FixedHexBlobKind(4) },
            {
                name: 'baz',
                kind: {
                    item: [
                        { name: 'x', kind: new HexBlobKind() },
                        { name: 'y', kind: new NumericKind() }
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
            { name: 'chainTag', kind: new NumericKind(1) },
            {
                name: 'blockRef',
                kind: new CompactFixedHexBlobKind(8)
            },
            { name: 'expiration', kind: new NumericKind(4) },
            {
                name: 'clauses',
                kind: {
                    item: [
                        {
                            name: 'to',
                            kind: new OptionalFixedHexBlobKind(20)
                        },
                        { name: 'value', kind: new NumericKind(32) },
                        { name: 'data', kind: new HexBlobKind() }
                    ]
                }
            },
            { name: 'gasPriceCoef', kind: new NumericKind(1) },
            { name: 'gas', kind: new NumericKind(8) },
            {
                name: 'dependsOn',
                kind: new OptionalFixedHexBlobKind(32)
            },
            { name: 'nonce', kind: new NumericKind(8) }
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

/* ------ Profile Encode Tests ------- */
const encodeNumericProfileTestCases = [
    {
        profile: numericProfile,
        data: numericData,
        expected: '0xd10102cec60304c3c20708c60506c3c2800a',
        description: 'encode numeric profile'
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataWithMaxBytes,
        expected: '0xc90102c6c20304c20506',
        description: 'encode numeric profile with max bytes'
    },
    {
        profile: numericProfileWithMaxBytes,
        data: numericDataWithString,
        expected: '0xc90102c6c20304c20506',
        description: 'encode numeric profile with string'
    }
];

const encodeBufferProfileTestCases = [
    {
        profile: bufferProfile,
        data: bufferData,
        expected: '0xc88301020383040506',
        description: 'encode buffer profile'
    }
];

const encodeHexBlobProfileTestCases = [
    {
        profile: hexBlobProfile,
        data: hexBlobData,
        expected: '0xc88301020383040506',
        description: 'encode hex blob profile'
    }
];

const encodeFixedHexBlobProfileTestCases = [
    {
        profile: fixedHexBlobProfile,
        data: fixedHexBlobData,
        expected: '0xc50183010203',
        description: 'encode fixed hex blob profile'
    }
];

const encodeOptionalFixedHexBlobProfileTestCases = [
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobData,
        expected: '0xc50183010203',
        description: 'encode nullable fixed hex blob profile'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataNull,
        expected: '0xc28080',
        description: 'encode nullable fixed hex blob profile with null'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataMixed,
        expected: '0xc20180',
        description: 'encode nullable fixed hex blob profile with mixed data'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataMixed2,
        expected: '0xc58083010203',
        description: 'encode nullable fixed hex blob profile with mixed data 2'
    },
    {
        profile: optionalFixedHexBlobProfile,
        data: optionalFixedHexBlobDataMixed3,
        expected: '0xc28080',
        description: 'encode nullable fixed hex blob profile with mixed data 3'
    }
];

const encodeCompactFixedHexBlobProfileTestCases = [
    {
        profile: compactFixedHexBlobProfile,
        data: compactFixedHexBlobData,
        expected: '0xc50183010203',
        description: 'encode compact fixed hex blob profile'
    }
];

const encodeMixedKindProfileTestCases = [
    {
        profile: mixedKindProfile1,
        data: mixedKindData1,
        expected: '0xd17b8412345678cac4118204d2c41282162e',
        description: 'encode mixed kind profile'
    },
    {
        profile: mixedKindProfile2,
        data: mixedKindData2,
        expected:
            '0xf8530184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614e',
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

/* ------ Profile Decode Tests ------- */
const decodeBufferProfileTestCases = [
    {
        profile: bufferProfile,
        data: HexUInt.of('c88301020383040506').bytes,
        expected: bufferData,
        description: 'decode buffer profile'
    }
];

const invalidDecodeObjectTestCases = [
    {
        profile: numericProfile,
        data: HexUInt.of('c60102c3c20304').bytes,
        description: 'decode buffer profile with invalid data'
    },
    {
        profile: numericProfile,
        data: HexUInt.of('c3010202').bytes,
        description: 'decode buffer profile with invalid data'
    },
    {
        profile: numericProfile,
        data: HexUInt.of('d1c7c60304c3c2070802c7c60304c3c20708').bytes,
        description: 'decode buffer profile with invalid data'
    }
];

const decodeNumericProfileTestCases = [
    {
        profile: numericProfileWithMaxBytes,
        data: HexUInt.of('c90102c6c20304c20506').bytes,
        expected: numericDataWithMaxBytes,
        description: 'decode numeric profile'
    },
    {
        profile: numericProfile,
        data: HexUInt.of('d10102cec60304c3c20708c60506c3c2800a').bytes,
        expected: numericData,
        description: 'decode numeric profile'
    }
];

const decodeHexBlobProfileTestCases = [
    {
        profile: hexBlobProfile,
        data: HexUInt.of('c88301020383040506').bytes,
        expected: hexBlobData,
        description: 'decode hex blob profile'
    }
];

const decodeCompactFixedHexBlobProfileTestCases = [
    {
        profile: compactFixedHexBlobProfile,
        data: HexUInt.of('c50183010203').bytes,
        expected: compactFixedHexBlobData,
        description: 'decode compact fixed hex blob profile'
    }
];

const decodeMixedKindProfileTestCases = [
    {
        profile: mixedKindProfile1,
        data: HexUInt.of('d17b8412345678cac4118204d2c41282162e').bytes,
        expected: mixedKindData1,
        description: 'decode mixed kind profile'
    },
    {
        profile: mixedKindProfile2,
        data: HexUInt.of(
            'f8530184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614e'
        ).bytes,
        expected: mixedKindData2,
        description: 'decode mixed kind profile with transaction like data'
    }
];

export {
    bufferData,
    bufferProfile,
    compactFixedHexBlobKindDecodeTestCases,
    compactFixedHexBlobKindEncodeTestCases,
    decodeBufferProfileTestCases,
    decodeCompactFixedHexBlobProfileTestCases,
    decodeHexBlobProfileTestCases,
    decodeMixedKindProfileTestCases,
    decodeNumericProfileTestCases,
    decodeTestCases,
    encodeBufferProfileTestCases,
    encodeCompactFixedHexBlobProfileTestCases,
    encodeFixedHexBlobProfileTestCases,
    encodeHexBlobProfileTestCases,
    encodeMixedKindProfileTestCases,
    encodeNumericProfileTestCases,
    encodeOptionalFixedHexBlobProfileTestCases,
    encodeTestCases,
    fixedHexBlobData,
    fixedHexBlobKindDecodeTestCases,
    fixedHexBlobKindEncodeTestCases,
    fixedHexBlobProfile,
    hexBlobData,
    hexBlobKindDecodeTestCases,
    hexBlobKindEncodeTestCases,
    hexBlobProfile,
    invalidBufferData,
    invalidBufferKindDecodeTestCases,
    invalidDecodeObjectTestCases,
    invalidEncodeObjectTestCases,
    invalidFixedBlobKindDecodeTestCases,
    invalidFixedHexBlobEncodeTestCases,
    invalidHexBlobKindEncodeTestCases,
    invalidNumericKindDecodeTestCases,
    invalidNumericKindEncodeTestCases,
    numericData,
    numericDataInvalidArray,
    numericDataWithByteOverflow,
    numericDataWithMaxBytes,
    numericDataWithString,
    numericKindDecodeTestCases,
    numericKindEncodeTestCases,
    numericProfile,
    numericProfileWithMaxBytes
};
