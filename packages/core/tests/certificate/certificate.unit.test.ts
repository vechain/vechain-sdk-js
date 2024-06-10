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

        // test('compatible with thor-dev-kit', () => {
        //     let myCert: Certificate = {
        //         purpose: 'identification',
        //         payload: {
        //             type: 'text',
        //             content:
        //                 'The following dApp would like to see your public address: https://stackblitzstartersmtgkxg-tcrt--3000--12d46890.local-credentialless.webcontainer.io'
        //         },
        //         signature:
        //             '0x69b0d95df24db73b30eb109e4dffab955d586edf919001be466ceceed6168d4372715b6f8fe489214e46f24d8252fba587da6fc241a33599109d80e328267fc300',
        //         signer: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
        //         domain: 'stackblitzstartersmtgkxg-tcrt--3000--12d46890.local-credentialless.webcontainer.io',
        //         timestamp: 1717150342
        //     };
        //     // myCert = cert1;
        //     const encoded = new TextEncoder().encode(
        //         certificate
        //             .encode({ ...cert1, signature: undefined })
        //             .normalize('NFC')
        //     );
        //     const signature = Hex0x.of(
        //         secp256k1.sign(blake2b256(encoded), privKey)
        //     );
        //     expect(() => {
        //         certificate.match(encoded, myCert.signer, signature);
        //         // certificate.verify({ ...cert1, signature: sig1 });
        //         // certificate.verify({ ...myCert, signature: myCert.signature });
        //         // certificate.verify(cert1);
        //     }).not.toThrowError();
        // });
    });
});
