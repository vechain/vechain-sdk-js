import * as utils from '@noble/curves/abstract/utils';
import { describe, expect, test } from '@jest/globals';
import {
    Hex,
    addressUtils,
    blake2b256,
    certificate,
    secp256k1,
    type Certificate,
    Hex0x
} from '../../src';

import {
    Certificate as t_certificate,
    blake2b256 as t_blake2b256
} from 'thor-devkit';

/**
 * https://en.wikipedia.org/wiki/Unicode_compatibility_characters
 */
// const HANA_KANJI = '戀說零遼倫痢臨輻礼﨩墨碑臭舘';

const PRIVATE_KEY = utils.hexToBytes(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
);

const CERT_A = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'fyi' // HANA_KANJI
    },
    domain: 'localhost',
    timestamp: 1545035033,
    signer: addressUtils
        .fromPublicKey(secp256k1.derivePublicKey(PRIVATE_KEY)) // ERC-55 Mixed-case
        .toLowerCase() // as thor-devkit represents it.
};

// const CERT_T = {
//     purpose: 'identification',
//     payload: {
//         type: 'text',
//         content:
//             'The following dApp would like to see your public address: https://stackblitzstartersmtgkxg-tcrt--3000--12d46890.local-credentialless.webcontainer.io'
//     },
//     domain: 'stackblitzstartersmtgkxg-tcrt--3000--12d46890.local-credentialless.webcontainer.io',
//     timestamp: 1717150342,
//     signer: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
//     signature:
//         '0x69b0d95df24db73b30eb109e4dffab955d586edf919001be466ceceed6168d4372715b6f8fe489214e46f24d8252fba587da6fc241a33599109d80e328267fc300'
// };

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
        test('sign - valid - signed vs not-signed equivalence', () => {
            const signedCert = certificate._sign(CERT_A, PRIVATE_KEY);
            expect(isEqualEnough(signedCert, CERT_A)).toBeTruthy();
        });

        test('sign - valid - extended vs not extended certificate equivalence', () => {
            const cert = {
                ...certificate._sign(CERT_A, PRIVATE_KEY),
                extendedProperty:
                    'I am drunk today and tomorrow I shell be sober but you will still be ugly. (Winston Churchill)'
            };
            const signedCert = certificate._sign(cert, PRIVATE_KEY);
            expect(isEqualEnough(signedCert, CERT_A)).toBeTruthy();
        });

        test('sign - valid - thor-devkit compatibility', () => {
            // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            const json_t = t_certificate.encode(CERT_A);
            // console.log(json_t);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/naming-convention
            const hash_t = t_blake2b256(json_t);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            console.log(Hex.of(new Uint8Array(hash_t)));
            const hash = blake2b256(certificate._encode(CERT_A));
            console.log(Hex.of(hash));
        });
    });

    describe('sign & verify', () => {
        console.log(CERT_A.signer);
    });

    describe('verify', () => {
        test('sign - valid - thor-devkit compatibility', () => {
            const pk = secp256k1.generatePrivateKey();
            const cert = {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: 'fyi'
                },
                domain: 'localhost',
                timestamp: 1545035330,
                signer: addressUtils.fromPrivateKey(pk)
            };
            const signature = secp256k1.sign(
                blake2b256(certificate._encode(cert)),
                pk
            );
            const signedCert = certificate._sign(cert, pk);
            console.log(Hex0x.of(signature));
            console.log(signedCert.signature);
            certificate.verify(signedCert);
            certificate._verify(signedCert);
        });
    });
});
