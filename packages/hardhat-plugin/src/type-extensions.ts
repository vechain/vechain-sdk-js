import { type SignTransactionOptions } from '@vechain/vechain-sdk-network';

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import 'hardhat/types/config';

/**
 * Hardhat config extension
 *
 * - Add `delegator` to `HttpNetworkConfig`
 */
declare module 'hardhat/types/config' {
    export interface HttpNetworkConfig {
        delegator?: SignTransactionOptions;
        debug?: boolean;
    }
}
