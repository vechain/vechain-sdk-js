import { describe, expect, test } from '@jest/globals';
import {
    InvalidHDKey,
    InvalidHDKeyMnemonic,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';
import {
    Address,
    HDKey,
    mnemonic,
    secp256k1,
    type WordlistSizeType,
    ZERO_BYTES
} from '../../src';

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
    wrongDerivationPath: '0/1/4/2/4/h'
};

/**
 * Mnemonic tests
 * @group unit/hdkey
 */
describe('HDNode', () => {
    describe('fromMnemonic', () => {
        test('fromMnemonic - invalid - path', () => {
            expect(() =>
                HDKey.fromMnemonic(
                    HDKeyFixture.words,
                    HDKeyFixture.wrongDerivationPath
                )
            ).toThrowError(InvalidHDKey);
        });

        test('fromMnemonic - invalid - word list', () => {
            expect(() =>
                HDKey.fromMnemonic(HDKeyFixture.wrongWords)
            ).toThrowError(InvalidHDKeyMnemonic);
        });

        test('fromMnemonic - invalid - word list leak check', () => {
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

        test('fromMnemonic - valid - address sequence', () => {
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

        test('fromMnemonic - valid - public key sequence', () => {
            const root = HDKey.fromMnemonic(HDKeyFixture.words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                expect(child.privateKey).toBeDefined();
                expect(child.publicKey).toEqual(
                    secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });

        test('fromMnemonic - valid - word list - case insensitive', () => {
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

        test('fromMnemonic - valid - word list - multiple lengths', () => {
            new Array<WordlistSizeType>(12, 15, 18, 21, 24).forEach(
                (length: WordlistSizeType) => {
                    const hdKey = HDKey.fromMnemonic(mnemonic.generate(length));
                    expect(hdKey.privateKey).toBeDefined();
                    expect(
                        secp256k1.isValidPrivateKey(
                            hdKey.privateKey as Uint8Array
                        )
                    ).toBeTruthy();
                    expect(hdKey.publicKey).toBeDefined();
                    expect(hdKey.publicKey).toEqual(
                        secp256k1.derivePublicKey(
                            hdKey.privateKey as Uint8Array
                        )
                    );
                }
            );
        });
    });

    describe('derivePrivateKey', () => {
        test('derivePrivateKey - invalid - chain code', () => {
            expect(() =>
                HDKey.fromPrivateKey(ZERO_BYTES(32), ZERO_BYTES(31))
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('derivePrivateKey - invalid - private key', () => {
            expect(() =>
                HDKey.fromPrivateKey(ZERO_BYTES(31), ZERO_BYTES(32))
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        test('derivePrivateKey - valid - address sequence', () => {
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

        test('derivePrivateKey - valid - public key sequence', () => {
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
                    secp256k1.derivePublicKey(child.privateKey as Uint8Array)
                );
            }
        });
    });

    describe('derivePublicKey', () => {
        test('derivePublicKey - invalid - chain code', () => {
            expect(() =>
                HDKey.fromPublicKey(ZERO_BYTES(32), ZERO_BYTES(31))
            ).toThrowError(InvalidHDKey);
        });

        test('derivePublicKey - invalid - public key', () => {
            expect(() =>
                HDKey.fromPublicKey(ZERO_BYTES(31), ZERO_BYTES(32))
            ).toThrowError(InvalidHDKey);
        });

        test(`derivePublicKey - valid - address sequence, no private key`, () => {
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
});
