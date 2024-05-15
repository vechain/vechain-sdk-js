import { MAINNET_NETWORK, TESTNET_NETWORK } from '../../../../core';

const NetworkContracts: Record<
    string,
    { registry: string; resolveUtils: string }
> = {
    // MainNet
    [MAINNET_NETWORK.genesisBlock.id]: {
        registry: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
        resolveUtils: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
    },

    // TestNet
    [TESTNET_NETWORK.genesisBlock.id]: {
        registry: '0xcBFB30c1F267914816668d53AcBA7bA7c9806D13',
        resolveUtils: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94'
    }
};

export { NetworkContracts };
