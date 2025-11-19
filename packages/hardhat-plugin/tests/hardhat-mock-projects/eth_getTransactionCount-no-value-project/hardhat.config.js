"use strict";
/**
 * Simple hardhat configuration for testing with a VeChain network defined
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../src/index");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Simple configuration for testing
 */
const vechainTestNetwork = {
    // Default network parameters
    url: 'https://testnet.vechain.org',
    timeout: 20000,
    httpHeaders: {},
    gas: 'auto',
    gasPrice: 'auto',
    gasMultiplier: 1,
    accounts: {
        mnemonic: 'vivid any call mammal mosquito budget midnight expose spirit approve reject system',
        path: sdk_core_1.HDKey.VET_DERIVATION_PATH,
        count: 3,
        initialIndex: 0,
        passphrase: 'VeChainThor' // eslint-disable-line sonarjs/no-hardcoded-passwords
    },
    // Custom parameters
    gasPayer: {
        gasPayerPrivateKey: 'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    },
    debug: true,
    enableDelegation: true
    // Custom RPC
    // ... NOT GIVEN ...
};
/**
 * Hardhat configuration
 */
const config = {
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
exports.default = config;
