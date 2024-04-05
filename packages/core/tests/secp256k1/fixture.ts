import { keccak256 } from '../../src';

/**
 * Simple public key and private key pair with corresponding signature
 */
const privateKey = Buffer.from(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
    'hex'
);

const publicKeyCompressed = Buffer.from(
    '03b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304a',
    'hex'
);

const publicKeyUncompressed = Buffer.from(
    '04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f',
    'hex'
);

const signature = Buffer.from(
    'f8fe82c74f9e1f5bf443f8a7f8eb968140f554968fdcab0a6ffe904e451c8b9244be44bccb1feb34dd20d9d8943f8c131227e55861736907b02d32c06b934d7200',
    'hex'
);

/**
 * Simple message hashs
 */
const messageHashBuffer = Buffer.from(keccak256('hello world'));
const validMessageHashes = [messageHashBuffer];
const invalidMessageHashes = [Buffer.from('some_invalid_stuff', 'hex')];

/**
 * Valid and invalid private keys
 */
const validPrivateKeys = [
    // PLEASE: Don't use this private key for your wallet :D
    Buffer.from(
        '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
        'hex'
    )
];

export {
    invalidMessageHashes,
    messageHashBuffer,
    privateKey,
    publicKeyCompressed,
    publicKeyUncompressed,
    signature,
    validMessageHashes,
    validPrivateKeys
};
