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
        delegatorPrivateKey:
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    },
    debug: true,
    enableDelegation: true

    // Custom RPC
    // ... NOT GIVEN ...
};

/**
 * Hardhat configuration
 */
const config: HardhatUserConfig = {
    solidity: '0.8.17',
    networks: {
        vechain_testnet: vechainTestNetwork
    },

    /**
     * @note: here we set vechain_testnet as the default network to simulate a command like this:
     *
     * ```sh
     * npx hardhat --network vechain_testnet <command>
     * ```
     */
    defaultNetwork: 'vechain_testnet'
};

export default config;
