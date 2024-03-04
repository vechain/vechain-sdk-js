import { type HardhatUserConfig, task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@vechain/vechain-sdk-hardhat-plugin';

import { VET_DERIVATION_PATH } from '@vechain/vechain-sdk-core';
import { type HttpNetworkConfig } from 'hardhat/types';

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
    solidity: {
        compilers: [
            {
                version: '0.8.17', // Specify the first Solidity version
                settings: {
                    // Additional compiler settings for this version
                    optimizer: {
                        enabled: true,
                        runs: 200
                    },
                    evmVersion: 'london' // EVM version (e.g., "byzantium", "constantinople", "petersburg", "istanbul", "berlin", "london")
                }
            },
            {
                version: '0.8.20', // Specify the first Solidity version
                settings: {
                    // Additional compiler settings for this version
                    optimizer: {
                        enabled: true,
                        runs: 200
                    },
                    evmVersion: 'paris'
                }
            }
        ]
    },
    networks: {
        /**
         * Mainnet configuration
         */
        vechain_mainnet: {
            // Mainnet
            url: 'https://mainnet.vechain.org',
            accounts: [
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            ],
            debugMode: false,
            delegator: undefined,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig,

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
                count: 3,
                initialIndex: 0,
                passphrase: 'vechainthor'
            },
            debugMode: true,
            delegator: undefined,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig,

        /**
         * Thor solo network configuration
         */
        vechain_solo: {
            // Thor solo network
            url: 'http://localhost:8669',
            accounts: [
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            ],
            debugMode: false,
            delegator: undefined,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig
    }
};

export default config;
