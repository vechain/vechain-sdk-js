import { VET_DERIVATION_PATH } from '@vechain/vechain-sdk-core';

/**
 * HDNode fixtures
 */
const hdNodeFixture = {
    mnemonic:
        'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
    path: VET_DERIVATION_PATH,
    count: 1,
    initialIndex: 0,
    delegator: {
        delegatorPrivateKey:
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
    },
    expectedAddress: [
        '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
    ]
};

export { hdNodeFixture };
