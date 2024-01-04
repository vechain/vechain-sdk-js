import { type ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { type MethodHandlerType } from './types';
import { RPC_METHODS } from '../const/rpc-mapper';
import { BlocksMap } from './methods-map';
import { TransactionsMap } from './methods-map/transactions';

/**
 * Map of RPC methods to their implementations with our SDK.
 * We can consider this as a "RPC Mapper" for our SDK.
 *
 * List of all RPC methods:
 * * https://eth.wiki/json-rpc/API
 * * https://ethereum.github.io/execution-apis/api-documentation/
 *
 * ------ TEMPORARY COMMENT ------
 * We cannot complete all the RPC methods in this PR!
 * ------------------------------
 */
const RPCMethodsMap = (
    thorClient: ThorClient
): Record<string, MethodHandlerType<unknown, unknown>> => {
    /**
     * Returns a map of RPC methods to their implementations with our SDK.
     */
    return {
        /**
         * Returns the block with the given block number.
         */
        [RPC_METHODS.eth_getBlockByNumber]:
            BlocksMap(thorClient)[RPC_METHODS.eth_getBlockByNumber],

        /**
         * Returns the transaction receipt with the given transaction hash.
         */
        [RPC_METHODS.eth_getTransactionReceipt]:
            TransactionsMap(thorClient)[RPC_METHODS.eth_getTransactionReceipt]

        /**
         * ... Other RPC methods ...
         */
        // ...
    };
};

export { RPCMethodsMap };
