import { Hex } from '../../src/vcdm/Hex';
import { describe, expect, test } from '@jest/globals';
import {
    addressUtils,
    mnemonic,
    MNEMONIC_WORDLIST_ALLOWED_SIZES,
    secp256k1,
    type WordlistSizeType
} from '../../src';
import {
    customRandomGeneratorWithXor,
    derivationPaths,
    words,
    wrongDerivationPath
} from './fixture';
import { InvalidHDNode } from '@vechain/sdk-errors';

/**
 * Mnemonic tests
 * @group unit/mnemonic
 */
describe('mnemonic', () => {
    describe('deriveAddress', () => {
        describe('deriveAddress - path defined', () => {
            derivationPaths
                .filter((path) => {
                    return path.derivationPath !== undefined;
                })
                .forEach((path) => {
                    test(path.testName, () => {
                        expect(
                            mnemonic.deriveAddress(words, path.derivationPath)
                        ).toEqual(path.resultingAddress);
                    });
                });
        });

        describe('deriveAddress - path undefined', () => {
            derivationPaths
                .filter((path) => {
                    return path.derivationPath === undefined;
                })
                .forEach((path) => {
                    test(path.testName, () => {
                        expect(
                            mnemonic.deriveAddress(words, path.derivationPath)
                        ).toEqual(path.resultingAddress);
                    });
                });
        });

        test('deriveAddress - wrong path', () => {
            expect(() =>
                mnemonic.deriveAddress(words, wrongDerivationPath)
            ).toThrowError(InvalidHDNode);
        });
    });

    describe('derivePrivateKey', () => {
        describe('derivePrivateKey - path defined', () => {
            derivationPaths
                .filter((path) => {
                    return path.derivationPath !== undefined;
                })
                .forEach((path) => {
                    test(path.testName, () => {
                        expect(
                            Hex.of(
                                mnemonic.derivePrivateKey(
                                    words,
                                    path.derivationPath
                                )
                            ).hex
                        ).toEqual(path.resultingPrivateKey);
                    });
                });
        });

        describe('derivePrivateKey - path undefined', () => {
            derivationPaths
                .filter((path) => {
                    return path.derivationPath === undefined;
                })
                .forEach((path) => {
                    test(path.testName, () => {
                        expect(
                            Hex.of(
                                mnemonic.derivePrivateKey(
                                    words,
                                    path.derivationPath
                                )
                            ).hex
                        ).toEqual(path.resultingPrivateKey);
                    });
                });
        });

        test('derivePrivateKey - wrong path', () => {
            expect(() =>
                mnemonic.derivePrivateKey(words, wrongDerivationPath)
            ).toThrowError(InvalidHDNode);
        });
    });

    describe('generate', () => {
        test('generate - custom parameters', () => {
            // Loop on custom lengths.
            MNEMONIC_WORDLIST_ALLOWED_SIZES.forEach(
                // Loop on custom generators of entropy.
                (length: WordlistSizeType) => {
                    [
                        customRandomGeneratorWithXor,
                        secp256k1.randomBytes,
                        undefined
                    ].forEach((randomGenerator) => {
                        // Generate mnemonic words of expected length
                        const words = mnemonic.generate(
                            length,
                            randomGenerator
                        );
                        expect(words.length).toEqual(length);

                        // Validate mnemonic words
                        expect(mnemonic.isValid(words)).toEqual(true);

                        // Derive private key from mnemonic words
                        expect(mnemonic.derivePrivateKey(words)).toBeDefined();
                        expect(mnemonic.derivePrivateKey(words).length).toEqual(
                            32
                        );
                        expect(
                            secp256k1.isValidPrivateKey(
                                mnemonic.derivePrivateKey(words)
                            )
                        ).toEqual(true);

                        // Derive address from mnemonic words
                        expect(mnemonic.deriveAddress(words)).toBeDefined();
                        expect(mnemonic.deriveAddress(words).length).toEqual(
                            42
                        );
                        expect(
                            addressUtils.isAddress(
                                mnemonic.deriveAddress(words)
                            )
                        ).toBe(true);
                    });
                }
            );
        });

        test('generate - default length', () => {
            expect(mnemonic.generate().length).toEqual(12);
        });

        test('generate - wrong length', () => {
            expect(() => {
                // @ts-expect-error - Wrong length error for testing purposes.
                mnemonic.generate(13);
            }).toThrowError();
        });
    });

    describe('isValid', () => {
        test('isValid - false', () => {
            expect(mnemonic.isValid(['hello world'])).toBeFalsy();
        });

        test('isValid - true', () => {
            expect(mnemonic.isValid(mnemonic.generate())).toBeTruthy();
        });
    });
});
