import * as utils from '@noble/curves/abstract/utils';
import { describe, expect, test } from '@jest/globals';
import { certificate, type Certificate } from '../../src';
import { cert, certPrivateKey } from './fixture';
import { privateKey } from '../secp256k1/fixture';
import {
    CertificateInvalidSignatureFormatError,
    CertificateInvalidSignerError,
    CertificateNotSignedError,
    InvalidSecp256k1PrivateKeyError
} from '@vechain/sdk-errors';
// The tdk prefix is for thor-devkit.
// import {
//     Certificate as tdk_certificate,
//     blake2b256 as tdk_blake2b256,
//     secp256k1 as tdk_secp256k1
// } from 'thor-devkit';

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
        // test('compatibility - thor-devkit - compatible', () => {
        //     // thor-dev-kit doesn't support UTF8 NFC encoding.
        //     const tdkCompatibleCert = {
        //         ...cert,
        //         payload: { ...cert.payload, content: 'fyi' }
        //     };
        //     const tdkSignature = Hex0x.of(
        //         tdk_secp256k1.sign(
        //             tdk_blake2b256(tdk_certificate.encode(tdkCompatibleCert)),
        //             Buffer.from(certPrivateKey)
        //         )
        //     );
        //     expect(tdkSignature).toEqual(
        //         certificate.sign(tdkCompatibleCert, certPrivateKey).signature
        //     );
        // });

        // test('compatibility - thor-dev-kit - not compatible because UTF8 normalization not enforced ', () => {
        //     // thor-dev-kit doesn't support UTF8 NFC encoding for
        //     const tdkSignature = Hex0x.of(
        //         tdk_secp256k1.sign(
        //             tdk_blake2b256(tdk_certificate.encode(cert)),
        //             Buffer.from(certPrivateKey)
        //         )
        //     );
        //     expect(tdkSignature).not.toEqual(
        //         certificate.sign(cert, certPrivateKey).signature
        //     );
        // });

        test('invalid - illegal private key', () => {
            expect(() => {
                certificate.sign(cert, utils.hexToBytes('c0ffeec1b8'));
            }).toThrowError(InvalidSecp256k1PrivateKeyError);
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
        // test('compatibility - thor-devkit - compatible', () => {
        //     const tdkCompatibleCert = {
        //         ...cert,
        //         payload: { ...cert.payload, content: 'fyi' }
        //     };
        //     const tdkSignature = Hex0x.of(
        //         tdk_secp256k1.sign(
        //             tdk_blake2b256(tdk_certificate.encode(tdkCompatibleCert)),
        //             Buffer.from(certPrivateKey)
        //         )
        //     );
        //     const tdkSignedCert = {
        //         ...tdkCompatibleCert,
        //         signature: tdkSignature
        //     };
        //     expect(() => {
        //         certificate.verify(tdkSignedCert);
        //     }).not.toThrowError();
        // });

        test('invalid - illegal signer address', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            const invalidCert = {
                ...cert,
                signer: '0xC1b8C0fFeE',
                signature: signedCert.signature
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateInvalidSignerError);
        });

        test('invalid - because invalid signature format', () => {
            const invalidCert = {
                ...cert,
                signature: 'C0fFeE'
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateInvalidSignatureFormatError);
        });

        test('invalid - undefined signature', () => {
            const invalidCert = {
                ...cert,
                signature: undefined
            };
            expect(() => {
                certificate.verify(invalidCert);
            }).toThrowError(CertificateNotSignedError);
        });

        test('valid - happy path', () => {
            const signedCert = certificate.sign(cert, certPrivateKey);
            expect(() => {
                certificate.verify(signedCert);
            }).not.toThrowError();
        });
    });
});
