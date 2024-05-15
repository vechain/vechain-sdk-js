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
describe('certificate', () => {
    describe('encode', () => {
        test('consistent between two certificates - before signature', () => {
            expect(certificate.encode(cert)).toStrictEqual(
                certificate.encode(cert2)
            );
        });

        test('consistent between two certificates - after signature', () => {
            expect(certificate.encode({ ...cert, signature: sig })).toEqual(
                certificate.encode({
                    ...cert2,
                    signature: sig2
                })
            );
        });
    });

    describe('verify', () => {
        test('valid - because signature', () => {
            expect(() => {
                certificate.verify({ ...cert, signature: sig });
            }).not.toThrowError();
        });

        test('valid - because signature - uppercase', () => {
            expect(() => {
                certificate.verify({
                    ...cert,
                    signature: sig.toUpperCase()
                });
            }).not.toThrowError();
        });

        test('invalid - because signer address', () => {
            expect(() => {
                certificate.verify({
                    ...cert,
                    signature: sig,
                    signer: '0x'
                });
            }).toThrowError(CertificateInvalidSignerError);
        });

        test('invalid - because missing signature', () => {
            expect(() => {
                certificate.verify({ ...cert, signer: '0x' });
            }).toThrowError(CertificateNotSignedError);
        });

        test('invalid - because invalid signature format', () => {
            expect(() => {
                certificate.verify({
                    ...cert,
                    signature: invalidSignature,
                    signer: '0x'
                });
            }).toThrowError(CertificateInvalidSignatureFormatError);
        });
    });
});
