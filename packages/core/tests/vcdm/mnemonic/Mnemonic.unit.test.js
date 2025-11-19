"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Mnemonic words fixture.
 */
const WORDS = [
    'ignore',
    'empty',
    'bird',
    'silly',
    'journey',
    'junior',
    'ripple',
    'have',
    'guard',
    'waste',
    'between',
    'tenant'
];
/**
 * Custom random generator with XOR
 */
const customRandomGeneratorWithXor = (numberOfBytes) => {
    const r1 = src_1.Secp256k1.randomBytes(numberOfBytes);
    const r2 = src_1.Secp256k1.randomBytes(numberOfBytes);
    return r1.map((byte, index) => byte ^ r2[index]);
};
/**
 * Test Mnemonic class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Mnemonic class tests', () => {
    // Tests checked with
    // https://learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths/
    (0, globals_1.describe)('toPrivateKey', () => {
        (0, globals_1.test)('ok <- from default BIP44 VET derivation path', () => {
            const expected = src_1.HexUInt.of('0x27196338e7d0b5e7bf1be1c0327c53a244a18ef0b102976980e341500f492425');
            const actual = src_1.HexUInt.of(src_1.Mnemonic.toPrivateKey(WORDS));
            (0, globals_1.expect)(actual.toString()).toEqual(expected.toString());
        });
        (0, globals_1.test)('ok <- from standard BIP44 VET derivation path', () => {
            const master = src_1.HDKey.fromMnemonic(WORDS, src_1.HDKey.VET_DERIVATION_PATH);
            for (let i = 0; i < 10; i++) {
                const childFromIndex = master.deriveChild(i);
                const path = `${src_1.HDKey.VET_DERIVATION_PATH}/${i}`;
                const childFromPath = src_1.HDKey.fromMnemonic(WORDS, path);
                (0, globals_1.expect)(childFromIndex.privateKey).toEqual(childFromPath.privateKey);
                const actual = src_1.Mnemonic.toPrivateKey(WORDS, path);
                (0, globals_1.expect)(childFromPath.privateKey).toEqual(actual);
            }
        });
        (0, globals_1.test)('ok <- from custom m/0/1 derivation path', () => {
            const path = 'm/0/1';
            const expected = src_1.HexUInt.of('0x731311cb9643cf4cf7a3a051fe02ae56cf6887708d1f2d3b07e1b4bebeb742a8');
            const actual = src_1.HexUInt.of(src_1.Mnemonic.toPrivateKey(WORDS, path));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        (0, globals_1.test)('ok <- from deep custom m/0/1/4/2/4/3 derivation path', () => {
            const path = 'm/0/1/4/2/4/3';
            const expected = src_1.HexUInt.of('0x4d61a740e8e9964284c96e92e5e95e05eb732d61a5c3fb1557ca99398f041ba0');
            const actual = src_1.HexUInt.of(src_1.Mnemonic.toPrivateKey(WORDS, path));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        (0, globals_1.test)('err <- from illegal path', () => {
            const illegalPath = 'm/0/1/4/2/4/h';
            (0, globals_1.expect)(() => src_1.Mnemonic.toPrivateKey(WORDS, illegalPath)).toThrowError(sdk_errors_1.InvalidHDKey);
        });
    });
    (0, globals_1.describe)('of', () => {
        (0, globals_1.test)('ok <- custom parameters', () => {
            // Loop on custom lengths.
            [12, 15, 18, 21, 24].forEach(
            // Loop on custom generators of entropy.
            (length) => {
                [
                    customRandomGeneratorWithXor,
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    src_1.Secp256k1.randomBytes,
                    undefined
                ].forEach((randomGenerator) => {
                    // Generate mnemonic words of expected length
                    const words = src_1.Mnemonic.of(length, randomGenerator);
                    (0, globals_1.expect)(words.length).toEqual(length);
                    // Validate mnemonic words
                    (0, globals_1.expect)(src_1.Mnemonic.isValid(words)).toEqual(true);
                    // Derive private key from mnemonic words
                    (0, globals_1.expect)(src_1.Mnemonic.toPrivateKey(words)).toBeDefined();
                    (0, globals_1.expect)(src_1.Mnemonic.toPrivateKey(words).length).toEqual(32);
                    (0, globals_1.expect)(src_1.Secp256k1.isValidPrivateKey(src_1.Mnemonic.toPrivateKey(words))).toEqual(true);
                    // Derive address from mnemonic words
                    (0, globals_1.expect)(src_1.Address.ofMnemonic(words)).toBeDefined();
                    (0, globals_1.expect)(src_1.Address.ofMnemonic(words).toString().length).toEqual(42);
                    (0, globals_1.expect)(src_1.Address.isValid(src_1.Address.ofMnemonic(words).toString())).toBe(true);
                });
            });
        });
        (0, globals_1.test)('ok <- default length', () => {
            (0, globals_1.expect)(src_1.Mnemonic.of().length).toEqual(12);
        });
        (0, globals_1.test)('error <- illegal length', () => {
            (0, globals_1.expect)(() => {
                // @ts-expect-error - Wrong length error for testing purposes.
                src_1.Mnemonic.of(13);
            }).toThrowError();
        });
    });
    (0, globals_1.describe)('VCDM tests', () => {
        (0, globals_1.describe)('bytes', () => {
            (0, globals_1.test)('ok <- as bytes', () => {
                const mnemonic = new src_1.Mnemonic();
                (0, globals_1.expect)(mnemonic.bytes).toBeInstanceOf(Uint8Array);
            });
        });
        (0, globals_1.describe)('isValid', () => {
            (0, globals_1.test)('false <- illegal words', () => {
                (0, globals_1.expect)(src_1.Mnemonic.isValid('hello world')).toBeFalsy();
            });
            // All valid length tested in test of.ok <- custom parameters
            (0, globals_1.test)('true <- default', () => {
                (0, globals_1.expect)(src_1.Mnemonic.isValid(src_1.Mnemonic.of())).toBeTruthy();
            });
        });
        (0, globals_1.describe)('Unused methods tests', () => {
            (0, globals_1.test)('err <- as bi', () => {
                const mnemonic = new src_1.Mnemonic();
                (0, globals_1.expect)(() => mnemonic.bi).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('err <- as n', () => {
                const mnemonic = new src_1.Mnemonic();
                (0, globals_1.expect)(() => mnemonic.n).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('err <- compareTo', () => {
                const mnemonic = new src_1.Mnemonic();
                (0, globals_1.expect)(() => mnemonic.compareTo(new src_1.Mnemonic())).toThrow(sdk_errors_1.InvalidOperation);
            });
            (0, globals_1.test)('err <- isEqual', () => {
                const mnemonic = new src_1.Mnemonic();
                (0, globals_1.expect)(() => mnemonic.isEqual(new src_1.Mnemonic())).toThrow(sdk_errors_1.InvalidOperation);
            });
        });
    });
});
