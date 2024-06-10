import { describe, expect, test } from '@jest/globals';
import { certificate } from '../../src';
import { cert1, cert2, invalidSignature, sig1, sig2 } from './fixture';
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
            expect(certificate.encode(cert1)).toStrictEqual(
                certificate.encode(cert2)
            );
        });

        test('consistent between two certificates - after signature', () => {
            expect(certificate.encode({ ...cert1, signature: sig1 })).toEqual(
                certificate.encode({
                    ...cert2,
                    signature: sig2
                })
            );
        });
    });

    describe('match', () => {
        const cert = new TextEncoder().encode(
            certificate
                .encode({ ...cert1, signature: undefined })
                .normalize('NFC')
        );

        test('valid - because signature', () => {
            expect(() => {
                certificate.match(cert, cert1.signer, sig1);
            }).not.toThrowError();
        });

        test('valid - because signature - uppercase', () => {
            expect(() => {
                certificate.match(cert, cert1.signer, sig1.toUpperCase());
            }).not.toThrowError();
        });

        test('invalid - because signer address', () => {
            expect(() => {
                certificate.match(cert, '0x', sig1);
            }).toThrowError(CertificateInvalidSignerError);
        });

        test('invalid - because invalid signature format', () => {
            expect(() => {
                certificate.match(cert, cert1.signer, invalidSignature);
            }).toThrowError(CertificateInvalidSignatureFormatError);
        });
    });

    describe('verify', () => {
        test('valid - because signature', () => {
            expect(() => {
                certificate.verify({ ...cert1, signature: sig1 });
            }).not.toThrowError();
        });

        test('valid - because signature - uppercase', () => {
            expect(() => {
                certificate.verify({
                    ...cert1,
                    signature: sig1.toUpperCase()
                });
            }).not.toThrowError();
        });

        test('invalid - because signer address', () => {
            expect(() => {
                certificate.verify({
                    ...cert1,
                    signature: sig1,
                    signer: '0x'
                });
            }).toThrowError(CertificateInvalidSignerError);
        });

        test('invalid - because missing signature', () => {
            expect(() => {
                certificate.verify({ ...cert1, signer: '0x' });
            }).toThrowError(CertificateNotSignedError);
        });

        test('invalid - because invalid signature format', () => {
            expect(() => {
                certificate.verify({
                    ...cert1,
                    signature: invalidSignature,
                    signer: '0x'
                });
            }).toThrowError(CertificateInvalidSignatureFormatError);
        });
    });
});
