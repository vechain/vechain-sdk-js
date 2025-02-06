import { HDKey } from '@vechain/sdk-core';
import { type SignTransactionOptions } from '../../../../../src';

/**
 * HDNode fixtures
 */
const hdNodeFixtures = [
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        path: HDKey.VET_DERIVATION_PATH,
        count: 5,
        initialIndex: 0,
        gasPayer: {
            gasPayerPrivateKey:
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
        } satisfies SignTransactionOptions,
        expectedAddress: [
            '0x783DE01F06b4F2a068A7b3Bb6ff3db821A08f8c1',
            '0x2406180BCa83983d40191Febc6d939C62152B71b',
            '0xB381e7da548601B1CCB05C66d415b20baE40d828',
            '0x9829EF01aD8F7C042613d4Dc5a54D54e2c140bae',
            '0x2C5d39ebB1be41a62BcC9c50F4f49149dc1BB256'
        ]
    },
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        count: 1,
        initialIndex: 6,
        gasPayer: {
            gasPayerServiceUrl: 'https://sponsor-testnet.vechain.energy/by/269'
        } satisfies SignTransactionOptions,
        expectedAddress: ['0x8ef651aC457C9bf5206EC3D2cbD4232Df0438607']
    },
    {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        expectedAddress: ['0x783DE01F06b4F2a068A7b3Bb6ff3db821A08f8c1']
    }
];

export { hdNodeFixtures };
