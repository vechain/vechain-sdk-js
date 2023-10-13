import { describe, expect, test } from '@jest/globals';
import { RLP } from '../../src';
import {
    decodeBufferProfileTestCases,
    decodeNumericProfileTestCases,
    decodeTestCases,
    encodeBufferProfileTestCases,
    encodeNumericProfileTestCases,
    encodeTestCases,
    invalidBufferKindDecodeTestCases,
    invalidDecodeObjectTestCases,
    invalidEncodeObjectTestCases,
    invalidNumericKindDecodeTestCases,
    invalidNumericKindEncodeTestCases,
    numericKindDecodeTestCases,
    numericKindEncodeTestCases
} from './rlp.fixture';

describe('RLP', () => {
    // Testing RLP encoding functionality
    describe('encode', () => {
        encodeTestCases.forEach(({ input, expected, description }) => {
            test(description, () => {
                expect(RLP.encode(input).toString('hex')).toEqual(expected);
            });
        });
    });

    // Testing RLP decoding functionality
    describe('decode', () => {
        decodeTestCases.forEach(({ input, expected, description }) => {
            test(description, () => {
                expect(RLP.decode(Buffer.from(input, 'hex'))).toEqual(expected);
            });
        });
    });

    describe('BufferKind', () => {
        // Testing BufferKind decoding functionality
        describe('BufferKind decode', () => {
            invalidBufferKindDecodeTestCases.forEach(
                ({ kind, data, description, throws }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.buffer(data, '').decode();
                        }).toThrowError(throws);
                    });
                }
            );
        });
    });

    // Testing NumericKind functionality (both encoding and decoding)
    describe('NumericKind', () => {
        describe('NumericKind encode', () => {
            numericKindEncodeTestCases.forEach(
                ({ kind, data, expected, description }) => {
                    test(description, () => {
                        expect(
                            kind.data(data, '').encode().toString('hex')
                        ).toEqual(expected);
                    });
                }
            );

            invalidNumericKindEncodeTestCases.forEach(
                ({ kind, data, description, throws }) => {
                    test(description, () => {
                        expect(() => {
                            // @ts-expect-error - invalid input
                            kind.data(data, '').encode();
                        }).toThrowError(throws);
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
                ({ kind, data, description, throws }) => {
                    test(description, () => {
                        expect(() => {
                            kind.buffer(data, '').decode();
                        }).toThrowError(throws);
                    });
                }
            );
        });
    });

    // // Testing encodeObject functionality of Profiler
    describe('Profiler encodeObject', () => {
        describe('encodeObject encodes buffer profile', () => {
            encodeBufferProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(encoded.toString('hex')).toBe(expected);
                    });
                }
            );
        });

        describe('encodeObject encodes numeric profile', () => {
            encodeNumericProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP.Profiler(profile);

                        const encoded = rlp.encodeObject(data);

                        expect(encoded.toString('hex')).toBe(expected);
                    });
                }
            );
        });

        describe("encodeObject throws if profile doesn't match data", () => {
            invalidEncodeObjectTestCases.forEach(
                ({ profile, data, description, throws }) => {
                    test(description, () => {
                        const rlp = new RLP.Profiler(profile);

                        expect(() => {
                            rlp.encodeObject(data);
                        }).toThrowError(throws);
                    });
                }
            );
        });
    });

    // Testing decodeObject functionality of Profiler
    describe('Profiler decodeObject', () => {
        describe('decodeObject decodes buffer profile', () => {
            decodeBufferProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        describe('decodeObject decodes numeric profile', () => {
            decodeNumericProfileTestCases.forEach(
                ({ profile, data, expected, description }) => {
                    test(description, () => {
                        const rlp = new RLP.Profiler(profile);

                        const decoded = rlp.decodeObject(data);

                        expect(decoded).toEqual(expected);
                    });
                }
            );
        });

        describe("decodeObject throws if data doesn't match profile", () => {
            invalidDecodeObjectTestCases.forEach(
                ({ profile, data, description, throws }) => {
                    test(description, () => {
                        const rlp = new RLP.Profiler(profile);

                        expect(() => {
                            rlp.decodeObject(data);
                        }).toThrowError(throws);
                    });
                }
            );
        });
    });
});
