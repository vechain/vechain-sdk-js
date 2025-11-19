"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const thor_devkit_1 = require("thor-devkit");
const CertificateFixturePrivateKey = src_1.HexUInt.of('7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a').bytes;
const CertificateFixture = {
    domain: 'localhost',
    purpose: 'identification',
    payload: {
        type: 'text',
        content: '戀說零遼倫痢臨輻礼﨩墨碑臭舘' // Hana Kanji ambiguity challenge for Unicode encoding.
    },
    timestamp: 1545035330,
    signer: src_1.Address.ofPublicKey(src_1.Secp256k1.derivePublicKey(CertificateFixturePrivateKey))
        .toString() // Checksum case.
        .toLowerCase() // Normalized form for certificates to be byte encoded.
};
class ExtendedCertificate extends src_1.Certificate {
    extended;
    constructor(certificate, extended) {
        super(certificate.domain, certificate.payload, certificate.purpose, certificate.timestamp, certificate.signer, certificate.signature);
        this.extended = extended;
    }
}
/**
 * Test certificate class
 * @group unit/certificate
 */
(0, globals_1.describe)('Certificate class tests', () => {
    (0, globals_1.describe)('CertificateData interface tests', () => {
        (0, globals_1.describe)('get signer returns lowercase 0x prefixed hex expression', () => {
            const expected = CertificateFixture;
            (0, globals_1.test)('get signer from checksum case', () => {
                const actual = src_1.Certificate.of({
                    ...expected,
                    signer: src_1.Address.ofPublicKey(src_1.Secp256k1.derivePublicKey(CertificateFixturePrivateKey)).toString()
                });
                (0, globals_1.expect)(actual.signer).toEqual(expected.signer);
            });
            (0, globals_1.test)('get signer from uppercase', () => {
                const actual = src_1.Certificate.of({
                    ...expected,
                    signer: expected.signer.toUpperCase()
                });
                (0, globals_1.expect)(actual.signer).toEqual(expected.signer);
            });
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Throw if negative timestamp', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of({
                    ...CertificateFixture,
                    timestamp: -CertificateFixture.timestamp
                });
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw if fractional timestamp', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of({
                    ...CertificateFixture,
                    timestamp: 123.45
                });
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw if not hexadecimal signer', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of({
                    ...CertificateFixture,
                    signer: 'notahexadecimal'
                });
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw if long signer', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of({
                    ...CertificateFixture,
                    signer: CertificateFixture.signer + '0'
                });
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw if short signer', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of({
                    ...CertificateFixture,
                    signer: CertificateFixture.signer.substring(0, CertificateFixture.signer.length - 2)
                });
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw if not hexadecimal signature', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of({
                    ...CertificateFixture,
                    signature: 'notahexadecimal'
                });
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Return Certificate instance from unsigned data', () => {
            (0, globals_1.expect)(src_1.Certificate.of(CertificateFixture)).toBeInstanceOf(src_1.Certificate);
        });
        (0, globals_1.test)('Return Certificate instance from signed data', () => {
            (0, globals_1.expect)(src_1.Certificate.of(src_1.Certificate.of(CertificateFixture).sign(CertificateFixturePrivateKey))).toBeInstanceOf(src_1.Certificate);
        });
    });
    (0, globals_1.describe)('encode method tests', () => {
        (0, globals_1.test)('Return encoded certificate', () => {
            (0, globals_1.expect)(src_1.Certificate.of(CertificateFixture)
                .sign(CertificateFixturePrivateKey)
                .encode()).toBeInstanceOf(Uint8Array);
        });
        (0, globals_1.test)('Return encoded certificate without signature', () => {
            // sign certificate
            const signed = src_1.Certificate.of(CertificateFixture).sign(CertificateFixturePrivateKey);
            // encode using public method
            const encoded = signed.encode();
            const decoded = new TextDecoder().decode(encoded);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const decodedJSON = JSON.parse(decoded);
            // decoded should not have signature
            (0, globals_1.expect)(decodedJSON).not.toHaveProperty('signature');
        });
    });
    (0, globals_1.describe)('isSigned method tests', () => {
        (0, globals_1.test)('Return false if signature is not present', () => {
            (0, globals_1.expect)(src_1.Certificate.of(CertificateFixture).isSigned()).toBe(false);
        });
        (0, globals_1.test)('Return true if signature is present', () => {
            (0, globals_1.expect)(src_1.Certificate.of(CertificateFixture)
                .sign(CertificateFixturePrivateKey)
                .isSigned()).toBe(true);
        });
    });
    (0, globals_1.describe)('sign method tests', () => {
        (0, globals_1.test)('Throw if illegal private key', () => {
            (0, globals_1.expect)(() => {
                src_1.Certificate.of(CertificateFixture).sign(src_1.HexUInt.of('c0ffee').bytes);
            }).toThrow(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
        (0, globals_1.test)('Return signed certificate', () => {
            (0, globals_1.expect)(src_1.Certificate.of(CertificateFixture)
                .sign(CertificateFixturePrivateKey)
                .isSigned()).toBe(true);
        });
        (0, globals_1.test)('Return different signatures for base and extended class objects', () => {
            const base = src_1.Certificate.of(CertificateFixture);
            const baseSigned = base.sign(CertificateFixturePrivateKey);
            const pimp = new ExtendedCertificate(base, 'extended property');
            const pimpSigned = pimp.sign(CertificateFixturePrivateKey);
            (0, globals_1.expect)(pimpSigned.signature).not.toBe(baseSigned.signature);
        });
        (0, globals_1.test)('thor-dev-kit compatible', () => {
            const unsigned = {
                ...CertificateFixture,
                // thor-dev-kit doesn't support UTF8 NFC encoding: content is ASCII.
                payload: { ...CertificateFixture.payload, content: 'fyi' }
            };
            const expectedSignature = src_1.HexUInt.of(thor_devkit_1.secp256k1.sign((0, thor_devkit_1.blake2b256)(thor_devkit_1.Certificate.encode(unsigned)), 
            // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
            Buffer.from(CertificateFixturePrivateKey))).toString();
            const actual = src_1.Certificate.of(unsigned).sign(CertificateFixturePrivateKey);
            (0, globals_1.expect)(actual.signature).toEqual(expectedSignature);
        });
        (0, globals_1.test)('thor-dev-kit not compatible if content not NFC normalized', () => {
            const expectedSignature = src_1.HexUInt.of(thor_devkit_1.secp256k1.sign((0, thor_devkit_1.blake2b256)(thor_devkit_1.Certificate.encode(CertificateFixture)), 
            // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
            Buffer.from(CertificateFixturePrivateKey))).toString();
            const actual = src_1.Certificate.of(CertificateFixture).sign(CertificateFixturePrivateKey);
            (0, globals_1.expect)(actual.signature).not.toEqual(expectedSignature);
        });
    });
    (0, globals_1.describe)('verify method tests', () => {
        (0, globals_1.test)('match', () => {
            src_1.Certificate.of(CertificateFixture)
                .sign(CertificateFixturePrivateKey)
                .verify();
        });
        (0, globals_1.test)('match for extended class objects', () => {
            const base = src_1.Certificate.of(CertificateFixture).sign(CertificateFixturePrivateKey);
            const pimp = new ExtendedCertificate(base, 'extended property');
            pimp.sign(CertificateFixturePrivateKey).verify();
            base.verify();
            (0, globals_1.expect)(base.signature).not.toEqual(pimp.signature);
        });
        (0, globals_1.test)('mismatch <- signer', () => {
            const signed = src_1.Certificate.of(CertificateFixture).sign(CertificateFixturePrivateKey);
            const tamperKey = thor_devkit_1.secp256k1.generatePrivateKey();
            const tamper = src_1.Certificate.of({
                ...CertificateFixture,
                signer: src_1.Address.ofPublicKey(src_1.Secp256k1.derivePublicKey(tamperKey)).toString(),
                signature: signed.signature
            });
            (0, globals_1.expect)(() => {
                tamper.verify();
            }).toThrow(sdk_errors_1.CertificateSignatureMismatch);
        });
        (0, globals_1.test)('mismatch <- signature', () => {
            const tamperKey = thor_devkit_1.secp256k1.generatePrivateKey();
            const tamper = src_1.Certificate.of(CertificateFixture).sign(tamperKey);
            (0, globals_1.expect)(() => {
                tamper.verify();
            }).toThrow(sdk_errors_1.CertificateSignatureMismatch);
        });
        (0, globals_1.test)('mismatch <- no signature', () => {
            const unsigned = src_1.Certificate.of(CertificateFixture);
            (0, globals_1.expect)(() => {
                unsigned.verify();
            }).toThrow(sdk_errors_1.CertificateSignatureMismatch);
        });
        (0, globals_1.test)('mismatch <- tamper content', () => {
            const signed = src_1.Certificate.of(CertificateFixture).sign(CertificateFixturePrivateKey);
            const tamper = src_1.Certificate.of({
                ...signed,
                payload: {
                    type: 'data',
                    content: 'dummy'
                },
                signature: signed.signature
            });
            (0, globals_1.expect)(() => {
                tamper.verify();
            }).toThrow(sdk_errors_1.CertificateSignatureMismatch);
        });
        (0, globals_1.test)('thor-dev-kit compatible', () => {
            const unsigned = {
                ...CertificateFixture,
                // thor-dev-kit doesn't support UTF8 NFC encoding: content is ASCII.
                payload: { ...CertificateFixture.payload, content: 'fyi' }
            };
            const tdkSignature = src_1.Hex.of(thor_devkit_1.secp256k1.sign((0, thor_devkit_1.blake2b256)(thor_devkit_1.Certificate.encode(unsigned)), 
            // eslint-disable-next-line local-rules/disallow-buffer-from-alloc
            Buffer.from(CertificateFixturePrivateKey))).toString();
            const signed = {
                ...unsigned,
                signature: tdkSignature
            };
            thor_devkit_1.Certificate.verify(signed);
            src_1.Certificate.of(signed).verify();
        });
    });
});
