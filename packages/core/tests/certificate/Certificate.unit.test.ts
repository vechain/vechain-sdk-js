import { describe, expect, test } from '@jest/globals';
import {
    Address,
    Certificate,
    HexUInt,
    Secp256k1,
    type CertificateData
} from '../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

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
        .toString()
        .toLowerCase()
};

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

    describe('sign method tests', () => {});

    describe('verify method tests', () => {});
});
