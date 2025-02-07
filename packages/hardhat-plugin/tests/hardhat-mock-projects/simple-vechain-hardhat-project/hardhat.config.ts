/**
 * Simple hardhat configuration for testing with a VeChain network defined
 */

// We load the plugin here.
import { type HardhatUserConfig, type HttpNetworkConfig } from 'hardhat/types';

import '../../../src/index';
import { HDKey } from '@vechain/sdk-core';

/**
 * Simple configuration for testing
 */
const vechainTestNetwork: HttpNetworkConfig = {
    // Default network parameters
    url: 'https://testnet.vechain.org',
    timeout: 20000,
    httpHeaders: {},
    gas: 'auto',
    gasPrice: 'auto',
    gasMultiplier: 1,
    accounts: {
        mnemonic:
            'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        path: HDKey.VET_DERIVATION_PATH,
        count: 3,
        initialIndex: 0,
        passphrase: 'VeChainThor'
    },

    // Custom parameters
    delegator: {
        gasPayerPrivateKey:
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    },
    debug: true,
    enableDelegation: true
};

/**
 * Thor solo network configuration
 */
const vechainSoloNetwork = {
    // Thor solo network
    url: 'http://localhost:8669',
    accounts: [
        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
    ],
    debug: false,
    delegator: undefined,
    enableDelegation: false,
    gas: 'auto',
    gasPrice: 'auto',
    gasMultiplier: 1,
    timeout: 20000,
    httpHeaders: {}
} satisfies HttpNetworkConfig;

/**
 * Hardhat configuration
 */
const config: HardhatUserConfig = {
    solidity: '0.8.17',
    networks: {
        vechain_solo: vechainSoloNetwork,
        vechain_testnet: vechainTestNetwork
    },

    /**
     * @note: here we set vechain_testnet as the default network to simulate a command like this:
     *
     * ```sh
     * npx hardhat --network vechain_testnet <command>
     * ```
     */
    defaultNetwork: 'vechain_solo'
};

export default config;
