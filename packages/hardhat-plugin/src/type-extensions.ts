import { type SignTransactionOptions } from '@vechain/vechain-sdk-network';
import { type HardhatVechainProvider } from '@vechain/vechain-sdk-provider';

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
        vechainProvider?: HardhatVechainProvider;
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
