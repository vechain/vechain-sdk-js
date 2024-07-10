import * as n_utils from '@noble/curves/abstract/utils';

/**
 * Simple private key
 */
const simplePrivateKeyFixture = n_utils.hexToBytes(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
);

/**
 * Simple public key uncompressed
 */
const simpleUncompressedPublicKeyFixture = n_utils.hexToBytes(
    '04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f'
);

/**
 * Simple address
 */
const simpleAddressFixture = '0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64';

/**
 * Checksummed and unchecksummed addresses
 */
const checksummedAndUnchecksummedAddressesFixture = [
    {
        unchecksummed: '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
        checksummed: '0x8617E340B3D01FA5F11F306F4090FD50E238070D'
    },
    {
        unchecksummed:
            '0x8617E340B3D01FA5F11F306F4090FD50E238070D'.toLowerCase(),
        checksummed: '0x8617E340B3D01FA5F11F306F4090FD50E238070D'
    },
    {
        unchecksummed: '0xde709f2102306220921060314715629080e2fb77',
        checksummed: '0xde709f2102306220921060314715629080e2fb77'
    },
    {
        unchecksummed: '0xde709f2102306220921060314715629080e2fb77',
        checksummed: '0xde709f2102306220921060314715629080e2fb77'
    },
    {
        unchecksummed: '0x27b1fdb04752bbc536007a920d24acb045561c26',
        checksummed: '0x27b1fdb04752bbc536007a920d24acb045561c26'
    },
    {
        unchecksummed: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
        checksummed: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
    },
    {
        unchecksummed: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
        checksummed: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'
    },
    {
        unchecksummed: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
        checksummed: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB'
    },
    {
        unchecksummed: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
        checksummed: '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb'
    }
];

export {
    simplePrivateKeyFixture,
    simpleUncompressedPublicKeyFixture,
    simpleAddressFixture,
    checksummedAndUnchecksummedAddressesFixture
};
