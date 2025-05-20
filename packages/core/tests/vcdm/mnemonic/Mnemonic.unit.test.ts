import { describe, expect, test } from '@jest/globals';
import {
    Address,
    HDKey,
    HexUInt,
    Mnemonic,
    Secp256k1,
    type WordListRandomGeneratorSizeInBytes,
    type WordlistSizeType
} from '../../../src';
import { InvalidHDKey, InvalidOperation } from '@vechain/sdk-errors';

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
const customRandomGeneratorWithXor = (
    numberOfBytes: WordListRandomGeneratorSizeInBytes
): Uint8Array => {
    const r1 = Secp256k1.randomBytes(numberOfBytes);
    const r2 = Secp256k1.randomBytes(numberOfBytes);
    return r1.map((byte, index) => byte ^ r2[index]);
};

/**
 * Test Mnemonic class.
 * @group unit/vcdm
 */
describe('Mnemonic class tests', () => {
    // Tests checked with
    // https://learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths/
    describe('toPrivateKey', () => {
        test('ok <- from default BIP44 VET derivation path', () => {
            const expected = HexUInt.of(
                '0xe4a2687ec443f4d23b6ba9e7d904a31acdda90032b34aa0e642e6dd3fd36f682'
            );
            const actual = HexUInt.of(Mnemonic.toPrivateKey(WORDS));
            expect(actual).toEqual(expected);
        });

        test('ok <- from standard BIP44 VET derivation path', () => {
            const master = HDKey.fromMnemonic(WORDS, HDKey.VET_DERIVATION_PATH);
            for (let i = 0; i < 10; i++) {
                const childFromIndex = master.deriveChild(i);
                const path = `${HDKey.VET_DERIVATION_PATH}/${i}`;
                const childFromPath = HDKey.fromMnemonic(WORDS, path);
                expect(childFromIndex.privateKey).toEqual(
                    childFromPath.privateKey
                );
                const actual = Mnemonic.toPrivateKey(WORDS, path);
                expect(childFromPath.privateKey).toEqual(actual);
            }
        });

        test('ok <- from custom m/0/1 derivation path', () => {
            const path = 'm/0/1';
            const expected = HexUInt.of(
                '0x731311cb9643cf4cf7a3a051fe02ae56cf6887708d1f2d3b07e1b4bebeb742a8'
            );
            const actual = HexUInt.of(Mnemonic.toPrivateKey(WORDS, path));
            expect(actual).toEqual(expected);
        });

        test('ok <- from deep custom m/0/1/4/2/4/3 derivation path', () => {
            const path = 'm/0/1/4/2/4/3';
            const expected = HexUInt.of(
                '0x4d61a740e8e9964284c96e92e5e95e05eb732d61a5c3fb1557ca99398f041ba0'
            );
            const actual = HexUInt.of(Mnemonic.toPrivateKey(WORDS, path));
            expect(actual).toEqual(expected);
        });

        test('err <- from illegal path', () => {
            const illegalPath = 'm/0/1/4/2/4/h';
            expect(() =>
                Mnemonic.toPrivateKey(WORDS, illegalPath)
            ).toThrowError(InvalidHDKey);
        });
    });

    describe('of', () => {
        test('ok <- custom parameters', () => {
            // Loop on custom lengths.
            [12, 15, 18, 21, 24].forEach(
                // Loop on custom generators of entropy.
                (length) => {
                    [
                        customRandomGeneratorWithXor,
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        Secp256k1.randomBytes,
                        undefined
                    ].forEach((randomGenerator) => {
                        // Generate mnemonic words of expected length
                        const words = Mnemonic.of(
                            length as WordlistSizeType,
                            randomGenerator
                        );
                        expect(words.length).toEqual(length);

                        // Validate mnemonic words
                        expect(Mnemonic.isValid(words)).toEqual(true);

                        // Derive private key from mnemonic words
                        expect(Mnemonic.toPrivateKey(words)).toBeDefined();
                        expect(Mnemonic.toPrivateKey(words).length).toEqual(32);
                        expect(
                            Secp256k1.isValidPrivateKey(
                                Mnemonic.toPrivateKey(words)
                            )
                        ).toEqual(true);

                        // Derive address from mnemonic words
                        expect(Address.ofMnemonic(words)).toBeDefined();
                        expect(
                            Address.ofMnemonic(words).toString().length
                        ).toEqual(42);
                        expect(
                            Address.isValid(
                                Address.ofMnemonic(words).toString()
                            )
                        ).toBe(true);
                    });
                }
            );
        });

        test('ok <- default length', () => {
            expect(Mnemonic.of().length).toEqual(12);
        });

        test('error <- illegal length', () => {
            expect(() => {
                // @ts-expect-error - Wrong length error for testing purposes.
                Mnemonic.of(13);
            }).toThrowError();
        });
    });

    describe('VCDM tests', () => {
        describe('bytes', () => {
            test('ok <- as bytes', () => {
                const mnemonic = new Mnemonic();
                expect(mnemonic.bytes).toBeInstanceOf(Uint8Array);
            });
        });

        describe('isValid', () => {
            test('false <- illegal words', () => {
                expect(Mnemonic.isValid('hello world')).toBeFalsy();
            });

            // All valid length tested in test of.ok <- custom parameters
            test('true <- default', () => {
                expect(Mnemonic.isValid(Mnemonic.of())).toBeTruthy();
            });
        });

        describe('Unused methods tests', () => {
            test('err <- as bi', () => {
                const mnemonic = new Mnemonic();
                expect(() => mnemonic.bi).toThrow(InvalidOperation);
            });
            test('err <- as n', () => {
                const mnemonic = new Mnemonic();
                expect(() => mnemonic.n).toThrow(InvalidOperation);
            });
            test('err <- compareTo', () => {
                const mnemonic = new Mnemonic();
                expect(() => mnemonic.compareTo(new Mnemonic())).toThrow(
                    InvalidOperation
                );
            });
            test('err <- isEqual', () => {
                const mnemonic = new Mnemonic();
                expect(() => mnemonic.isEqual(new Mnemonic())).toThrow(
                    InvalidOperation
                );
            });
        });
    });
});
