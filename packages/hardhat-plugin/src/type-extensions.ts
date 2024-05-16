import {
    type HardhatVechainProvider,
    type SignTransactionOptions
} from '@vechain/sdk-network';

// Ethers types
import { type vechain_sdk_core_ethers as ethers } from '@vechain/sdk-core';

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import 'hardhat/types/config';
import 'hardhat/types/runtime';
import { type HardhatEthersHelpers } from '@nomicfoundation/hardhat-ethers/types';

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
 * - Add `debug` to `HttpNetworkConfig`
 * - Add `enableDelegation` to `HttpNetworkConfig`
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
        debug?: boolean;

        /**
         * Enable or not the fee's delegation of the transaction.
         */
        enableDelegation?: boolean;
    }
}
