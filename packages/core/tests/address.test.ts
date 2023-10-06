import { describe, expect, test } from '@jest/globals';
import { address } from '../src/address/address';
import { secp256k1 } from '../src/secp256k1/secp256k1';
import { ERRORS } from '../src/utils/errors';

describe('address.test', () => {
    test('validate address', () => {
        expect(address.isAddress('not an address')).toEqual(false);
        expect(
            address.isAddress('52908400098527886E0F7030069857D2E4169EE7')
        ).toEqual(false);
        expect(
            address.isAddress('0x52908400098527886E0F7030069857D2E4169EE7')
        ).toEqual(true);
    });
});

describe('derive', () => {
    const privKey = Buffer.from(
        '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
        'hex'
    );
    const pubKey = Buffer.from(
        '04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f',
        'hex'
    );
    const addr = '0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64';
    const invalidPrivateKey = Buffer.from('INVALID_PRIVATE_KEY', 'hex');
    expect(secp256k1.derive(privKey)).toEqual(pubKey);
    expect(address.fromPublicKey(pubKey)).toEqual(addr);

    // Invalid private key to derive public key
    expect(() => secp256k1.derive(invalidPrivateKey)).toThrow(
        ERRORS.SECP256K1.INVALID_PRIVATE_KEY
    );
});

describe('address.toChecksumed', () => {
    test('invalid input should throw error', () => {
        expect(() => {
            address.toChecksumed('invalid data');
        }).toThrow(ERRORS.ADDRESS.INVALID_ADDRESS);
        expect(() => {
            address.toChecksumed('52908400098527886E0F7030069857D2E4169EE7');
        }).toThrow(ERRORS.ADDRESS.INVALID_ADDRESS);
    });

    test('valid input', () => {
        expect(
            address.toChecksumed('0x8617E340B3D01FA5F11F306F4090FD50E238070D')
        ).toEqual('0x8617E340B3D01FA5F11F306F4090FD50E238070D');
        expect(
            address.toChecksumed(
                '0x8617E340B3D01FA5F11F306F4090FD50E238070D'.toLowerCase()
            )
        ).toEqual('0x8617E340B3D01FA5F11F306F4090FD50E238070D');
        expect(
            address.toChecksumed('0xde709f2102306220921060314715629080e2fb77')
        ).toEqual('0xde709f2102306220921060314715629080e2fb77');
        expect(
            address.toChecksumed(
                '0xde709f2102306220921060314715629080e2fb77'.toLowerCase()
            )
        ).toEqual('0xde709f2102306220921060314715629080e2fb77');
        expect(
            address.toChecksumed('0x27b1fdb04752bbc536007a920d24acb045561c26')
        ).toEqual('0x27b1fdb04752bbc536007a920d24acb045561c26');
        expect(
            address.toChecksumed('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
        ).toEqual('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
        expect(
            address.toChecksumed('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359')
        ).toEqual('0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359');
        expect(
            address.toChecksumed('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB')
        ).toEqual('0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB');
        expect(
            address.toChecksumed('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')
        ).toEqual('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb');
    });
});
