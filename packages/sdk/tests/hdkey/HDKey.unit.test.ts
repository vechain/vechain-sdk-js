import { describe, expect, test } from '@jest/globals';
import { Address, HexUInt, Mnemonic, type WordlistSizeType } from '@vcdm';

import { IllegalArgumentError } from '@errors';
import { Secp256k1 } from '@secp256k1';
import { HDKey } from '@hdkey';
import { ZERO_BYTES } from '@utils';

const HDKeyFixture = {
    /**
     * Addresses generated from the mnemonic above
     */
    addresses: [
        '0x339Fb3C438606519E2C75bbf531fb43a0F449A70',
        '0x5677099D06Bc72f9da1113aFA5e022feEc424c8E',
        '0x86231b5CDCBfE751B9DdCD4Bd981fC0A48afe921',
        '0xd6f184944335f26Ea59dbB603E38e2d434220fcD',
        '0x2AC1a0AeCd5C80Fb5524348130ab7cf92670470A'
    ],

    /**
     * Correct mnemonic
     */
    words: 'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(
        ' '
    ),

    /**
     * Wrong mnemonic
     */
    wrongWords:
        'ignore empty bird silly journey junior ripple have guard waste between'.split(
            ' '
        ),

    /**
     * Wrong derivation path fixture.
     */
    wrongDerivationPath: '0/1/4/2/4/h',

    /**
     * Correct validation paths fixtures
     */
    correctValidationPaths: [
        HDKey.VET_DERIVATION_PATH,
        'm/0/1/2/3/4',
        "m/0'/1'/2'/3/4",
        "m/44'/60'/0'/0/0",
        "m/44'/60'/0'/0",
        'm/0/1/2/3'
    ],

    /**
     * Incorrect validation paths fixtures
     */
    incorrectValidationPaths: [
        'a',
        'm/0/b',
        'incorrect',
        'inco/rre/01/ct',
        '0/1/4/2/4/h',
        '1/0/1',
        "m/0'/1'/2/3'/4'"
    ]
};

/**
 * Test HDKey class.
 * @group unit/hdkey
 */
describe('HDKey class tests', () => {
    describe('fromMnemonic method tests', () => {
        test('err <- invalid path', () => {
            expect(() =>
                HDKey.fromMnemonic(
                    HDKeyFixture.words,
                    HDKeyFixture.wrongDerivationPath
                )
            ).toThrowError(IllegalArgumentError);
        });

        test('err <-  invalid word list', () => {
            expect(() =>
                HDKey.fromMnemonic(HDKeyFixture.wrongWords)
            ).toThrowError(IllegalArgumentError);
        });

        test('err <- invalid word list leak check', () => {
            const words =
                'denial pet squirrel other broom bar gas better priority spoil cross'.split(
                    ' '
                );
            try {
                HDKey.fromMnemonic(words);
                expect(true).toBeFalsy();
            } catch (error) {
                (error as Error)
                    .toString()
                    .split(' ')
                    .forEach((word) => {
                        expect(words.includes(word)).toBeFalsy();
                    });
            }
        });

        test('ok <- valid address sequence', () => {
            const root = HDKey.fromMnemonic(HDKeyFixture.words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.publicKey).toBeDefined();
                expect(
                    Address.ofPublicKey(
                        child.publicKey as Uint8Array
                    ).toString()
                ).toEqual(HDKeyFixture.addresses[i]);
                // do we need <child>.address?
            }
        });

        test('ok <- valid public key sequence', () => {
            const root = HDKey.fromMnemonic(HDKeyFixture.words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    Secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });

        test('ok <- valid word list - case insensitive', () => {
            const reference = HDKey.fromMnemonic(HDKeyFixture.words);
            expect(reference.publicKey).toBeDefined();
            const lowercase = HDKey.fromMnemonic(
                HDKeyFixture.words.map((w) => w.toLowerCase())
            );
            expect(lowercase.publicKey).toBeDefined();
            expect(
                Address.ofPublicKey(
                    lowercase.publicKey as Uint8Array
                ).toString()
            ).toBe(
                Address.ofPublicKey(
                    reference.publicKey as Uint8Array
                ).toString()
            );
            const uppercase = HDKey.fromMnemonic(
                HDKeyFixture.words.map((w) => w.toUpperCase())
            );
            expect(uppercase.publicKey).toBeDefined();
            expect(
                Address.ofPublicKey(
                    uppercase.publicKey as Uint8Array
                ).toString()
            ).toBe(
                Address.ofPublicKey(
                    reference.publicKey as Uint8Array
                ).toString()
            );
        });

        test('ok <- valid word list - multiple lengths', () => {
            new Array<WordlistSizeType>(12, 15, 18, 21, 24).forEach(
                (length: WordlistSizeType) => {
                    const hdKey = HDKey.fromMnemonic(Mnemonic.of(length));
                    expect(hdKey.privateKey).toBeDefined();
                    expect(
                        Secp256k1.isValidPrivateKey(
                            hdKey.privateKey as Uint8Array
                        )
                    ).toBeTruthy();
                    expect(hdKey.publicKey).toBeDefined();
                    expect(hdKey.publicKey).toEqual(
                        Secp256k1.derivePublicKey(
                            hdKey.privateKey as Uint8Array
                        )
                    );
                }
            );
        });

        test('ok <- valid word list and passphrase', () => {
            // Fixtures from https://github.com/paulmillr/scure-bip39/blob/main/test/bip39.test.ts
            const words =
                'koala óxido urbe crudo momia idioma boina rostro títere dilema himno víspera'.split(
                    ' '
                );
            const passphrase = 'passphrase';
            const expected = HexUInt.of(
                '0x02e1c6f0a9aa09a9dc68e5f1fcb6b6d8880aca752b7ed94332207c7438855163bd'
            ).bytes;
            const hdkey = HDKey.fromMnemonic(
                words,
                HDKey.VET_DERIVATION_PATH,
                passphrase
            );
            expect(hdkey.privateKey).toBeInstanceOf(Uint8Array);
            expect(
                Secp256k1.isValidPrivateKey(hdkey.privateKey as Uint8Array)
            ).toBe(true);
            expect(hdkey.publicKey).toBeInstanceOf(Uint8Array);
            expect(hdkey.publicKey).toEqual(expected);
            expect(hdkey.publicKey).not.toEqual(
                HDKey.fromMnemonic(words, HDKey.VET_DERIVATION_PATH).publicKey
            );
        });
    });

    describe('fromPrivateKey method tests', () => {
        test('err <- invalid chain code', () => {
            expect(() =>
                HDKey.fromPrivateKey(ZERO_BYTES(32), ZERO_BYTES(31))
            ).toThrowError(IllegalArgumentError);
        });

        test('err <- invalid private key', () => {
            expect(() =>
                HDKey.fromPrivateKey(ZERO_BYTES(31), ZERO_BYTES(32))
            ).toThrowError(IllegalArgumentError);
        });

        test('ok <- valid address sequence', () => {
            const root = HDKey.fromMnemonic(HDKeyFixture.words);
            expect(root.privateKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDKey.fromPrivateKey(
                root.privateKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(
                    Address.ofPublicKey(
                        child.publicKey as Uint8Array
                    ).toString()
                ).toEqual(HDKeyFixture.addresses[i]);
            }
        });

        test('ok <- valid public key sequence', () => {
            const root = HDKey.fromMnemonic(HDKeyFixture.words);
            expect(root.privateKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDKey.fromPrivateKey(
                root.privateKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    Secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });
    });

    describe('fromPublicKey', () => {
        test('err <- invalid chain code', () => {
            expect(() =>
                HDKey.fromPublicKey(ZERO_BYTES(32), ZERO_BYTES(31))
            ).toThrowError(IllegalArgumentError);
        });

        test('err <- invalid public key', () => {
            expect(() =>
                HDKey.fromPublicKey(ZERO_BYTES(31), ZERO_BYTES(32))
            ).toThrowError(IllegalArgumentError);
        });

        test(`ok <- valid address sequence, no private key`, () => {
            const root = HDKey.fromMnemonic(HDKeyFixture.words);
            expect(root.publicKey).toBeDefined();
            expect(root.chainCode).toBeDefined();
            const extendedRoot = HDKey.fromPublicKey(
                root.publicKey as Uint8Array,
                root.chainCode as Uint8Array
            );
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                expect(child.privateKey).toBeNull();
                expect(child.publicKey).toBeDefined();
                expect(
                    Address.ofPublicKey(
                        child.publicKey as Uint8Array
                    ).toString()
                ).toEqual(HDKeyFixture.addresses[i]);
            }
        });
    });

    describe('isDerivationPathValid method tests', () => {
        test('false <- isDerivationPathValid', () => {
            HDKeyFixture.incorrectValidationPaths.forEach((path) => {
                expect(HDKey.isDerivationPathValid(path)).toEqual(false);
            });
        });

        test('true <- isDerivationPath', () => {
            HDKeyFixture.correctValidationPaths.forEach((path) => {
                expect(HDKey.isDerivationPathValid(path)).toEqual(true);
            });
        });
    });
});
