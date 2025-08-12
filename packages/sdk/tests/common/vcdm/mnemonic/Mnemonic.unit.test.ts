import { describe, expect, test } from '@jest/globals';
import { Address, Hex, Mnemonic, type WordlistSizeType } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import { Secp256k1 } from '@common/cryptography/secp256k1';
import {
    customRandomGeneratorWithXor,
    derivationPaths,
    words,
    wrongDerivationPath
} from './fixture';

/**
 * Test Mnemonic class.
 * @group unit/vcdm/mnemonic
 */
describe('Mnemonic', () => {
    describe('toPrivateKey', () => {
        describe('toPrivateKey - path defined', () => {
            derivationPaths
                .filter((path) => {
                    return path.derivationPath !== undefined;
                })
                .forEach((path) => {
                    test(path.testName, () => {
                        expect(
                            Hex.of(
                                Mnemonic.toPrivateKey(
                                    words,
                                    path.derivationPath
                                )
                            ).toString()
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
                                Mnemonic.toPrivateKey(
                                    words,
                                    path.derivationPath
                                )
                            ).toString()
                        ).toEqual(path.resultingPrivateKey);
                    });
                });
        });

        test('toPrivateKey - wrong path', () => {
            expect(() =>
                Mnemonic.toPrivateKey(words, wrongDerivationPath)
            ).toThrowError(IllegalArgumentError);
        });
    });

    describe('of', () => {
        test('of - custom parameters', () => {
            // Loop on custom lengths.
            [12, 15, 18, 21, 24].forEach(
                // Loop on custom generators of entropy.
                (length) => {
                    [
                        customRandomGeneratorWithXor,
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        Secp256k1.randomBytes,
                        undefined
                    ].forEach((randomGenerator) => {
                        // Generate mnemonic words of expected length
                        const words = Mnemonic.of(
                            length as WordlistSizeType,
                            randomGenerator
                        );
                        expect(words.length).toEqual(length);

                        // Validate mnemonic words
                        expect(Mnemonic.isValid(words)).toEqual(true);

                        // Derive private key from mnemonic words
                        expect(Mnemonic.toPrivateKey(words)).toBeDefined();
                        expect(Mnemonic.toPrivateKey(words).length).toEqual(32);
                        expect(
                            Secp256k1.isValidPrivateKey(
                                Mnemonic.toPrivateKey(words)
                            )
                        ).toEqual(true);

                        // Derive address from mnemonic words
                        expect(Address.ofMnemonic(words)).toBeDefined();
                        expect(
                            Address.ofMnemonic(words).toString().length
                        ).toEqual(42);
                        expect(
                            Address.isValid(
                                Address.ofMnemonic(words).toString()
                            )
                        ).toBe(true);
                    });
                }
            );
        });

        test('of - default length', () => {
            expect(Mnemonic.of().length).toEqual(12);
        });

        test('of - wrong length', () => {
            expect(() => {
                // @ts-expect-error - Wrong length error for testing purposes.
                Mnemonic.of(13);
            }).toThrowError();
        });
    });

    describe('bytes', () => {
        test('bytes - new mnemonic as bytes', () => {
            const mnemonic = new Mnemonic();
            expect(mnemonic.bytes).toBeInstanceOf(Uint8Array);
        });
    });

    describe('isValid', () => {
        test('isValid - false', () => {
            expect(Mnemonic.isValid('hello world')).toBeFalsy();
        });

        test('isValid - true', () => {
            expect(Mnemonic.isValid(Mnemonic.of())).toBeTruthy();
        });
    });

    describe('Unused methods tests', () => {
        test('bi - throw an error', () => {
            const mnemonic = new Mnemonic();
            expect(() => mnemonic.bi).toThrow();
        });
        test('n - throw an error', () => {
            const mnemonic = new Mnemonic();
            expect(() => mnemonic.n).toThrow();
        });
        test('compareTo - throw an error', () => {
            const mnemonic = new Mnemonic();
            expect(() => mnemonic.compareTo(new Mnemonic())).toThrow();
        });
        test('isEqual - throw an error', () => {
            const mnemonic = new Mnemonic();
            expect(() => mnemonic.isEqual(new Mnemonic())).toThrow();
        });
    });
});
