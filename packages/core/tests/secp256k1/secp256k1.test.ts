import { describe, test, expect } from '@jest/globals';
import { ZERO_BUFFER, secp256k1 } from '../../src';
import {
    invalidMessageHashes,
    invalidPrivateKeys,
    messageHashBuffer,
    privateKey,
    publicKey,
    puclicKeyAsArray,
    signature,
    validMessageHashes,
    validPrivateKeys
} from './fixture';
import {
    InvalidSecp256k1MessageHashError,
    InvalidSecp256k1PrivateKeyError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError
} from '@vechainfoundation/errors';

/**
 * Secp256k1 tests
 * @group unit/secp256k1
 */
describe('Secp256k1', () => {
    /**
     * Check if private key is valid
     */
    test('valid private key', () => {
        validPrivateKeys.forEach((privateKey: Buffer) => {
            expect(secp256k1.isValidPrivateKey(privateKey)).toBe(true);
        });
        invalidPrivateKeys.forEach((privateKey: Buffer) => {
            expect(secp256k1.isValidPrivateKey(privateKey)).toBe(false);
        });
    });

    /**
     * Check if message hash is valid
     */
    test('valid message hash', () => {
        validMessageHashes.forEach((messageHash: Buffer) => {
            expect(secp256k1.isValidMessageHash(messageHash)).toBe(true);
        });
        invalidMessageHashes.forEach((messageHash: Buffer) => {
            expect(secp256k1.isValidMessageHash(messageHash)).toBe(false);
        });
    });

    /**
     * Generate a random secure private key
     */
    test('generate', () => {
        const randomPrivateKey = secp256k1.generatePrivateKey();

        // Length of private key should be 32 bytes
        expect(randomPrivateKey.length).toBe(32);

        // Private key should be valid
        expect(secp256k1.isValidPrivateKey(randomPrivateKey)).toBe(true);
    });

    /**
     * Derive public key from private key
     */
    test('derive', () => {
        // Correct derivation
        expect(secp256k1.derivePublicKey(privateKey).toString('hex')).toBe(
            publicKey.toString('hex')
        );

        // Corrext public key length (65 bytes because first byte is 0)
        expect(secp256k1.derivePublicKey(privateKey).length).toBe(65);

        // Invalid private key
        expect(() => secp256k1.derivePublicKey(ZERO_BUFFER(32))).toThrowError(
            InvalidSecp256k1PrivateKeyError
        );
    });

    /**
     * Sign message hash
     */
    test('sign', () => {
        expect(secp256k1.sign(messageHashBuffer, privateKey)).toStrictEqual(
            signature
        );

        // Invalid message hash
        expect(() =>
            secp256k1.sign(Buffer.from('some_invalid_stuff', 'hex'), privateKey)
        ).toThrowError(InvalidSecp256k1MessageHashError);

        // Invalid private key
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

    /**
     * Recover public key from message hash and signature
     */
    test('recover', () => {
        expect(secp256k1.recover(messageHashBuffer, signature)).toStrictEqual(
            publicKey
        );

        // Invalid message hash
        expect(() =>
            secp256k1.recover(
                Buffer.from('some_invalid_stuff', 'hex'),
                signature
            )
        ).toThrowError(InvalidSecp256k1MessageHashError);

        // Invalid signature
        expect(() =>
            secp256k1.recover(
                messageHashBuffer,
                Buffer.from('some_invalid_stuff', 'hex')
            )
        ).toThrowError(InvalidSecp256k1SignatureError);

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

    /**
     * Public key format conversion
     */
    test('public key format conversion', () => {
        expect(
            secp256k1.extendedPublicKeyToArray(publicKey, true)
        ).toStrictEqual(puclicKeyAsArray);
    });
});
