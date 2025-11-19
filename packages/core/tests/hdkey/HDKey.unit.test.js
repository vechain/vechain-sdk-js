"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
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
    words: 'ignore empty bird silly journey junior ripple have guard waste between tenant'.split(' '),
    /**
     * Wrong mnemonic
     */
    wrongWords: 'ignore empty bird silly journey junior ripple have guard waste between'.split(' '),
    /**
     * Wrong derivation path fixture.
     */
    wrongDerivationPath: '0/1/4/2/4/h',
    /**
     * Correct validation paths fixtures
     */
    correctValidationPaths: [
        src_1.HDKey.VET_DERIVATION_PATH,
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
(0, globals_1.describe)('HDKey class tests', () => {
    (0, globals_1.describe)('fromMnemonic method tests', () => {
        (0, globals_1.test)('fromMnemonic - invalid - path', () => {
            (0, globals_1.expect)(() => src_1.HDKey.fromMnemonic(HDKeyFixture.words, HDKeyFixture.wrongDerivationPath)).toThrowError(sdk_errors_1.InvalidHDKey);
        });
        (0, globals_1.test)('fromMnemonic - invalid - word list', () => {
            (0, globals_1.expect)(() => src_1.HDKey.fromMnemonic(HDKeyFixture.wrongWords)).toThrowError(sdk_errors_1.InvalidHDKeyMnemonic);
        });
        (0, globals_1.test)('fromMnemonic - invalid - word list leak check', () => {
            const words = 'denial pet squirrel other broom bar gas better priority spoil cross'.split(' ');
            try {
                src_1.HDKey.fromMnemonic(words);
                (0, globals_1.expect)(true).toBeFalsy();
            }
            catch (error) {
                error
                    .toString()
                    .split(' ')
                    .forEach((word) => {
                    (0, globals_1.expect)(words.includes(word)).toBeFalsy();
                });
            }
        });
        (0, globals_1.test)('fromMnemonic - valid - address sequence', () => {
            const root = src_1.HDKey.fromMnemonic(HDKeyFixture.words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                (0, globals_1.expect)(child.publicKey).toBeDefined();
                (0, globals_1.expect)(src_1.Address.ofPublicKey(child.publicKey).toString()).toEqual(HDKeyFixture.addresses[i]);
                // do we need <child>.address?
            }
        });
        (0, globals_1.test)('fromMnemonic - valid - public key sequence', () => {
            const root = src_1.HDKey.fromMnemonic(HDKeyFixture.words);
            for (let i = 0; i < 5; i++) {
                const child = root.deriveChild(i);
                (0, globals_1.expect)(child.privateKey).toBeDefined();
                (0, globals_1.expect)(child.publicKey).toEqual(src_1.Secp256k1.derivePublicKey(child.privateKey));
            }
        });
        (0, globals_1.test)('fromMnemonic - valid - word list - case insensitive', () => {
            const reference = src_1.HDKey.fromMnemonic(HDKeyFixture.words);
            (0, globals_1.expect)(reference.publicKey).toBeDefined();
            const lowercase = src_1.HDKey.fromMnemonic(HDKeyFixture.words.map((w) => w.toLowerCase()));
            (0, globals_1.expect)(lowercase.publicKey).toBeDefined();
            (0, globals_1.expect)(src_1.Address.ofPublicKey(lowercase.publicKey).toString()).toBe(src_1.Address.ofPublicKey(reference.publicKey).toString());
            const uppercase = src_1.HDKey.fromMnemonic(HDKeyFixture.words.map((w) => w.toUpperCase()));
            (0, globals_1.expect)(uppercase.publicKey).toBeDefined();
            (0, globals_1.expect)(src_1.Address.ofPublicKey(uppercase.publicKey).toString()).toBe(src_1.Address.ofPublicKey(reference.publicKey).toString());
        });
        (0, globals_1.test)('fromMnemonic - valid - word list - multiple lengths', () => {
            new Array(12, 15, 18, 21, 24).forEach((length) => {
                const hdKey = src_1.HDKey.fromMnemonic(src_1.Mnemonic.of(length));
                (0, globals_1.expect)(hdKey.privateKey).toBeDefined();
                (0, globals_1.expect)(src_1.Secp256k1.isValidPrivateKey(hdKey.privateKey)).toBeTruthy();
                (0, globals_1.expect)(hdKey.publicKey).toBeDefined();
                (0, globals_1.expect)(hdKey.publicKey).toEqual(src_1.Secp256k1.derivePublicKey(hdKey.privateKey));
            });
        });
    });
    (0, globals_1.describe)('fromPrivateKey method tests', () => {
        (0, globals_1.test)('fromPrivateKey - invalid - chain code', () => {
            (0, globals_1.expect)(() => src_1.HDKey.fromPrivateKey((0, src_1.ZERO_BYTES)(32), (0, src_1.ZERO_BYTES)(31))).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
        (0, globals_1.test)('fromPrivateKey - invalid - private key', () => {
            (0, globals_1.expect)(() => src_1.HDKey.fromPrivateKey((0, src_1.ZERO_BYTES)(31), (0, src_1.ZERO_BYTES)(32))).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
        (0, globals_1.test)('fromPrivateKey - valid - address sequence', () => {
            const root = src_1.HDKey.fromMnemonic(HDKeyFixture.words);
            (0, globals_1.expect)(root.privateKey).toBeDefined();
            (0, globals_1.expect)(root.chainCode).toBeDefined();
            const extendedRoot = src_1.HDKey.fromPrivateKey(root.privateKey, root.chainCode);
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                (0, globals_1.expect)(src_1.Address.ofPublicKey(child.publicKey).toString()).toEqual(HDKeyFixture.addresses[i]);
            }
        });
        (0, globals_1.test)('fromPrivateKey - valid - public key sequence', () => {
            const root = src_1.HDKey.fromMnemonic(HDKeyFixture.words);
            (0, globals_1.expect)(root.privateKey).toBeDefined();
            (0, globals_1.expect)(root.chainCode).toBeDefined();
            const extendedRoot = src_1.HDKey.fromPrivateKey(root.privateKey, root.chainCode);
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                (0, globals_1.expect)(child.privateKey).toBeDefined();
                (0, globals_1.expect)(child.publicKey).toEqual(src_1.Secp256k1.derivePublicKey(child.privateKey));
            }
        });
    });
    (0, globals_1.describe)('fromPublicKey', () => {
        (0, globals_1.test)('fromPublicKey - invalid - chain code', () => {
            (0, globals_1.expect)(() => src_1.HDKey.fromPublicKey((0, src_1.ZERO_BYTES)(32), (0, src_1.ZERO_BYTES)(31))).toThrowError(sdk_errors_1.InvalidHDKey);
        });
        (0, globals_1.test)('fromPublicKey - invalid - public key', () => {
            (0, globals_1.expect)(() => src_1.HDKey.fromPublicKey((0, src_1.ZERO_BYTES)(31), (0, src_1.ZERO_BYTES)(32))).toThrowError(sdk_errors_1.InvalidHDKey);
        });
        (0, globals_1.test)(`fromPublicKey - valid - address sequence, no private key`, () => {
            const root = src_1.HDKey.fromMnemonic(HDKeyFixture.words);
            (0, globals_1.expect)(root.publicKey).toBeDefined();
            (0, globals_1.expect)(root.chainCode).toBeDefined();
            const extendedRoot = src_1.HDKey.fromPublicKey(root.publicKey, root.chainCode);
            for (let i = 0; i < 5; i++) {
                const child = extendedRoot.deriveChild(i);
                (0, globals_1.expect)(child.privateKey).toBeNull();
                (0, globals_1.expect)(child.publicKey).toBeDefined();
                (0, globals_1.expect)(src_1.Address.ofPublicKey(child.publicKey).toString()).toEqual(HDKeyFixture.addresses[i]);
            }
        });
    });
    (0, globals_1.describe)('isDerivationPathValid method tests', () => {
        (0, globals_1.test)('isDerivationPathValid -> false', () => {
            HDKeyFixture.incorrectValidationPaths.forEach((path) => {
                (0, globals_1.expect)(src_1.HDKey.isDerivationPathValid(path)).toEqual(false);
            });
        });
        (0, globals_1.test)('isDerivationPath -> true', () => {
            HDKeyFixture.correctValidationPaths.forEach((path) => {
                (0, globals_1.expect)(src_1.HDKey.isDerivationPathValid(path)).toEqual(true);
            });
        });
    });
});
