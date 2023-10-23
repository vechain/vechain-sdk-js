import { describe, expect, test } from '@jest/globals';
import { mnemonic } from '../../src/mnemonic/mnemonic';
import { derivationPaths, words, wrongDerivationPath } from './fixture';

/**
 * Mnemonic tests
 * @group unit/mnemonic
 */
describe('Mnemonic', () => {
    /**
     * Mnemonic words generation
     */
    test('Generation', () => {
        expect(mnemonic.generate().phrase.split(' ').length).toEqual(12);
    });

    /**
     * Mnemonic words validation
     */
    test('Validation', () => {
        expect(mnemonic.validate(['hello', 'world'])).toEqual(false);
        expect(
            mnemonic.validate(mnemonic.generate().phrase.split(' '))
        ).toEqual(true);
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
