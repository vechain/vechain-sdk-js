import { addresses, words, wrongDerivationPath, wrongWords } from './fixture';
import { describe, expect, test } from '@jest/globals';
import {
    HDNode,
    ZERO_BUFFER,
    addressUtils,
    mnemonic,
    secp256k1,
    type WordlistSizeType
} from '../../src';
import {
    InvalidHDNodeChaincodeError,
    InvalidHDNodeDerivationPathError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodePublicKeyError
} from '@vechain/sdk-errors';

/**
 * Mnemonic tests
 * @group unit/hdnode
 */
describe('HDNode', () => {
    describe('fromMnemonic', () => {
        test('fromMnemonic - invalid - path', () => {
            expect(() =>
                HDNode.fromMnemonic(words, wrongDerivationPath)
            ).toThrowError(InvalidHDNodeDerivationPathError);
        });

        test('fromMnemonic - invalid - word list', () => {
            expect(() => HDNode.fromMnemonic(wrongWords)).toThrowError(
                InvalidHDNodeMnemonicsError
            );
        });

        test('fromMnemonic - invalid - word list leak check', () => {
            const words =
                'denial pet squirrel other broom bar gas better priority spoil cross'.split(
                    ' '
                );
            try {
                HDNode.fromMnemonic(words);
                expect(true).toBeFalsy();
            } catch (error) {
                (error as Error)
                    .toString()
                    .split(' ')
                    .forEach((word) => {
                        expect(words.includes(word)).toBeFalsy();
                    });
            }
        });

        test('fromMnemonic - valid - address sequence', () => {
            const root = HDNode.fromMnemonic(words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.publicKey).toBeDefined();
                expect(
                    addressUtils.fromPublicKey(child.publicKey as Uint8Array)
                ).toEqual(addresses[i]);
                // do we need <child>.address?
            }
        });

        test('fromMnemonic - valid - public key sequence', () => {
            const root = HDNode.fromMnemonic(words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });

        test('fromMnemonic - valid - word list - case insensitive', () => {
            const reference = HDNode.fromMnemonic(words);
            expect(reference.publicKey).toBeDefined();
            const lowercase = HDNode.fromMnemonic(
                words.map((w) => w.toLowerCase())
            );
            expect(lowercase.publicKey).toBeDefined();
            expect(
                addressUtils.fromPublicKey(lowercase.publicKey as Uint8Array)
            ).toBe(
                addressUtils.fromPublicKey(reference.publicKey as Uint8Array)
            );
            const uppercase = HDNode.fromMnemonic(
                words.map((w) => w.toUpperCase())
            );
            expect(uppercase.publicKey).toBeDefined();
            expect(
                addressUtils.fromPublicKey(uppercase.publicKey as Uint8Array)
            ).toBe(
                addressUtils.fromPublicKey(reference.publicKey as Uint8Array)
            );
        });

        test('fromMnemonic - valid - word list - multiple lengths', () => {
            new Array<WordlistSizeType>(12, 15, 18, 21, 24).forEach(
                (length: WordlistSizeType) => {
                    const hdKey = HDNode.fromMnemonic(
                        mnemonic.generate(length)
                    );
                    expect(hdKey.privateKey).toBeDefined();
                    expect(
                        secp256k1.isValidPrivateKey(
                            hdKey.privateKey as Uint8Array
                        )
                    ).toBeTruthy();
                    expect(hdKey.publicKey).toBeDefined();
                    expect(hdKey.publicKey).toEqual(
                        secp256k1.derivePublicKey(
                            hdKey.privateKey as Uint8Array
                        )
                    );
                }
            );
        });
    });

    describe('derivePrivateKey', () => {
        test('derivePrivateKey - invalid - chain code', () => {
            expect(() =>
                HDNode.fromPrivateKey(ZERO_BUFFER(32), ZERO_BUFFER(31))
            ).toThrowError(InvalidHDNodeChaincodeError);
        });

        test('derivePrivateKey - invalid - private key', () => {
            expect(() =>
                HDNode.fromPrivateKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
            ).toThrowError(InvalidHDNodePrivateKeyError);
        });

        test('derivePrivateKey - valid - address sequence', () => {
            const root = HDNode.fromMnemonic(words);
            expect(root.privateKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDNode.fromPrivateKey(
                root.privateKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(
                    addressUtils.fromPublicKey(child.publicKey as Uint8Array)
                ).toEqual(addresses[i]);
            }
        });

        test('derivePrivateKey - valid - public key sequence', () => {
            const root = HDNode.fromMnemonic(words);
            expect(root.privateKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDNode.fromPrivateKey(
                root.privateKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });
    });

    describe('derivePublicKey', () => {
        test('derivePublicKey - invalid - chain code', () => {
            expect(() =>
                HDNode.fromPublicKey(ZERO_BUFFER(32), ZERO_BUFFER(31))
            ).toThrowError(InvalidHDNodeChaincodeError);
        });

        test('derivePublicKey - invalid - public key', () => {
            expect(() =>
                HDNode.fromPublicKey(ZERO_BUFFER(31), ZERO_BUFFER(32))
            ).toThrowError(InvalidHDNodePublicKeyError);
        });

        test(`derivePublicKey - valid - address sequence, no private key`, () => {
            const root = HDNode.fromMnemonic(words);
            expect(root.publicKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDNode.fromPublicKey(
                root.publicKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(child.privateKey).toBeNull();
                expect(child.publicKey).toBeDefined();
                expect(
                    addressUtils.fromPublicKey(child.publicKey as Uint8Array)
                ).toEqual(addresses[i]);
            }
        });
    });
});
