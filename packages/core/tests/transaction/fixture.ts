import { type TransactionBody } from '../../src';

/**
 * Simple correct transaction body fixture
 */
const correctTransactionBody: TransactionBody = {
    chainTag: 1,
    blockRef: '0x00000000aabbccdd',
    expiration: 32,
    clauses: [
        {
            to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            value: 10000,
            data: '0x000000606060'
        },
        {
            to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            value: 20000,
            data: '0x000000606060'
        }
    ],
    gasPriceCoef: 128,
    gas: 21000,
    dependsOn: null,
    nonce: 12345678
};

/**
 * Simple correct transaction body fixture with reserved field fixture
 */
const delegatedCorrectTransactionBody: TransactionBody = {
    ...correctTransactionBody,
    reserved: {
        features: 1
    }
};

/**
 * Simple correct transaction body fixture with reserved field fixture
 */
const delegatedCorrectTransactionBodyReservedField: TransactionBody = {
    ...correctTransactionBody,
    reserved: {
        features: 1,
        unused: [Buffer.from('0x000'), Buffer.from('0x000')]
    }
};

/**
 * Encoding of unsigned transaction taked from correctTransactionBody fixture
 */
const encodedUnsignedExpected = Buffer.from(
    'f8540184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0',
    'hex'
);

/**
 * Encoding of unsigned delefated transaction taked from correctTransactionBody fixture
 */
const encodedDelegatedUnsignedExpected = Buffer.from(
    'f8550184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec101',
    'hex'
);

/**
 * Simple private key fixture
 */
const signerPrivateKey = Buffer.from(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
    'hex'
);

/**
 * Simple private key of transaction delegator fixture
 */
const delegatorPrivateKey = Buffer.from(
    '40de805e918403683fb9a6081c3fba072cdc5c88232c62a9509165122488dab7',
    'hex'
);

/**
 * Simple invalid private key fixture
 */
const invalidSignerPrivateKey = Buffer.from('INVALID', 'hex');

/**
 * Encoding of signed transaction (signed) taked from correctTransactionBody fixture
 */
const encodedSignedExpected = Buffer.from(
    'f8970184aabbccdd20f840df947567d83b7b8d80addcb281a71d54fc7b3364ffed82271086000000606060df947567d83b7b8d80addcb281a71d54fc7b3364ffed824e208600000060606081808252088083bc614ec0b841f76f3c91a834165872aa9464fc55b03a13f46ea8d3b858e528fcceaf371ad6884193c3f313ff8effbb57fe4d1adc13dceb933bedbf9dbb528d2936203d5511df00',
    'hex'
);

export {
    correctTransactionBody,
    delegatedCorrectTransactionBody,
    encodedUnsignedExpected,
    encodedDelegatedUnsignedExpected,
    signerPrivateKey,
    delegatorPrivateKey,
    invalidSignerPrivateKey,
    encodedSignedExpected,
    delegatedCorrectTransactionBodyReservedField
};
