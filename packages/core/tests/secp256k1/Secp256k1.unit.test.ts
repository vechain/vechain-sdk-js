import { describe, expect, test } from '@jest/globals';
import {
    InvalidSecp256k1MessageHash,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature
} from '@vechain/sdk-errors';
import { Keccak256, Secp256k1, Txt, ZERO_BYTES } from '../../src';
import * as n_utils from '@noble/curves/abstract/utils';

const HASHES = {
    invalid: Txt.of('some_invalid_stuff').bytes,
    valid: Keccak256.of(Txt.of('hello world').bytes).bytes
};

const KEYS = {
    private: {
        invalid: n_utils.hexToBytes(
            'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        ),
        valid: n_utils.hexToBytes(
            '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
        )
    },
    public: {
        compressed: n_utils.hexToBytes(
            '03b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304a'
        ),
        uncompressed: n_utils.hexToBytes(
            '04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f'
        )
    }
};

const SIGNATURES = {
    valid: n_utils.hexToBytes(
        'f8fe82c74f9e1f5bf443f8a7f8eb968140f554968fdcab0a6ffe904e451c8b9244be44bccb1feb34dd20d9d8943f8c131227e55861736907b02d32c06b934d7200'
    )
};

/**
 * Test Secp256k1 class.
 * @group unit/Secp256k1
 */
describe('Secp256k1 class tests', () => {
    describe('compressPublicKey', () => {
        test('ok <- compressed', () => {
            expect(
                Secp256k1.compressPublicKey(KEYS.public.compressed)
            ).toStrictEqual(KEYS.public.compressed);
        });

        test('ok <- uncompressed', () => {
            expect(
                Secp256k1.compressPublicKey(KEYS.public.uncompressed)
            ).toStrictEqual(KEYS.public.compressed);
        });
    });

    describe('derivePublicKey', () => {
        test('ok <- compressed', () => {
            expect(Secp256k1.derivePublicKey(KEYS.private.valid)).toStrictEqual(
                Secp256k1.compressPublicKey(KEYS.public.compressed)
            );
        });

        test('ok <- uncompressed', () => {
            expect(
                Secp256k1.derivePublicKey(KEYS.private.valid, false)
            ).toStrictEqual(KEYS.public.uncompressed);
        });

        test('error <- invalid key', () => {
            expect(() =>
                Secp256k1.derivePublicKey(ZERO_BYTES(32))
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('generatePrivateKey', () => {
        test('ok <- noble library', async () => {
            const privateKey = await Secp256k1.generatePrivateKey();
            // Length of private key should be 32 bytes
            expect(privateKey.length).toBe(32);
            // Private key should be valid
            expect(Secp256k1.isValidPrivateKey(privateKey)).toBe(true);
        });

        test('error <- mock no hw support for cryptography', async () => {
            jest.spyOn(Secp256k1, 'generatePrivateKey').mockImplementation(
                () => {
                    throw new InvalidSecp256k1PrivateKey(
                        'Secp256k1.generatePrivateKey',
                        'Private key generation failed: ensure you have a secure random number generator available at runtime.',
                        undefined
                    );
                }
            );
            await expect(
                async () => await Secp256k1.generatePrivateKey()
            ).rejects.toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('inflatePublicKey', () => {
        test('ok <- compressed', () => {
            expect(
                Secp256k1.inflatePublicKey(KEYS.public.compressed)
            ).toStrictEqual(KEYS.public.uncompressed);
        });

        test('ok <- uncompressed', () => {
            expect(
                Secp256k1.inflatePublicKey(KEYS.public.uncompressed)
            ).toStrictEqual(KEYS.public.uncompressed);
        });
    });

    describe('isValidMessageHash', () => {
        test('true <- valid', () => {
            expect(Secp256k1.isValidMessageHash(HASHES.valid)).toBe(true);
        });

        test('false <- invalid', () => {
            expect(Secp256k1.isValidMessageHash(HASHES.invalid)).toBe(false);
        });
    });

    describe('isValidPrivateKey', () => {
        test('true <- valid', () => {
            expect(Secp256k1.isValidPrivateKey(KEYS.private.valid)).toBe(true);
        });

        test('false <- invalid', () => {
            expect(Secp256k1.isValidPrivateKey(KEYS.private.invalid)).toBe(
                false
            );
        });
    });

    describe('sign', () => {
        test('ok - valid hash', () => {
            expect(
                Secp256k1.sign(HASHES.valid, KEYS.private.valid)
            ).toStrictEqual(SIGNATURES.valid);
        });

        test('error <- invalid hash', () => {
            expect(() =>
                Secp256k1.sign(HASHES.invalid, KEYS.private.valid)
            ).toThrowError(InvalidSecp256k1MessageHash);
        });

        test('error <- invalid private key', () => {
            expect(() =>
                Secp256k1.sign(HASHES.valid, KEYS.private.invalid)
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });
    });

    describe('randomBytes', () => {
        test('ok <- default', () => {
            const result = Secp256k1.randomBytes();
            expect(result.length).toBe(32);
        });

        test('ok <- set length', () => {
            const result = Secp256k1.randomBytes(16);
            expect(result.length).toBe(16);
        });
    });

    describe('recover', () => {
        test('ok < - valid', () => {
            expect(
                Secp256k1.recover(HASHES.valid, SIGNATURES.valid)
            ).toStrictEqual(KEYS.public.uncompressed);
        });

        test('error <- invalid hash', () => {
            expect(() =>
                Secp256k1.recover(HASHES.invalid, SIGNATURES.valid)
            ).toThrowError(InvalidSecp256k1MessageHash);
        });

        test('error <- invalid signature', () => {
            // Forge an invalid signature...
            const invalidSignature = new Uint8Array(SIGNATURES.valid);
            // ... altering the last byte.
            invalidSignature[64] = 8;
            expect(() =>
                Secp256k1.recover(HASHES.valid, invalidSignature)
            ).toThrowError(InvalidSecp256k1Signature);
        });
    });
});
