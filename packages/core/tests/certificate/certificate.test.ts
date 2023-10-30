import { describe, expect, test } from '@jest/globals';
import { blake2b256 } from '../../src/hash';
import { secp256k1 } from '../../src/secp256k1';
import { certificate } from '../../src/certificate';
import { cert, cert2, privKey } from './fixture';

/**
 * Unit tests for the Certificate module.
 *
 * @group unit/certificate
 */
describe('Certificate Tests', () => {
    /**
     * Test Encoding  of Certificate
     */
    test('Should produce consistent encoding for two identical certificates', () => {
        // verifies that the encoding of two identical certificates is the same

        expect(certificate.encode(cert)).toStrictEqual(
            certificate.encode(cert2)
        );

        const sig =
            '0x' +
            secp256k1
                .sign(blake2b256(certificate.encode(cert)), privKey)
                .toString('hex');
        const sig2 =
            '0x' +
            secp256k1
                .sign(blake2b256(certificate.encode(cert2)), privKey)
                .toString('hex');
        // verifies that the encoding of two identical certificates is the same after applying the signature
        expect(certificate.encode({ ...cert, signature: sig })).toEqual(
            certificate.encode({
                ...cert2,
                signature: sig2
            })
        );
    });
    /**
     * Test Verification of Certificate
     */
    test('Should correctly verify the certificate', () => {
        const sig =
            '0x' +
            secp256k1
                .sign(blake2b256(certificate.encode(cert)), privKey)
                .toString('hex');

        // Expecting successful verification with correct signature
        expect(() => {
            certificate.verify({ ...cert, signature: sig });
        }).not.toThrow();

        // Expecting successful verification with uppercase signature
        expect(() => {
            certificate.verify({
                ...cert,
                signature: sig.toUpperCase()
            });
        }).not.toThrow();

        // Expecting failure due to an incorrect signer address
        expect(() => {
            certificate.verify({
                ...cert,
                signature: sig,
                signer: '0x'
            });
        }).toThrow();

        // Creating an invalid signature by appending 'BAD'
        const invalidSignature =
            '0xBAD' +
            secp256k1
                .sign(blake2b256(certificate.encode(cert)), privKey)
                .toString('hex');

        // Expecting failure due to an invalid signature
        expect(() => {
            certificate.verify({
                ...cert,
                signature: invalidSignature,
                signer: '0x'
            });
        }).toThrow();

        // Expecting failure due to a missing signature
        expect(() => {
            certificate.verify({ ...cert, signer: '0x' });
        }).toThrow();
    });
});
