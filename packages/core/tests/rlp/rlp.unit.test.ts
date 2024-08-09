import { Hex } from '../../src/vcdm/Hex';
import { RLP_CODER } from '../../src';
import { describe, expect, test } from '@jest/globals';
import { InvalidRLP } from '@vechain/sdk-errors';
import {
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
    fixedHexBlobKindDecodeTestCases,
    fixedHexBlobKindEncodeTestCases,
    hexBlobKindDecodeTestCases,
    hexBlobKindEncodeTestCases,
    invalidBufferKindDecodeTestCases,
    invalidDecodeObjectTestCases,
    invalidEncodeObjectTestCases,
    invalidFixedBlobKindDecodeTestCases,
    invalidFixedHexBlobEncodeTestCases,
    invalidHexBlobKindDecodeTestCases,
    invalidHexBlobKindEncodeTestCases,
    invalidNumericKindDecodeTestCases,
    invalidNumericKindEncodeTestCases,
    numericKindDecodeTestCases,
    numericKindEncodeTestCases
} from './rlp.fixture';

/**
 * Test suite for RLP_CODER encoding/decoding functionality
 * @group unit/rlp
 */
describe('RLP', () => {
    // Testing RLP_CODER encoding functionality
    describe('encode', () => {
        encodeTestCases.forEach(({ input, expected, description }) => {
            test(description, () => {
                expect(Hex.of(RLP_CODER.encode(input)).toString()).toEqual(
                    expected
                );
            });
        });
    });

    // Testing RLP_CODER decoding functionality
    describe('decode', () => {
        decodeTestCases.forEach(({ input, expected, description }) => {
            test(description, () => {
                expect(
                    RLP_CODER.decode(Buffer.from(Hex.of(input).bytes))
                ).toEqual(expected);
            });
        });
    });

    /**
     * Test suite for BufferKind functionality (both encoding and decoding).
     */
    describe('BufferKind', () => {
        // Testing BufferKind decoding functionality
        describe('BufferKind decode', () => {
            invalidBufferKindDecodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.buffer(data, '').decode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });
    });

    /**
     * Test suite for NumericKind functionality (both encoding and decoding).
     */
    describe('NumericKind', () => {
        describe('NumericKind encode', () => {
            numericKindEncodeTestCases.forEach(
                ({ kind, data, expected, description }) => {
                    test(description, () => {
                        expect(
                            Hex.of(kind.data(data, '').encode()).toString()
                        ).toEqual(expected);
                    });
                }
            );

            invalidNumericKindEncodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.data(data, '').encode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });

        describe('NumericKind decode', () => {
            numericKindDecodeTestCases.forEach(
                ({ kind, data, description, expected }) => {
                    test(description, () => {
                        expect(kind.buffer(data, '').decode()).toEqual(
                            expected
                        );
                    });
                }
            );

            invalidNumericKindDecodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            kind.buffer(data, '').decode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });
    });

    /**
     * Test suite for HexBlobKind functionality (both encoding and decoding).
     */
    describe('HexBlobKind', () => {
        // Testing HexBlobKind functionality (encoding)
        describe('HexBlobKind encode', () => {
            hexBlobKindEncodeTestCases.forEach(
                ({ kind, data, expected, description }) => {
                    test(description, () => {
                        expect(
                            Hex.of(kind.data(data, '').encode()).toString()
                        ).toEqual(expected);
                    });
                }
            );

            invalidHexBlobKindEncodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.data(data, '').encode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });

        describe('HexBlobKind decode', () => {
            hexBlobKindDecodeTestCases.forEach(
                ({ kind, data, description, expected }) => {
                    test(description, () => {
                        expect(kind.buffer(data, '').decode()).toEqual(
                            expected
                        );
                    });
                }
            );

            invalidHexBlobKindDecodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.buffer(data, '').decode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });
    });

    /**
     * Test suite for FixedHexBlobKind functionality (both encoding and decoding).
     */
    describe('FixedHexBlobKind', () => {
        // Testing FixedHexBlobKind functionality (encoding)
        describe('FixedHexBlobKind encode', () => {
            fixedHexBlobKindEncodeTestCases.forEach(
                ({ kind, data, expected, description }) => {
                    test(description, () => {
                        expect(
                            Hex.of(kind.data(data, '').encode()).toString()
                        ).toEqual(expected);
                    });
                }
            );

            invalidFixedHexBlobEncodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.data(data, '').encode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });

        // Testing FixedHexBlobKind functionality (decoding)
        describe('FixedHexBlobKind decode', () => {
            fixedHexBlobKindDecodeTestCases.forEach(
                ({ kind, data, description, expected }) => {
                    test(description, () => {
                        expect(kind.buffer(data, '').decode()).toEqual(
                            expected
                        );
                    });
                }
            );

            invalidFixedBlobKindDecodeTestCases.forEach(
                ({ kind, data, description }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.buffer(data, '').decode();
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });
    });

    /**
     * Test suite for CompactFixedHexBlobKind functionality (both encoding and decoding).
     */
    describe('Compact Fixed Hex Blob Kind', () => {
        // Testing CompactFixedHexBlobKind functionality (encoding)
        describe('CompactFixedHexBlobKind encode', () => {
            compactFixedHexBlobKindEncodeTestCases.forEach(
                ({ kind, data, expected, description }) => {
                    test(description, () => {
                        expect(
                            Hex.of(kind.data(data, '').encode()).toString()
                        ).toEqual(expected);
                    });
                }
            );
        });

        // Testing CompactFixedHexBlobKind functionality (decoding)
        describe('CompactFixedHexBlobKind decode', () => {
            compactFixedHexBlobKindDecodeTestCases.forEach(
                ({ kind, data, description, expected }) => {
                    test(description, () => {
                        expect(kind.buffer(data, '').decode()).toEqual(
                            expected
                        );
                    });
                }
            );
        });
    });

    /**
     * Test suite for Profiler encoding functionality.
     */
    describe('Profiler encodeObject', () => {
        // Testing encodeObject for buffer profile
        describe('encodeObject encodes buffer profile', () => {
            encodeBufferProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        // Testing encodeObject for numeric profile
        describe('encodeObject encodes numeric profile', () => {
            encodeNumericProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        // Testing encodeObject for hex blob profile
        describe('encodeObject encodes hex blob profile', () => {
            encodeHexBlobProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        describe('encodeObject encodes fixed hex blob profile', () => {
            encodeFixedHexBlobProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        // Testing encodeObject for fixed nullable hex blob profile
        describe('encodeObject encodes fixed nullable hex blob profile', () => {
            encodeOptionalFixedHexBlobProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        // Testing encodeObject for compact fixed hex blob profile
        describe('encodeObject encodes compact fixed hex blob profile', () => {
            encodeCompactFixedHexBlobProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        // Testing encodeObject for profiles with different kinds of data
        describe('encodeObject encodes profiles with different kinds of data', () => {
            encodeMixedKindProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(Hex.of(encoded).toString()).toBe(expected);
                    });
                }
            );
        });

        // Testing encodeObject throws if data doesn't match profile
        describe("encodeObject throws if profile doesn't match data", () => {
            invalidEncodeObjectTestCases.forEach(
                ({ profile, data, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        expect(() => {
                            rlp.encodeObject(data);
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });
    });

    /**
     * Test suite for Profiler decoding functionality.
     */
    describe('Profiler decodeObject', () => {
        // Testing decodeObject for buffer profile
        describe('decodeObject decodes buffer profile', () => {
            decodeBufferProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        // Testing decodeObject for numeric profile
        describe('decodeObject decodes numeric profile', () => {
            decodeNumericProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        // Testing decodeObject for hex blob profile
        describe('decodeObject decodes hex blob profile', () => {
            decodeHexBlobProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        // Testing decodeObject for fixed hex blob profile
        describe('decodeObject decodes compact fixed hex blob profile', () => {
            decodeCompactFixedHexBlobProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        // Testing decodeObject for fixed hex blob profile
        describe('decodeObject decodes mixed profile with different kinds of data', () => {
            decodeMixedKindProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        // Testing decodeObject throws if data doesn't match profile
        describe("decodeObject throws if data doesn't match profile", () => {
            invalidDecodeObjectTestCases.forEach(
                ({ profile, data, description }) => {
                    test(description, () => {
                        const rlp = new RLP_CODER.Profiler(profile);

                        expect(() => {
                            rlp.decodeObject(data);
                        }).toThrowError(InvalidRLP);
                    });
                }
            );
        });
    });
});
