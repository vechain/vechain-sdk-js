import { describe, expect, test } from '@jest/globals';
import { certificate } from '../../src';
import { cert, cert2, invalidSignature, sig, sig2 } from './fixture';
import {
    CertificateInvalidSignatureFormatError,
    CertificateInvalidSignerError,
    CertificateNotSignedError
} from '@vechain/sdk-errors';

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
        // Expecting successful verification with correct signature
        expect(() => {
            certificate.verify({ ...cert, signature: sig });
        }).not.toThrowError();

        // Expecting successful verification with uppercase signature
        expect(() => {
            certificate.verify({
                ...cert,
                signature: sig.toUpperCase()
            });
        }).not.toThrowError();

        // Expecting failure due to an incorrect signer address
        expect(() => {
            certificate.verify({
                ...cert,
                signature: sig,
                signer: '0x'
            });
        }).toThrowError(CertificateInvalidSignerError);

        // Expecting failure due to a missing signature
        expect(() => {
            certificate.verify({ ...cert, signer: '0x' });
        }).toThrowError(CertificateNotSignedError);

        // Expecting failure due to an invalid signature
        expect(() => {
            certificate.verify({
                ...cert,
                signature: invalidSignature,
                signer: '0x'
            });
        }).toThrowError(CertificateInvalidSignatureFormatError);
    });
});
