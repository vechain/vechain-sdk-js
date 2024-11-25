import { describe, expect, test } from '@jest/globals';
import {
    Address,
    Certificate,
    HexUInt,
    Secp256k1,
    type CertificateData,
    Hex
} from '../../src';
import {
    CertificateSignatureMismatch,
    InvalidDataType,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';
import {
    blake2b256 as tdk_blake2b256,
    Certificate as tdk_certificate,
    secp256k1,
    secp256k1 as tdk_secp256k1
} from 'thor-devkit';

const CertificateFixturePrivateKey = HexUInt.of(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
).bytes;

const CertificateFixture: CertificateData = {
    domain: 'localhost',
    purpose: 'identification',
    payload: {
        type: 'text',
        content: '戀說零遼倫痢臨輻礼﨩墨碑臭舘' // Hana Kanji ambiguity challenge for Unicode encoding.
    },
    timestamp: 1545035330,
    signer: Address.ofPublicKey(
        Secp256k1.derivePublicKey(CertificateFixturePrivateKey)
    )
        .toString() // Checksum case.
        .toLowerCase() // Normalized form for certificates to be byte encoded.
};

class ExtendedCertificate extends Certificate {
    readonly extended: string;

    constructor(certificate: Certificate, extended: string) {
        super(
            certificate.domain,
            certificate.payload,
            certificate.purpose,
            certificate.timestamp,
            certificate.signer,
            certificate.signature
        );
        this.extended = extended;
    }
}

/**
 * Test certificate class
 * @group unit/certificate
 */
describe('Certificate class tests', () => {
    describe('CertificateData interface tests', () => {
        describe('get signer returns lowercase 0x prefixed hex expression', () => {
            const expected = CertificateFixture;

            test('get signer from checksum case', () => {
                const actual = Certificate.of({
                    ...expected,
                    signer: Address.ofPublicKey(
                        Secp256k1.derivePublicKey(CertificateFixturePrivateKey)
                    ).toString()
                });
                expect(actual.signer).toEqual(expected.signer);
            });

            test('get signer from uppercase', () => {
                const actual = Certificate.of({
                    ...expected,
                    signer: expected.signer.toUpperCase()
                });
                expect(actual.signer).toEqual(expected.signer);
            });
        });
    });

    describe('Construction tests', () => {
        test('Throw if negative timestamp', () => {
            expect(() => {
                Certificate.of({
                    ...CertificateFixture,
                    timestamp: -CertificateFixture.timestamp
                });
            }).toThrow(InvalidDataType);
        });

        test('Throw if fractional timestamp', () => {
            expect(() => {
                Certificate.of({
                    ...CertificateFixture,
                    timestamp: 123.45
                });
            }).toThrow(InvalidDataType);
        });

        test('Throw if not hexadecimal signer', () => {
            expect(() => {
                Certificate.of({
                    ...CertificateFixture,
                    signer: 'notahexadecimal'
                });
            }).toThrow(InvalidDataType);
        });

        test('Throw if long signer', () => {
            expect(() => {
                Certificate.of({
                    ...CertificateFixture,
                    signer: CertificateFixture.signer + '0'
                });
            }).toThrow(InvalidDataType);
        });

        test('Throw if short signer', () => {
            expect(() => {
                Certificate.of({
                    ...CertificateFixture,
                    signer: CertificateFixture.signer.substring(
                        0,
                        CertificateFixture.signer.length - 2
                    )
                });
            }).toThrow(InvalidDataType);
        });

        test('Throw if not hexadecimal signature', () => {
            expect(() => {
                Certificate.of({
                    ...CertificateFixture,
                    signature: 'notahexadecimal'
                });
            }).toThrow(InvalidDataType);
        });

        test('Return Certificate instance from unsigned data', () => {
            expect(Certificate.of(CertificateFixture)).toBeInstanceOf(
                Certificate
            );
        });

        test('Return Certificate instance from signed data', () => {
            expect(
                Certificate.of(
                    Certificate.of(CertificateFixture).sign(
                        CertificateFixturePrivateKey
                    )
                )
            ).toBeInstanceOf(Certificate);
        });
    });

    describe('encode method tests', () => {
        test('Return encoded certificate', () => {
            expect(
                Certificate.of(CertificateFixture)
                    .sign(CertificateFixturePrivateKey)
                    .encode()
            ).toBeInstanceOf(Uint8Array);
        });

        test('Return encoded certificate without signature', () => {
            // sign certificate
            const signed = Certificate.of(CertificateFixture).sign(
                CertificateFixturePrivateKey
            );

            // encode using public method
            const encoded = signed.encode();

            const decoded = new TextDecoder().decode(encoded);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const decodedJSON = JSON.parse(decoded);

            // decoded should not have signature
            expect(decodedJSON).not.toHaveProperty('signature');
        });
    });

    describe('isSigned method tests', () => {
        test('Return false if signature is not present', () => {
            expect(Certificate.of(CertificateFixture).isSigned()).toBe(false);
        });

        test('Return true if signature is present', () => {
            expect(
                Certificate.of(CertificateFixture)
                    .sign(CertificateFixturePrivateKey)
                    .isSigned()
            ).toBe(true);
        });
    });

    describe('sign method tests', () => {
        test('Throw if illegal private key', () => {
            expect(() => {
                Certificate.of(CertificateFixture).sign(
                    HexUInt.of('c0ffee').bytes
                );
            }).toThrow(InvalidSecp256k1PrivateKey);
        });

        test('Return signed certificate', () => {
            expect(
                Certificate.of(CertificateFixture)
                    .sign(CertificateFixturePrivateKey)
                    .isSigned()
            ).toBe(true);
        });

        test('Return different signatures for base and extended class objects', () => {
            const base = Certificate.of(CertificateFixture);
            const baseSigned = base.sign(CertificateFixturePrivateKey);
            const pimp = new ExtendedCertificate(base, 'extended property');
            const pimpSigned = pimp.sign(CertificateFixturePrivateKey);
            expect(pimpSigned.signature).not.toBe(baseSigned.signature);
        });

        test('thor-dev-kit compatible', () => {
            const unsigned = {
                ...CertificateFixture,
                // thor-dev-kit doesn't support UTF8 NFC encoding: content is ASCII.
                payload: { ...CertificateFixture.payload, content: 'fyi' }
            };
            const expectedSignature = HexUInt.of(
                tdk_secp256k1.sign(
                    tdk_blake2b256(tdk_certificate.encode(unsigned)),
                    // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
                    Buffer.from(CertificateFixturePrivateKey)
                )
            ).toString();
            const actual = Certificate.of(unsigned).sign(
                CertificateFixturePrivateKey
            );
            expect(actual.signature).toEqual(expectedSignature);
        });

        test('thor-dev-kit not compatible if content not NFC normalized', () => {
            const expectedSignature = HexUInt.of(
                tdk_secp256k1.sign(
                    tdk_blake2b256(tdk_certificate.encode(CertificateFixture)),
                    // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
                    Buffer.from(CertificateFixturePrivateKey)
                )
            ).toString();
            const actual = Certificate.of(CertificateFixture).sign(
                CertificateFixturePrivateKey
            );
            expect(actual.signature).not.toEqual(expectedSignature);
        });
    });

    describe('verify method tests', () => {
        test('match', () => {
            Certificate.of(CertificateFixture)
                .sign(CertificateFixturePrivateKey)
                .verify();
        });

        test('match for extended class objects', () => {
            const base = Certificate.of(CertificateFixture).sign(
                CertificateFixturePrivateKey
            );
            const pimp = new ExtendedCertificate(base, 'extended property');
            pimp.sign(CertificateFixturePrivateKey).verify();
            base.verify();
            expect(base.signature).not.toEqual(pimp.signature);
        });

        test('mismatch <- signer', () => {
            const signed = Certificate.of(CertificateFixture).sign(
                CertificateFixturePrivateKey
            );
            const tamperKey = secp256k1.generatePrivateKey();
            const tamper = Certificate.of({
                ...CertificateFixture,
                signer: Address.ofPublicKey(
                    Secp256k1.derivePublicKey(tamperKey)
                ).toString(),
                signature: signed.signature
            });
            expect(() => {
                tamper.verify();
            }).toThrow(CertificateSignatureMismatch);
        });

        test('mismatch <- signature', () => {
            const tamperKey = secp256k1.generatePrivateKey();
            const tamper = Certificate.of(CertificateFixture).sign(tamperKey);
            expect(() => {
                tamper.verify();
            }).toThrow(CertificateSignatureMismatch);
        });

        test('mismatch <- no signature', () => {
            const unsigned = Certificate.of(CertificateFixture);
            expect(() => {
                unsigned.verify();
            }).toThrow(CertificateSignatureMismatch);
        });

        test('mismatch <- tamper content', () => {
            const signed = Certificate.of(CertificateFixture).sign(
                CertificateFixturePrivateKey
            );
            const tamper = Certificate.of({
                ...signed,
                payload: {
                    type: 'data',
                    content: 'dummy'
                },
                signature: signed.signature
            });
            expect(() => {
                tamper.verify();
            }).toThrow(CertificateSignatureMismatch);
        });

        test('thor-dev-kit compatible', () => {
            const unsigned = {
                ...CertificateFixture,
                // thor-dev-kit doesn't support UTF8 NFC encoding: content is ASCII.
                payload: { ...CertificateFixture.payload, content: 'fyi' }
            };
            const tdkSignature = Hex.of(
                tdk_secp256k1.sign(
                    tdk_blake2b256(tdk_certificate.encode(unsigned)),
                    // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
                    Buffer.from(CertificateFixturePrivateKey)
                )
            ).toString();
            const signed = {
                ...unsigned,
                signature: tdkSignature
            };
            tdk_certificate.verify(signed);
            Certificate.of(signed).verify();
        });
    });
});
