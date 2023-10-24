import { describe, expect, test } from '@jest/globals';
import { mnemonic } from '../../src/mnemonic/mnemonic';
import {
    customRandomGeneratorWithXor,
    derivationPaths,
    lenghtsMnemonicWords,
    words,
    wrongDerivationPath
} from './fixture';
import { address, secp256k1, type WordlistSizeType } from '../../src';
import { randomBytes } from 'crypto';

/**
 * Mnemonic tests
 * @group unit/mnemonic
 */
describe('Mnemonic', () => {
    /**
     * Mnemonic words generation
     */
    test('Generation', () => {
        // Default length
        expect(mnemonic.generate().length).toEqual(12);

        // Wrong length
        // @ts-expect-error - Wrong length error for testing purposes
        expect(() => mnemonic.generate(13)).toThrow();
    });

    /**
     * Test generation with custom lenghts and random generators
     */
    test('Custom generation parameters', () => {
        // Custom lengths
        lenghtsMnemonicWords.forEach((length: WordlistSizeType) => {
            // Custom random generators
            [customRandomGeneratorWithXor, randomBytes, undefined].forEach(
                (randomGenerator) => {
                    // Generate mnemonic words of expected length
                    const words = mnemonic.generate(length, randomGenerator);
                    expect(words.length).toEqual(length);

                    // Validate mnemonic words
                    expect(mnemonic.validate(words)).toEqual(true);

                    // Derive private key from mnemonic words
                    expect(mnemonic.derivePrivateKey(words)).toBeDefined();
                    expect(mnemonic.derivePrivateKey(words).length).toEqual(32);
                    expect(
                        secp256k1.isValidPrivateKey(
                            mnemonic.derivePrivateKey(words)
                        )
                    ).toEqual(true);

                    // Derive address from mnemonic words
                    expect(mnemonic.deriveAddress(words)).toBeDefined();
                    expect(mnemonic.deriveAddress(words).length).toEqual(42);
                    expect(
                        address.isAddress(mnemonic.deriveAddress(words))
                    ).toBe(true);
                }
            );
        });
    });

    /**
     * Mnemonic words validation
     */
    test('Validation', () => {
        expect(mnemonic.validate(['hello', 'world'])).toEqual(false);
        expect(mnemonic.validate(mnemonic.generate())).toEqual(true);
    });

    /**
     * Derivation form mnemonic words
     */
    describe('Derivation from mnemonic words', () => {
        /**
         * Correct derivation paths tests
         */
        derivationPaths.forEach((derivationPath) => {
            test(derivationPath.testName, () => {
                // Derivation path is defined
                if (derivationPath.derivationPath !== undefined) {
                    // Private key derivation
                    expect(
                        mnemonic
                            .derivePrivateKey(
                                words,
                                derivationPath.derivationPath
                            )
                            .toString('hex')
                    ).toEqual(derivationPath.resultingPriovateKey);

                    // Address derivation
                    expect(
                        mnemonic.deriveAddress(
                            words,
                            derivationPath.derivationPath
                        )
                    ).toEqual(derivationPath.resultingAddress);
                }
                // Derivation path is not defined
                else {
                    // Private key derivation
                    expect(
                        mnemonic.derivePrivateKey(words).toString('hex')
                    ).toEqual(derivationPath.resultingPriovateKey);

                    // Address derivation
                    expect(mnemonic.deriveAddress(words)).toEqual(
                        derivationPath.resultingAddress
                    );
                }
            });
        });

        /**
         * Private key derivation form mnemonic words - With a WRONG deep derivation path
         */
        test('Try to derive private key with a wrong deep derivation path', () => {
            expect(() =>
                mnemonic.derivePrivateKey(words, wrongDerivationPath)
            ).toThrow();
        });

        /**
         * Address derivation form mnemonic words - With a WRONG deep derivation path
         */
        test('try to derive address with a wrong deep derivation path', () => {
            expect(() =>
                mnemonic.deriveAddress(words, wrongDerivationPath)
            ).toThrow();
        });
    });
});
