import { describe, test, expect } from '@jest/globals';
import { secp256k1 } from '../src/secp256k1/secp256k1';
import { keccak256 } from '../src/hash/keccak256';
import { ERRORS } from '../src/utils/errors';

// Constants
const privateKey = Buffer.from(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
    'hex'
);
const publicKey = Buffer.from(
    '04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f',
    'hex'
);
const signature = Buffer.from(
    'f8fe82c74f9e1f5bf443f8a7f8eb968140f554968fdcab0a6ffe904e451c8b9244be44bccb1feb34dd20d9d8943f8c131227e55861736907b02d32c06b934d7200',
    'hex'
);
const messageHashBuffer = Buffer.from(keccak256('hello world').slice(2), 'hex');

/**
 * Secp256k1 tests
 */
describe('Secp256k1', () => {
    /**
     * Check if private key is valid
     */
    test('valid private key', () => {
        const validPrivateKeys = [
            // PLEASE: Don't use this private key for your wallet :D
            Buffer.from(
                '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
                'hex'
            )
        ];
        const invalidPrivateKeys = [
            Buffer.from(
                'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                'hex'
            ),
            Buffer.from(
                'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
                'hex'
            ),
            Buffer.alloc(32, 0), // 00...00,
            Buffer.from('some_invalid_stuff', 'hex')
        ];
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
        const validMessageHashes = [
            // NOTE: slice(2) is used to remove 0x prefix
            messageHashBuffer
        ];
        const invalidMessageHashes = [Buffer.from('some_invalid_stuff', 'hex')];
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
        const randomPrivateKey = secp256k1.generate();

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
        expect(secp256k1.derive(privateKey).toString('hex')).toBe(
            publicKey.toString('hex')
        );

        // Corrext public key length (65 bytes because first byte is 0)
        expect(secp256k1.derive(privateKey).length).toBe(65);

        // Invalid private key
        expect(() => secp256k1.derive(Buffer.alloc(32, 0))).toThrowError(
            ERRORS.SECP256K1.INVALID_PRIVATE_KEY
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
        ).toThrowError(ERRORS.SECP256K1.INVALID_MESSAGE_HASH);

        // Invalid private key
        expect(() =>
            secp256k1.sign(
                messageHashBuffer,
                Buffer.from(
                    'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                    'hex'
                )
            )
        ).toThrowError(ERRORS.SECP256K1.INVALID_PRIVATE_KEY);
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
        ).toThrowError(ERRORS.SECP256K1.INVALID_MESSAGE_HASH);

        // Invalid signature
        expect(() =>
            secp256k1.recover(
                messageHashBuffer,
                Buffer.from('some_invalid_stuff', 'hex')
            )
        ).toThrowError(ERRORS.SECP256K1.INVALID_SIGNATURE);

        // Invalid signature recovery
        const invalidSignatureRecovery = new Uint8Array(signature);
        invalidSignatureRecovery[64] = 8;
        expect(() =>
            secp256k1.recover(
                messageHashBuffer,
                Buffer.from(invalidSignatureRecovery)
            )
        ).toThrowError(ERRORS.SECP256K1.INVALID_SIGNATURE_RECOVERY);
    });

    /**
     * Public key format conversion
     */
    test('public key format conversion', () => {
        expect(
            secp256k1.extendedPublicKeyToArray(publicKey, true)
        ).toStrictEqual([
            3, 185, 14, 155, 178, 97, 115, 135, 235, 164, 80, 44, 115, 13, 230,
            90, 51, 135, 142, 243, 132, 164, 111, 16, 150, 216, 111, 45, 161,
            144, 67, 48, 74
        ]);
    });
});
