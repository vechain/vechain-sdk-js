import { type HardhatVeChainProvider, type SignTransactionOptions } from '@vechain/sdk-network';
import { type ethers } from 'ethers';
import 'hardhat/types/config';
import 'hardhat/types/runtime';
/**
 * Hardhat runtime environment extension
 *
 * - Add `VeChainProvider` to `HardhatRuntimeEnvironment`
 */
declare module 'hardhat/types/runtime' {
    interface HardhatRuntimeEnvironment {
        /**
         * The VeChain provider.
         * Useful to have for custom functionality.
         */
        VeChainProvider?: HardhatVeChainProvider;
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
 * - Add `gasPayer` to `HttpNetworkConfig`
 * - Add `debug` to `HttpNetworkConfig`
 * - Add `enableDelegation` to `HttpNetworkConfig`
 */
declare module 'hardhat/types/config' {
    interface HttpNetworkConfig {
        /**
         * Delegate the transaction to a gasPayer.
         *
         * We can give following two optional parameters:
         * - gasPayerPrivateKey: string
         * - gasPayerServiceUrl: string
         */
        gasPayer?: SignTransactionOptions;
        /**
         * Debug mode enabled or not.
         */
        debug?: boolean;
        /**
         * Enable or not the fee's delegation of the transaction.
         */
        enableDelegation?: boolean;
        /**
         * RPC Configuration
         */
        rpcConfiguration?: {
            ethGetTransactionCountMustReturn0: boolean;
        };
    }
}
//# sourceMappingURL=type-extensions.d.ts.map