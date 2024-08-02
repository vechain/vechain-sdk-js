import * as n_utils from '@noble/curves/abstract/utils';
import { describe, expect, test } from '@jest/globals';
import { certificate, type Certificate, _Hex0x } from '../../src';
import { cert, certPrivateKey } from './fixture';
import { privateKey } from '../secp256k1/fixture';
import {
    CertificateSignature,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';
import {
    blake2b256 as tdk_blake2b256,
    Certificate as tdk_certificate,
    secp256k1 as tdk_secp256k1
} from 'thor-devkit';

function isEqualEnough(cert: Certificate, other: Certificate): boolean {
    return (
        cert.purpose === other.purpose &&
        cert.payload.type === other.payload.type &&
        cert.payload.content === other.payload.content &&
        cert.domain === other.domain &&
        cert.timestamp === other.timestamp &&
        cert.signer.toLowerCase() === other.signer.toLowerCase()
    );
}

/**
 * Unit tests for the Certificate module.
 *
 * @group unit/certificate
 */
describe('certificate', () => {
    describe('sign', () => {
        test('compatibility - thor-devkit - compatible', () => {
            // thor-dev-kit doesn't support UTF8 NFC encoding.
            const tdkCompatibleCert = {
                ...cert,
                payload: { ...cert.payload, content: 'fyi' }
            };
            const tdkSignature = _Hex0x.of(
                tdk_secp256k1.sign(
                    tdk_blake2b256(tdk_certificate.encode(tdkCompatibleCert)),
                    Buffer.from(certPrivateKey)
                )
            );
            expect(tdkSignature).toEqual(
                certificate.sign(tdkCompatibleCert, certPrivateKey).signature
            );
        });

        test('compatibility - thor-dev-kit - not compatible because UTF8 normalization not enforced ', () => {
            // thor-dev-kit doesn't support UTF8 NFC encoding for
            const tdkSignature = _Hex0x.of(
                tdk_secp256k1.sign(
                    tdk_blake2b256(tdk_certificate.encode(cert)),
                    Buffer.from(certPrivateKey)
                )
            );
            expect(tdkSignature).not.toEqual(
                certificate.sign(cert, certPrivateKey).signature
            );
        });

        test('invalid - illegal private key', () => {
            expect(() => {
                certificate.sign(cert, n_utils.hexToBytes('c0ffeec1b8'));
            }).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('valid - challenge signer case sensitivity', () => {
            const hCert = { ...cert, signer: cert.signer.toUpperCase() };
            const lCert = { ...cert, signer: cert.signer.toLowerCase() };
            const signedCert = certificate.sign(cert, privateKey);
            const hSignedCert = certificate.sign(hCert, privateKey);
            const lSignedCert = certificate.sign(lCert, privateKey);
            expect(signedCert.signature).toEqual(hSignedCert.signature);
            expect(signedCert.signature).toEqual(lSignedCert.signature);
        });

        test('valid - challenge utf8 normalization', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            expect(isEqualEnough(cert, signedCert)).toBeTruthy();
            expect(signedCert.signature).toBeDefined();
        });

        test('valid - challenge interface extension', () => {
            const extendedCert = {
                ...cert,
                extended: 'property',
                signature: '0x00'
            };
            const signedCert = certificate.sign(cert, certPrivateKey);
            const signedExtendedCertificate = certificate.sign(
                extendedCert,
                certPrivateKey
            );
            expect(isEqualEnough(cert, extendedCert)).toBeTruthy();
            expect(isEqualEnough(cert, signedExtendedCertificate)).toBeTruthy();
            expect(signedCert.signature).toEqual(
                signedExtendedCertificate.signature
            );
        });
    });

    describe('verify', () => {
        test('compatibility - thor-devkit - compatible', () => {
            const tdkCompatibleCert = {
                ...cert,
                payload: { ...cert.payload, content: 'fyi' }
            };
            const tdkSignature = _Hex0x.of(
                tdk_secp256k1.sign(
                    tdk_blake2b256(tdk_certificate.encode(tdkCompatibleCert)),
                    Buffer.from(certPrivateKey)
                )
            );
            const tdkSignedCert = {
                ...tdkCompatibleCert,
                signature: tdkSignature
            };
            expect(() => {
                certificate.verify(tdkSignedCert);
            }).not.toThrowError();
        });

        test('invalid - illegal signer address', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                signer: '0xC1b8C0fFeE',
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - because invalid signature format', () => {
            const invalidCert = {
                ...cert,
                signature: 'C0fFeE'
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - undefined signature', () => {
            const invalidCert = {
                ...cert,
                signature: undefined
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - illegal signer address', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                signer: '0xC1b8C0fFeE',
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - tampered purpose', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                purpose: 'tamper',
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - tampered payload', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                payload: {
                    type: 'data',
                    content: 'dummy'
                },
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - tampered domain', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                domain: 'tampered',
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('invalid - tampered timestamp', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                timestamp: cert.timestamp + 1,
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateSignature);
        });

        test('valid - additional property', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const ectendedCert = {
                ...cert,
                extendedProperty: 'extended property',
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(ectendedCert);
            }).not.toThrowError();
        });

        test('valid - happy path', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            expect(() => {
                certificate.verify(signedCert);
            }).not.toThrowError();
        });
    });
});
