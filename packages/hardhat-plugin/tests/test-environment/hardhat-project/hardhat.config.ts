// We load the plugin here.
import { type HardhatUserConfig, type HttpNetworkConfig } from 'hardhat/types';

import '../../../src/index';

/**
 * Simple configuration for testing
 */
const networkConfig: HttpNetworkConfig = {
    // Default network parameters
    url: 'http://localhost:8669',
    timeout: 20000,
    httpHeaders: {},
    gas: 'auto',
    gasPrice: 'auto',
    gasMultiplier: 1,
    accounts: [],

    // Custom parameters
    delegator: {
        delegatorPrivatekey:
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        delegatorUrl: 'https://sponsor-testnet.vechain.energy/by/269'
    },
    debug: true
};

/**
 * Hardhat configuration
 */
const config: HardhatUserConfig = {
    solidity: '0.8.17',
    networks: {
        vechain: networkConfig
    }
};

export default config;
