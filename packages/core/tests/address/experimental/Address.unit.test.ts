import { Address } from '../../../src/address/experimental/Address';
import { HEX } from '../../../src';
import { InvalidDataTypeError } from '@vechain/sdk-errors';
import { describe, expect, test } from '@jest/globals';

/**
 * Test Address class.
 * @group unit/address/experimental
 */
const AddressFixture = {
    key: {
        address: new Address('0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64'),
        private: new HEX(
            '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
        ),
        public: new HEX(
            '04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f'
        )
    },
    erc55: [
        '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
        '0xde709f2102306220921060314715629080e2fb77',
        '0x27b1fdb04752bbc536007a920d24acb045561c26',
        '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
        '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
        '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb'
    ]
};

describe('Address class tests', () => {
    describe('constructor should comply ERC55 checksum representation', () => {
        AddressFixture.erc55.forEach((erc55) => {
            test(`constructor for ${erc55}`, () => {
                const lc = new Address(erc55.toLowerCase());
                const uc = new Address(erc55.toUpperCase());
                expect(lc.toString()).toBe(erc55);
                expect(uc.toString()).toBe(erc55);
                expect(lc).toStrictEqual(uc);
            });
        });
    });

    test('constructor should fail for illegal address expression', () => {
        expect(() => new Address('caffee')).toThrow(InvalidDataTypeError);
    });

    test('static isValid should return false', () => {
        expect(Address.isValid('caffee')).toBeFalsy();
    });

    test('static isValid should return true - 0x prefix', () => {
        expect(
            Address.isValid(AddressFixture.key.address.toString())
        ).toBeTruthy();
    });

    test('static isValid should return true - no prefix', () => {
        expect(Address.isValid(AddressFixture.key.address.hex)).toBeTruthy();
    });

    test('static of should return its address', () => {
        expect(Address.of(AddressFixture.key.address.bytes)).toStrictEqual(
            AddressFixture.key.address
        );
    });

    test('static ofPrivateKey should return its address', () => {
        expect(
            Address.ofPrivateKey(AddressFixture.key.private.bytes)
        ).toStrictEqual(AddressFixture.key.address);
    });

    test('static ofPublicKey should return its address', () => {
        expect(
            Address.ofPublicKey(AddressFixture.key.public.bytes)
        ).toStrictEqual(AddressFixture.key.address);
    });
});
