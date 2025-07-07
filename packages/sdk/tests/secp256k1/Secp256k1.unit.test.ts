import { describe, expect, test } from '@jest/globals';
import { HexUInt } from '@vcdm';
import {
    IllegalArgumentError,
    InvalidMessageHashError,
    InvalidPrivateKeyError,
    InvalidSignatureError
} from '@errors';
import { Secp256k1 } from '@secp256k1';
import { ZERO_BYTES } from '@utils';
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

/**
 * Test Secp256k1 class.
 * @group unit/Secp256k1
 */
describe('Secp256k1 class tests', () => {
    const invalid = new TextEncoder().encode('some_invalid_stuff');
    describe('Secp256k1 - compressPublicKey', () => {
        test('ok <- compressPublicKey - from compressed', () => {
            expect(
                Secp256k1.compressPublicKey(publicKeyCompressed)
            ).toStrictEqual(publicKeyCompressed);
        });

        test('ok <- compressPublicKey - from uncompressed', () => {
            expect(
                Secp256k1.compressPublicKey(publicKeyUncompressed)
            ).toStrictEqual(publicKeyCompressed);
        });
    });

    describe('Secp256k1 - derivePublicKey', () => {
        test('ok <- derivePublicKey - compressed', () => {
            expect(Secp256k1.derivePublicKey(privateKey)).toStrictEqual(
                Secp256k1.compressPublicKey(publicKeyUncompressed)
            );
        });

        test('ok <- derivePublicKey - uncompressed', () => {
            expect(Secp256k1.derivePublicKey(privateKey, false)).toStrictEqual(
                publicKeyUncompressed
            );
        });

        test('err <- derivePublicKey - error', () => {
            expect(() =>
                Secp256k1.derivePublicKey(ZERO_BYTES(32))
            ).toThrowError(InvalidPrivateKeyError);
        });
    });

    describe('Secp256k1 - generatePublicKey', () => {
        test('ok <- generatePrivateKey', async () => {
            const randomPrivateKey = await Secp256k1.generatePrivateKey();
            // The length of the private key should be 32 bytes
            expect(randomPrivateKey.length).toBe(32);
            // Private key should be valid
            expect(Secp256k1.isValidPrivateKey(randomPrivateKey)).toBe(true);
        });
    });

    describe('Secp256k1 - inflatePublicKey', () => {
        test('err <- inflatePublicKey - compressed', () => {
            expect(() =>
                Secp256k1.inflatePublicKey(
                    publicKeyCompressed.slice(0, publicKeyCompressed.length - 1)
                )
            ).toThrowError(IllegalArgumentError);
        });

        test('err <- inflatePublicKey - uncompressed', () => {
            expect(() =>
                Secp256k1.inflatePublicKey(
                    publicKeyUncompressed.slice(
                        0,
                        publicKeyUncompressed.length - 1
                    )
                )
            ).toThrowError(IllegalArgumentError);
        });

        test('ok <- inflatePublicKey - compressed', () => {
            expect(
                Secp256k1.inflatePublicKey(publicKeyCompressed)
            ).toStrictEqual(publicKeyUncompressed);
        });

        test('ok <- inflatePublicKey - uncompressed', () => {
            expect(
                Secp256k1.inflatePublicKey(publicKeyUncompressed)
            ).toStrictEqual(publicKeyUncompressed);
        });
    });

    describe('Secp256k1 - isValidMessageHash', () => {
        test('true <- isValidMessageHash', () => {
            validMessageHashes.forEach((messageHash: Uint8Array) => {
                expect(Secp256k1.isValidMessageHash(messageHash)).toBe(true);
            });
        });

        test('false <- isValidMessageHash', () => {
            invalidMessageHashes.forEach((messageHash: Uint8Array) => {
                expect(Secp256k1.isValidMessageHash(messageHash)).toBe(false);
            });
        });
    });

    describe('Secp256k1 - isValidPrivateKey', () => {
        test('true <- isValidPrivateKey', () => {
            validPrivateKeys.forEach((privateKey: Uint8Array) => {
                expect(Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            });
        });

        test('false <- isValidPrivateKey', () => {
            validPrivateKeys.forEach((privateKey: Uint8Array) => {
                expect(Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            });
        });
    });

    describe('Secp256k1 - sign', () => {
        test('ok <- sign', () => {
            expect(Secp256k1.sign(messageHashBuffer, privateKey)).toStrictEqual(
                signature
            );
        });

        test('err <- sign - invalid message hash', () => {
            expect(() => Secp256k1.sign(invalid, privateKey)).toThrowError(
                InvalidMessageHashError
            );
        });

        test('err <- sign - invalid private key', () => {
            expect(() =>
                Secp256k1.sign(
                    messageHashBuffer,
                    HexUInt.of(
                        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    ).bytes
                )
            ).toThrowError(InvalidPrivateKeyError);
        });
    });

    describe('Secp256k1 - randomBytes', () => {
        test('ok <- randomBytes - without parameters', () => {
            const result = Secp256k1.randomBytes();
            expect(result.length).toBeGreaterThan(0);
        });

        test('ok <- randomBytes - with param', () => {
            const result = Secp256k1.randomBytes(16);
            expect(result.length).toBe(16);
        });

        test('ok <- randomBytes - with param', () => {
            expect(() => Secp256k1.randomBytes(28)).toBeDefined();
        });
    });

    describe('Secp256k1 - recover', () => {
        test('ok <- recover', () => {
            expect(
                Secp256k1.recover(messageHashBuffer, signature)
            ).toStrictEqual(publicKeyUncompressed);
        });

        test('err <- recover - invalid message hash', () => {
            expect(() => Secp256k1.recover(invalid, signature)).toThrowError(
                InvalidMessageHashError
            );
        });

        test('err <- recover - invalid signature', () => {
            // Invalid signature
            expect(() =>
                Secp256k1.recover(messageHashBuffer, invalid)
            ).toThrowError(InvalidSignatureError);
        });

        test('err <- recover - failure', () => {
            // Invalid signature recovery
            const invalidSignatureRecovery = new Uint8Array(signature);
            invalidSignatureRecovery[64] = 8;
            expect(() =>
                Secp256k1.recover(messageHashBuffer, invalidSignatureRecovery)
            ).toThrowError(InvalidSignatureError);
        });
    });
});
