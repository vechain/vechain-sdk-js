import { type ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { type MethodHandlerType } from './types';
import { RPC_METHODS } from '../const/rpc-mapper';
import { ethGetTransactionByHash, ethGetBlockByNumber } from './methods-map';

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
        [RPC_METHODS.eth_getBlockByNumber]: async (params) =>
            await ethGetBlockByNumber(thorClient, params),

        /**
         * Returns the transaction receipt with the given transaction hash.
         */
        [RPC_METHODS.eth_getTransactionByHash]: async (params) => {
            await ethGetTransactionByHash(thorClient, params);
        }

        /**
         * ... Other RPC methods ...
         */
        // ...
    };
};

export { RPCMethodsMap };
