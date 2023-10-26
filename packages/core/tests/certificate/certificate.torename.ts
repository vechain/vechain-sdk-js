import { describe, expect, test } from '@jest/globals';
import { blake2b256 } from '../../src/hash';
import { secp256k1 } from '../../src/secp256k1';
import { CertificateTestHelper } from './helpers';
import { encode, verify } from '../../src/certificate/certificate';

describe('Certificate Tests', () => {
    const helper = new CertificateTestHelper();

    test('should produce consistent encoding for two certificates', () => {
        expect(encode(helper.getCert())).toEqual(encode(helper.getCert2()));

        console.log('encode %s', encode(helper.getCert()));
        const msgHash = blake2b256(Buffer.from(encode(helper.getCert())));
        console.log(msgHash.length); // should be 32

        const msg = Buffer.from(encode(helper.getCert()));
        console.log(msg);
        console.log('length %d', msgHash.length); // should be 32

        const sig =
            '0x' +
            secp256k1
                .sign(
                    Buffer.from(
                        blake2b256(Buffer.from(encode(helper.getCert()))),
                        'hex'
                    ),
                    helper.getPrivKey()
                )
                .toString('hex');
        expect(encode({ ...helper.getCert(), signature: sig })).toEqual(
            encode({
                ...helper.getCert(),
                signature: sig.toUpperCase()
            })
        );
    });

    test('should correctly verify the certificate', () => {
        const sig =
            '0x' +
            secp256k1
                .sign(
                    Buffer.from(
                        blake2b256(Buffer.from(encode(helper.getCert()))),
                        'hex'
                    ),
                    helper.getPrivKey()
                )
                .toString('hex');

        // Expecting successful verification with correct signature
        expect(() => {
            verify({ ...helper.getCert(), signature: sig });
        }).not.toThrow();

        // Expecting successful verification with uppercase signature
        expect(() => {
            verify({
                ...helper.getCert(),
                signature: sig.toUpperCase()
            });
        }).not.toThrow();

        // Expecting failure due to incorrect signer address
        expect(() => {
            verify({
                ...helper.getCert(),
                signature: sig,
                signer: '0x'
            });
        }).toThrow();

        // Creating an invalid signature by appending 'BAD'
        const invalidSignature =
            '0xBAD' +
            secp256k1
                .sign(
                    Buffer.from(
                        blake2b256(Buffer.from(encode(helper.getCert()))),
                        'hex'
                    ),
                    helper.getPrivKey()
                )
                .toString('hex');
        expect(() => {
            verify({
                ...helper.getCert(),
                signature: invalidSignature,
                signer: '0x'
            });
        }).toThrow();

        // Expecting failure due to missing signature
        expect(() => {
            verify({ ...helper.getCert(), signer: '0x' });
        }).toThrow();
    });
});
