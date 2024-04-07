import { describe, test, expect } from '@jest/globals';
import { Hex, secp256k1, ZERO_BYTES } from '../../src';
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
    InvalidSecp256k1MessageHashError,
    InvalidSecp256k1PrivateKeyError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError
} from '@vechain/sdk-errors';

/**
 * Secp256k1 tests
 * @group unit/secp256k1
 */
describe('secp256k1', () => {
    test('inflate', () => {
        console.log(Hex.of(secp256k1.inflatePublicKey(publicKeyCompressed)));
    });

    describe('secp256k1 - compressPublicKey', () => {
        test('secp256k1 - compressPublicKey - from compressed', () => {
            expect(
                Hex.of(secp256k1.compressPublicKey(publicKeyCompressed))
            ).toBe(Hex.of(publicKeyCompressed));
        });

        test('secp256k1 - compressPublicKey - from uncompressed', () => {
            expect(
                Hex.of(secp256k1.compressPublicKey(publicKeyUncompressed))
            ).toBe(Hex.of(publicKeyCompressed));
        });
    });

    describe('secp256k1 - derivePublicKey', () => {
        test('secp256k1 - derivePublicKey - compressed', () => {
            expect(Hex.of(secp256k1.derivePublicKey(privateKey))).toBe(
                Hex.of(secp256k1.compressPublicKey(publicKeyUncompressed))
            );
        });

        test('secp256k1 - derivePublicKey - uncompressed', () => {
            expect(Hex.of(secp256k1.derivePublicKey(privateKey, false))).toBe(
                Hex.of(publicKeyUncompressed)
            );
        });

        test('secp256k1 - derivePublicKey - error', () => {
            expect(() =>
                secp256k1.derivePublicKey(ZERO_BYTES(32))
            ).toThrowError(InvalidSecp256k1PrivateKeyError);
        });
    });

    describe('secp256k1 - generatePublicKey', () => {
        test('secp256k1 - generatePrivateKey', () => {
            const randomPrivateKey = secp256k1.generatePrivateKey();
            // Length of private key should be 32 bytes
            expect(randomPrivateKey.length).toBe(32);
            // Private key should be valid
            expect(secp256k1.isValidPrivateKey(randomPrivateKey)).toBe(true);
        });
    });

    describe('secp256k1 - isValidMessageHash', () => {
        test('secp256k1 - isValidMessageHash - true', () => {
            validMessageHashes.forEach((messageHash: Buffer) => {
                expect(secp256k1.isValidMessageHash(messageHash)).toBe(true);
            });
        });

        test('secp256k1 - isValidMessageHash - false', () => {
            invalidMessageHashes.forEach((messageHash: Buffer) => {
                expect(secp256k1.isValidMessageHash(messageHash)).toBe(false);
            });
        });
    });

    describe('secp256k1 - isValidPrivateKey', () => {
        test('secp256k1 - isValidPrivateKey - true', () => {
            validPrivateKeys.forEach((privateKey: Buffer) => {
                expect(secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            });
        });

        test('secp256k1 - isValidPrivateKey - false', () => {
            validPrivateKeys.forEach((privateKey: Buffer) => {
                expect(secp256k1.isValidPrivateKey(privateKey)).toBe(true);
            });
        });
    });

    describe('secp256k1 - sign', () => {
        test('secp256k1 - sign - success', () => {
            expect(secp256k1.sign(messageHashBuffer, privateKey)).toStrictEqual(
                signature
            );
        });

        test('secp256k1 - sign - failure - invalid message hash', () => {
            expect(() =>
                secp256k1.sign(
                    Buffer.from('some_invalid_stuff', 'hex'),
                    privateKey
                )
            ).toThrowError(InvalidSecp256k1MessageHashError);
        });

        test('secp256k1 - sign - failure - invalid private key', () => {
            expect(() =>
                secp256k1.sign(
                    messageHashBuffer,
                    Buffer.from(
                        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                        'hex'
                    )
                )
            ).toThrowError(InvalidSecp256k1PrivateKeyError);
        });
    });

    describe('secp256k1 - randomBytes', () => {
        test('secp256k1 - randomBytes - without parameters', () => {
            const result = secp256k1.randomBytes();
            expect(result.length).toBeGreaterThan(0);
        });

        test('secp256k1 - randomBytes - with param', () => {
            const result = secp256k1.randomBytes(16);
            expect(result.length).toBe(16);
        });
    });

    describe('secp256k1 - recover', () => {
        test('secp256k1 - recover - success', () => {
            expect(
                Buffer.from(secp256k1.recover(messageHashBuffer, signature))
            ).toStrictEqual(publicKeyUncompressed);
        });

        test('secp256k1 - recover - invalid message hash', () => {
            expect(() =>
                secp256k1.recover(
                    Buffer.from('some_invalid_stuff', 'hex'),
                    signature
                )
            ).toThrowError(InvalidSecp256k1MessageHashError);
        });

        test('secp256k1 - recover - invalid signature', () => {
            // Invalid signature
            expect(() =>
                secp256k1.recover(
                    messageHashBuffer,
                    Buffer.from('some_invalid_stuff', 'hex')
                )
            ).toThrowError(InvalidSecp256k1SignatureError);
        });

        test('secp256k1 - recover - failure', () => {
            // Invalid signature recovery
            const invalidSignatureRecovery = new Uint8Array(signature);
            invalidSignatureRecovery[64] = 8;
            expect(() =>
                secp256k1.recover(
                    messageHashBuffer,
                    Buffer.from(invalidSignatureRecovery)
                )
            ).toThrowError(InvalidSecp256k1SignatureRecoveryError);
        });
    });
});
