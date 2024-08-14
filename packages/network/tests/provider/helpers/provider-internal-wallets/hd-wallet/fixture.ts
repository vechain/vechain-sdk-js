import { VET_DERIVATION_PATH } from '@vechain/sdk-core';
import { type SignTransactionOptions } from '../../../../../src';

/**
 * HDNode fixtures
 */
const hdNodeFixtures = [
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        path: VET_DERIVATION_PATH,
        count: 5,
        initialIndex: 0,
        delegator: {
            delegatorPrivateKey:
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
        } satisfies SignTransactionOptions,
        expectedAddress: [
            '0x783de01f06b4f2a068a7b3bb6ff3db821a08f8c1',
            '0x2406180bca83983d40191febc6d939c62152b71b',
            '0xb381e7da548601b1ccb05c66d415b20bae40d828',
            '0x9829ef01ad8f7c042613d4dc5a54d54e2c140bae',
            '0x2c5d39ebb1be41a62bcc9c50f4f49149dc1bb256'
        ]
    },
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        count: 1,
        initialIndex: 6,
        delegator: {
            delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/269'
        } satisfies SignTransactionOptions,
        expectedAddress: ['0x8ef651ac457c9bf5206ec3d2cbd4232df0438607']
    },
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        expectedAddress: ['0x783de01f06b4f2a068a7b3bb6ff3db821a08f8c1']
    }
];

export { hdNodeFixtures };
