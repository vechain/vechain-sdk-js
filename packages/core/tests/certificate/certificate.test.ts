import { describe, expect, test } from '@jest/globals';
import { blake2b256 } from '../../src/hash';
import { secp256k1 } from '../../src/secp256k1';
import { certificate } from '../../src/certificate/certificate';
import { cert, cert2, privKey } from './fixture';

/**
 * Certificate tests
 *
 * @group unit/certificate
 */
describe('Certificate Tests', () => {
    test('Should produce consistent encoding for two certificates', () => {
        expect(certificate.encode(cert)).toEqual(certificate.encode(cert2));

        const sig =
            '0x' +
            secp256k1
                .sign(blake2b256(certificate.encode(cert)), privKey)
                .toString('hex');

        expect(certificate.encode({ ...cert, signature: sig })).toEqual(
            certificate.encode({
                ...cert,
                signature: sig
            })
        );
    });

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

        // Expecting failure due to incorrect signer address
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
        expect(() => {
            certificate.verify({
                ...cert,
                signature: invalidSignature,
                signer: '0x'
            });
        }).toThrow();

        // Expecting failure due to missing signature
        expect(() => {
            certificate.verify({ ...cert, signer: '0x' });
        }).toThrow();
    });
});
