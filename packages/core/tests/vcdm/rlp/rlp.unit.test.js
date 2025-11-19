"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const RLP_1 = require("../../../src/vcdm/encoding/rlp/RLP");
const RLPProfiler_1 = require("../../../src/vcdm/encoding/rlp/RLPProfiler");
const Hex_1 = require("../../../src/vcdm/Hex");
const rlp_fixture_1 = require("./rlp.fixture");
/**
 * Test suite for RLP encoding/decoding functionality
 * @group unit/rlp
 */
(0, globals_1.describe)('RLP', () => {
    // Testing encoding functionality
    (0, globals_1.describe)('encode', () => {
        rlp_fixture_1.encodeTestCases.forEach(({ input, expected, description }) => {
            (0, globals_1.test)(description, () => {
                (0, globals_1.expect)(Hex_1.Hex.of(RLP_1.RLP.of(input).encoded).toString()).toEqual(expected);
            });
        });
    });
    // Testing decoding functionality
    (0, globals_1.describe)('decode', () => {
        rlp_fixture_1.decodeTestCases.forEach(({ input, expected, description }) => {
            (0, globals_1.test)(description, () => {
                (0, globals_1.expect)(RLP_1.RLP.ofEncoded(src_1.HexUInt.of(input).bytes).decoded).toEqual(expected);
            });
        });
    });
    // Testing VCDM methods
    (0, globals_1.describe)('vcdm', () => {
        (0, globals_1.test)('should return a number', () => {
            const number = 2;
            const rlpNumber = RLP_1.RLP.of(number).n;
            (0, globals_1.expect)(number).toEqual(rlpNumber);
        });
        (0, globals_1.test)('should throw an error when not in the range', () => {
            const number1 = Number.MIN_SAFE_INTEGER;
            (0, globals_1.expect)(() => {
                return RLP_1.RLP.of(number1).n;
            }).toThrowError(sdk_errors_1.InvalidRLP);
            const number2 = BigInt(Number.MAX_SAFE_INTEGER);
            (0, globals_1.expect)(() => {
                return RLP_1.RLP.of(number2).n;
            }).toThrowError(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('isEqual', () => {
            const rlp1 = RLP_1.RLP.of(1);
            const rlp2 = RLP_1.RLP.of(1);
            const rlp3 = RLP_1.RLP.of(2);
            const rlp4 = RLP_1.RLP.of(1234);
            (0, globals_1.expect)(rlp1.isEqual(rlp2)).toBe(true);
            (0, globals_1.expect)(rlp1.isEqual(rlp3)).toBe(false);
            (0, globals_1.expect)(rlp1.isEqual(rlp4)).toBe(false);
        });
        (0, globals_1.test)('toHex', () => {
            const rlp = RLP_1.RLP.of(1234);
            (0, globals_1.expect)(rlp.toHex().toString()).toBe('0x8204d2');
        });
    });
    /**
     * Test suite for NumericKind functionality (both encoding and decoding).
     */
    (0, globals_1.describe)('NumericKind', () => {
        (0, globals_1.describe)('NumericKind encode', () => {
            rlp_fixture_1.numericKindEncodeTestCases.forEach(({ kind, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(Hex_1.Hex.of(kind.data(data, '').encode()).toString()).toEqual(expected);
                });
            });
            rlp_fixture_1.invalidNumericKindEncodeTestCases.forEach(({ kind, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        // @ts-expect-error - invalid input
                        kind.data(data, '').encode();
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
        (0, globals_1.describe)('NumericKind decode', () => {
            rlp_fixture_1.numericKindDecodeTestCases.forEach(({ kind, data, description, expected }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(kind.buffer(data, '').decode()).toEqual(expected);
                });
            });
            rlp_fixture_1.invalidNumericKindDecodeTestCases.forEach(({ kind, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        kind.buffer(data, '').decode();
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
    });
    /**
     * Test suite for HexBlobKind functionality (both encoding and decoding).
     */
    (0, globals_1.describe)('HexBlobKind', () => {
        // Testing HexBlobKind functionality (encoding)
        (0, globals_1.describe)('HexBlobKind encode', () => {
            rlp_fixture_1.hexBlobKindEncodeTestCases.forEach(({ kind, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(Hex_1.Hex.of(kind.data(data, '').encode()).toString()).toEqual(expected);
                });
            });
            rlp_fixture_1.invalidHexBlobKindEncodeTestCases.forEach(({ kind, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        // @ts-expect-error - invalid input
                        kind.data(data, '').encode();
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
        (0, globals_1.describe)('HexBlobKind decode', () => {
            rlp_fixture_1.hexBlobKindDecodeTestCases.forEach(({ kind, data, description, expected }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(kind.buffer(data, '').decode()).toEqual(expected);
                });
            });
        });
    });
    /**
     * Test suite for FixedHexBlobKind functionality (both encoding and decoding).
     */
    (0, globals_1.describe)('FixedHexBlobKind', () => {
        // Testing FixedHexBlobKind functionality (encoding)
        (0, globals_1.describe)('FixedHexBlobKind encode', () => {
            rlp_fixture_1.fixedHexBlobKindEncodeTestCases.forEach(({ kind, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(Hex_1.Hex.of(kind.data(data, '').encode()).toString()).toEqual(expected);
                });
            });
            rlp_fixture_1.invalidFixedHexBlobEncodeTestCases.forEach(({ kind, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        // @ts-expect-error - invalid input
                        kind.data(data, '').encode();
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
        // Testing FixedHexBlobKind functionality (decoding)
        (0, globals_1.describe)('FixedHexBlobKind decode', () => {
            rlp_fixture_1.fixedHexBlobKindDecodeTestCases.forEach(({ kind, data, description, expected }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(kind.buffer(data, '').decode()).toEqual(expected);
                });
            });
            rlp_fixture_1.invalidFixedBlobKindDecodeTestCases.forEach(({ kind, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        // @ts-expect-error - invalid input
                        kind.buffer(data, '').decode();
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
    });
    /**
     * Test suite for CompactFixedHexBlobKind functionality (both encoding and decoding).
     */
    (0, globals_1.describe)('Compact Fixed Hex Blob Kind', () => {
        // Testing CompactFixedHexBlobKind functionality (encoding)
        (0, globals_1.describe)('CompactFixedHexBlobKind encode', () => {
            rlp_fixture_1.compactFixedHexBlobKindEncodeTestCases.forEach(({ kind, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(Hex_1.Hex.of(kind.data(data, '').encode()).toString()).toEqual(expected);
                });
            });
        });
        // Testing CompactFixedHexBlobKind functionality (decoding)
        (0, globals_1.describe)('CompactFixedHexBlobKind decode', () => {
            rlp_fixture_1.compactFixedHexBlobKindDecodeTestCases.forEach(({ kind, data, description, expected }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(kind.buffer(data, '').decode()).toEqual(expected);
                });
            });
        });
    });
    /**
     * Test suite for Profiler encoding functionality.
     */
    (0, globals_1.describe)('Profiler encodeObject', () => {
        // Testing encodeObject for buffer profile
        (0, globals_1.describe)('encodeObject encodes buffer profile', () => {
            rlp_fixture_1.encodeBufferProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        // Testing encodeObject for numeric profile
        (0, globals_1.describe)('encodeObject encodes numeric profile', () => {
            rlp_fixture_1.encodeNumericProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        // Testing encodeObject for hex blob profile
        (0, globals_1.describe)('encodeObject encodes hex blob profile', () => {
            rlp_fixture_1.encodeHexBlobProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        (0, globals_1.describe)('encodeObject encodes fixed hex blob profile', () => {
            rlp_fixture_1.encodeFixedHexBlobProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        // Testing encodeObject for fixed nullable hex blob profile
        (0, globals_1.describe)('encodeObject encodes fixed nullable hex blob profile', () => {
            rlp_fixture_1.encodeOptionalFixedHexBlobProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        // Testing encodeObject for compact fixed hex blob profile
        (0, globals_1.describe)('encodeObject encodes compact fixed hex blob profile', () => {
            rlp_fixture_1.encodeCompactFixedHexBlobProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        // Testing encodeObject for profiles with different kinds of data
        (0, globals_1.describe)('encodeObject encodes profiles with different kinds of data', () => {
            rlp_fixture_1.encodeMixedKindProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const encoded = RLPProfiler_1.RLPProfiler.ofObject(data, profile).encoded;
                    (0, globals_1.expect)(Hex_1.Hex.of(encoded).toString()).toBe(expected);
                });
            });
        });
        // Testing encodeObject throws if data doesn't match profile
        (0, globals_1.describe)("encodeObject throws if profile doesn't match data", () => {
            rlp_fixture_1.invalidEncodeObjectTestCases.forEach(({ profile, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        RLPProfiler_1.RLPProfiler.ofObject(data, profile);
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
    });
    /**
     * Test suite for Profiler decoding functionality.
     */
    (0, globals_1.describe)('Profiler decodeObject', () => {
        // Testing decodeObject for buffer profile
        (0, globals_1.describe)('decodeObject decodes buffer profile', () => {
            rlp_fixture_1.decodeBufferProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const decoded = RLPProfiler_1.RLPProfiler.ofObjectEncoded(data, profile).object;
                    (0, globals_1.expect)(decoded).toEqual(expected);
                });
            });
        });
        // Testing decodeObject for numeric profile
        (0, globals_1.describe)('decodeObject decodes numeric profile', () => {
            rlp_fixture_1.decodeNumericProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const decoded = RLPProfiler_1.RLPProfiler.ofObjectEncoded(data, profile).object;
                    (0, globals_1.expect)(decoded).toEqual(expected);
                });
            });
        });
        // Testing decodeObject for hex blob profile
        (0, globals_1.describe)('decodeObject decodes hex blob profile', () => {
            rlp_fixture_1.decodeHexBlobProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const decoded = RLPProfiler_1.RLPProfiler.ofObjectEncoded(data, profile).object;
                    (0, globals_1.expect)(decoded).toEqual(expected);
                });
            });
        });
        // Testing decodeObject for fixed hex blob profile
        (0, globals_1.describe)('decodeObject decodes compact fixed hex blob profile', () => {
            rlp_fixture_1.decodeCompactFixedHexBlobProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const decoded = RLPProfiler_1.RLPProfiler.ofObjectEncoded(data, profile).object;
                    (0, globals_1.expect)(decoded).toEqual(expected);
                });
            });
        });
        // Testing decodeObject for fixed hex blob profile
        (0, globals_1.describe)('decodeObject decodes mixed profile with different kinds of data', () => {
            rlp_fixture_1.decodeMixedKindProfileTestCases.forEach(({ profile, data, expected, description }) => {
                (0, globals_1.test)(description, () => {
                    const decoded = RLPProfiler_1.RLPProfiler.ofObjectEncoded(data, profile).object;
                    (0, globals_1.expect)(decoded).toEqual(expected);
                });
            });
        });
        // Testing decodeObject throws if data doesn't match profile
        (0, globals_1.describe)("decodeObject throws if data doesn't match profile", () => {
            rlp_fixture_1.invalidDecodeObjectTestCases.forEach(({ profile, data, description }) => {
                (0, globals_1.test)(description, () => {
                    (0, globals_1.expect)(() => {
                        return RLPProfiler_1.RLPProfiler.ofObjectEncoded(data, profile)
                            .object;
                    }).toThrowError(sdk_errors_1.InvalidRLP);
                });
            });
        });
    });
});
