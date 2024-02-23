import { type HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@vechain/vechain-sdk-hardhat-plugin';

import { VET_DERIVATION_PATH } from '@vechain/vechain-sdk-core';

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    console.log(await hre.network.provider.request({ method: 'eth_accounts' }));
});

/**
 * Main hardhat configuration
 *
 * Here we have custom vechain networks: 'vechain_mainnet', 'vechain_testnet' and 'vechain_solo'
 *
 * They have custom parameters:
 * - debugMode: whether to enable debug mode
 * - delegator: the delegator to use
 */
const config: HardhatUserConfig = {
    solidity: '0.8.17',
    networks: {
        /**
         * Mainnet configuration
         */
        vechain_mainnet: {
            // Mainnet
            url: 'https://mainnet.vechain.org',
            accounts: [],
            debugMode: true,
            delegator: {},
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        },

        /**
         * Testnet configuration
         */
        vechain_testnet: {
            // Testnet
            url: 'https://testnet.vechain.org',
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: VET_DERIVATION_PATH,
                count: 1,
                initialIndex: 0
            },
            debugMode: true,
            delegator: {},
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        },

        /**
         * Thor solo network configuration
         */
        vechain_solo: {
            // Thor solo network
            url: 'http://localhost:8669',
            accounts: [
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            ],
            debugMode: true,
            delegator: {},
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        }
    }
};

export default config;
