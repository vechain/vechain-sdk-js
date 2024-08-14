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
            '0x783De01F06B4F2a068a7b3bB6fF3Db821A08f8C1',
            '0x2406180bcA83983D40191FEbC6D939C62152b71B',
            '0xB381e7dA548601B1CCb05C66d415B20bAE40D828',
            '0x9829Ef01Ad8f7C042613D4dc5a54D54e2C140bAE',
            '0x2C5d39ebb1Be41a62BcC9c50F4F49149Dc1bb256'
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
        expectedAddress: ['0x8eF651AC457C9Bf5206Ec3d2cbd4232df0438607']
    },
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        expectedAddress: ['0x783De01F06B4F2a068a7b3bB6fF3Db821A08f8C1']
    }
];

export { hdNodeFixtures };
