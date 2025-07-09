import '@nomicfoundation/hardhat-toolbox';
import { HDKey } from '@vechain/sdk-core';
import '@vechain/sdk-hardhat-plugin';
import { type HardhatUserConfig } from 'hardhat/config';
import { type HttpNetworkConfig } from 'hardhat/types';

/**
 * Main hardhat configuration
 *
 * Here we have custom VeChain networks: 'vechain_mainnet', 'vechain_testnet' and 'vechain_solo'
 *
 * They have custom parameters:
 * - debug: whether to enable debug mode
 * - gasPayer: the gasPayer to use
 * - enableDelegation: whether to enable fee delegation
 */
const config: HardhatUserConfig = {
    solidity: {
        compilers: [
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
            debug: false,
            gasPayer: undefined,
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
                path: HDKey.VET_DERIVATION_PATH,
                count: 3,
                initialIndex: 0,
                passphrase: 'vechainthor'
            },
            debug: true,
            gasPayer: undefined,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig,

        /**
         * Testnet configuration - with gasPayer url
         */
        vechain_testnet_gas_payer_url: {
            // Testnet
            url: 'https://testnet.vechain.org',
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: HDKey.VET_DERIVATION_PATH,
                count: 3,
                initialIndex: 0,
                passphrase: 'vechainthor'
            },
            debug: true,
            gasPayer: {
                gasPayerServiceUrl:
                    'https://sponsor-testnet.vechain.energy/by/883'
            },
            enableDelegation: true,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig,

        /**
         * Testnet configuration - with gasPayer private key
         */
        vechain_testnet_gas_payer_private_key: {
            // Testnet
            url: 'https://testnet.vechain.org',
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: HDKey.VET_DERIVATION_PATH,
                count: 3,
                initialIndex: 0,
                passphrase: 'vechainthor'
            },
            debug: true,
            gasPayer: {
                gasPayerPrivateKey:
                    'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
            },
            enableDelegation: true,
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
            url: 'http://127.0.0.1:8669',
            accounts: [
                '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            ],
            debug: false,
            enableDelegation: false,
            gasPayer: undefined,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig,

        /**
         * Default hardhat network configuration
         */
        hardhat: {
            // Testnet
            accounts: {
                mnemonic:
                    'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
                path: HDKey.VET_DERIVATION_PATH,
                count: 3,
                initialIndex: 0
            },
            debug: true,
            gasPayer: undefined,
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        }
    }
};

export default config;
