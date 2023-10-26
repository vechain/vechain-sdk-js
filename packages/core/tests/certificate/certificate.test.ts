import { describe, expect, test } from '@jest/globals';
import { blake2b256 } from '../../src/hash';
import { secp256k1 } from '../../src/secp256k1';
import { encode } from '../../src/certificate/certificate';
import { cert, cert2, privKey } from './fixture';

describe('Certificate Tests', () => {
    test('Should produce consistent encoding for two certificates', () => {
        expect(encode(cert)).toEqual(encode(cert2));
        expect(encode(cert)).toEqual(
            encode({ ...cert, signer: cert.signer.toUpperCase() })
        );

        const sig =
            '0x' +
            secp256k1.sign(blake2b256(encode(cert)), privKey).toString('hex');

        expect(encode({ ...cert, signature: sig })).toEqual(
            encode({
                ...cert,
                signature: sig.toUpperCase()
            })
        );
    });

    // test('Should correctly verify the certificate', () => {
    //     const sig =
    //         '0x' +
    //         secp256k1.sign(blake2b256(encode(cert)), privKey).toString('hex');

    //     // Expecting successful verification with correct signature
    //     expect(() => {
    //         verify({ ...cert, signature: sig });
    //     }).not.toThrow();

    //     // Expecting successful verification with uppercase signature
    //     expect(() => {
    //         verify({
    //             ...cert,
    //             signature: sig.toUpperCase()
    //         });
    //     }).not.toThrow();

    //     // Expecting failure due to incorrect signer address
    //     expect(() => {
    //         verify({
    //             ...cert,
    //             signature: sig,
    //             signer: '0x'
    //         });
    //     }).toThrow();

    //     // Creating an invalid signature by appending 'BAD'
    //     const invalidSignature =
    //         '0xBAD' +
    //         secp256k1.sign(blake2b256(encode(cert)), privKey).toString('hex');
    //     expect(() => {
    //         verify({
    //             ...cert,
    //             signature: invalidSignature,
    //             signer: '0x'
    //         });
    //     }).toThrow();

    //     // Expecting failure due to missing signature
    //     expect(() => {
    //         verify({ ...cert, signer: '0x' });
    //     }).toThrow();
    // });
});
