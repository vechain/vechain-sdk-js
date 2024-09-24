import { describe, expect, test } from '@jest/globals';
import { Secp256k1, ZERO_BYTES } from '../../src';
import {
    invalidMessageHashes,
    messageHashBuffer,
    privateKey,
    publicKeyCompressed,
    publicKeyUncompressed,
    signature,
    validMessageHashes,
    validPrivateKeys
} from './fixture';
import {
    InvalidSecp256k1MessageHash,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature
} from '@vechain/sdk-errors';

/**
 * Test Secp256k1 class.
 * @group unit/Secp256k1
 */
describe('Secp256k1 class tests', () => {
    describe('Secp256k1 - compressPublicKey', () => {
        test('Secp256k1 - compressPublicKey - from compressed', () => {
            expect(
                Secp256k1.compressPublicKey(publicKeyCompressed)
            ).toStrictEqual(publicKeyCompressed);
        });

        test('Secp256k1 - compressPublicKey - from uncompressed', () => {
            expect(
                Secp256k1.compressPublicKey(publicKeyUncompressed)
            ).toStrictEqual(publicKeyCompressed);
        });
    });

    describe('Secp256k1 - derivePublicKey', () => {
        test('Secp256k1 - derivePublicKey - compressed', () => {
            expect(Secp256k1.derivePublicKey(privateKey)).toStrictEqual(
                Secp256k1.compressPublicKey(publicKeyUncompressed)
            );
        });

        test('Secp256k1 - derivePublicKey - uncompressed', () => {
            expect(Secp256k1.derivePublicKey(privateKey, false)).toStrictEqual(
                publicKeyUncompressed
            );
        });

        test('Secp256k1 - derivePublicKey - error', () => {
            expect(() =>
                Secp256k1.derivePublicKey(ZERO_BYTES(32))
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('Secp256k1 - generatePublicKey', () => {
        test('Secp256k1 - generatePrivateKey', async () => {
            const randomPrivateKey = await Secp256k1.generatePrivateKey();
            // Length of private key should be 32 bytes
            expect(randomPrivateKey.length).toBe(32);
            // Private key should be valid
            expect(Secp256k1.isValidPrivateKey(randomPrivateKey)).toBe(true);
        });
    });

    describe('Secp256k1 - inflatePublicKey', () => {
        test('Secp256k1 - inflatePublicKey - compressed', () => {
            expect(
                Secp256k1.inflatePublicKey(publicKeyCompressed)
            ).toStrictEqual(publicKeyUncompressed);
        });

        test('Secp256k1 - inflatePublicKey - uncompressed', () => {
            expect(
                Secp256k1.inflatePublicKey(publicKeyUncompressed)
            ).toStrictEqual(publicKeyUncompressed);
        });
    });

    describe('Secp256k1 - isValidMessageHash', () => {
        test('Secp256k1 - isValidMessageHash - true', () => {
            validMessageHashes.forEach((messageHash: Uint8Array) => {
                expect(Secp256k1.isValidMessageHash(messageHash)).toBe(true);
            });
        });

        test('Secp256k1 - isValidMessageHash - false', () => {
            invalidMessageHashes.forEach((messageHash: Uint8Array) => {
                expect(Secp256k1.isValidMessageHash(messageHash)).toBe(false);
            });
        });
    });

    describe('Secp256k1 - isValidPrivateKey', () => {
        test('Secp256k1 - isValidPrivateKey - true', () => {
            validPrivateKeys.forEach((privateKey: Uint8Array) => {
                expect(Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            });
        });

        test('Secp256k1 - isValidPrivateKey - false', () => {
            validPrivateKeys.forEach((privateKey: Uint8Array) => {
                expect(Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            });
        });
    });

    describe('Secp256k1 - sign', () => {
        test('Secp256k1 - sign - success', () => {
            expect(Secp256k1.sign(messageHashBuffer, privateKey)).toStrictEqual(
                signature
            );
        });

        test('Secp256k1 - sign - failure - invalid message hash', () => {
            expect(() =>
                Secp256k1.sign(
                    Buffer.from('some_invalid_stuff', 'hex'),
                    privateKey
                )
            ).toThrowError(InvalidSecp256k1MessageHash);
        });

        test('Secp256k1 - sign - failure - invalid private key', () => {
            expect(() =>
                Secp256k1.sign(
                    messageHashBuffer,
                    Buffer.from(
                        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                        'hex'
                    )
                )
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('Secp256k1 - randomBytes', () => {
        test('Secp256k1 - randomBytes - without parameters', () => {
            const result = Secp256k1.randomBytes();
            expect(result.length).toBeGreaterThan(0);
        });

        test('Secp256k1 - randomBytes - with param', () => {
            const result = Secp256k1.randomBytes(16);
            expect(result.length).toBe(16);
        });

        test('Secp256k1 - randomBytes - with param', () => {
            expect(() => Secp256k1.randomBytes(28)).toBeDefined();
        });
    });

    describe('Secp256k1 - recover', () => {
        test('Secp256k1 - recover - success', () => {
            expect(
                Secp256k1.recover(messageHashBuffer, signature)
            ).toStrictEqual(publicKeyUncompressed);
        });

        test('Secp256k1 - recover - invalid message hash', () => {
            expect(() =>
                Secp256k1.recover(
                    Buffer.from('some_invalid_stuff', 'hex'),
                    signature
                )
            ).toThrowError(InvalidSecp256k1MessageHash);
        });

        test('Secp256k1 - recover - invalid signature', () => {
            // Invalid signature
            expect(() =>
                Secp256k1.recover(
                    messageHashBuffer,
                    Buffer.from('some_invalid_stuff', 'hex')
                )
            ).toThrowError(InvalidSecp256k1Signature);
        });

        test('Secp256k1 - recover - failure', () => {
            // Invalid signature recovery
            const invalidSignatureRecovery = new Uint8Array(signature);
            invalidSignatureRecovery[64] = 8;
            expect(() =>
                Secp256k1.recover(
                    messageHashBuffer,
                    Buffer.from(invalidSignatureRecovery)
                )
            ).toThrowError(InvalidSecp256k1Signature);
        });
    });
});
