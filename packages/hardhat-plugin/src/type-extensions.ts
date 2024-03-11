import { type SignTransactionOptions } from '@vechain/sdk-network';
import { type HardhatVechainProvider } from '@vechain/sdk-provider';

// Ethers types
import { type HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types';
import { type vechain_sdk_core_ethers as ethers } from '@vechain/sdk-core';

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import 'hardhat/types/config';
import 'hardhat/types/runtime';

/**
 * Hardhat runtime environment extension
 *
 * - Add `vechainProvider` to `HardhatRuntimeEnvironment`
 */
declare module 'hardhat/types/runtime' {
    interface HardhatRuntimeEnvironment {
        /**
         * The vechain provider.
         * Useful to have for custom functionality.
         */
        vechainProvider?: HardhatVechainProvider;

        /**
         * The ethers object.
         * Useful to customize ethers functionality.
         */
        ethers: typeof ethers & HardhatEthersHelpers;
    }
}

/**
 * Hardhat config extension
 *
 * - Add `delegator` to `HttpNetworkConfig`
 * - Add `debugMode` to `HttpNetworkConfig`
 */
declare module 'hardhat/types/config' {
    export interface HttpNetworkConfig {
        /**
         * Delegate the transaction to a delegator.
         *
         * We can give following two optional parameters:
         * - delegatorPrivateKey: string
         * - delegatorUrl: string
         */
        delegator?: SignTransactionOptions;

        /**
         * Debug mode enabled or not.
         */
        debugMode?: boolean;
    }
}
