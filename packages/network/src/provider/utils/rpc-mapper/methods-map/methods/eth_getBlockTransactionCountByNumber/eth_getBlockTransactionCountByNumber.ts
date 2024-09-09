import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';
import type { ThorClient } from '../../../../../../thor-client';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';

/**
 * RPC Method eth_getBlockTransactionCountByNumber implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 * @returns The number of transactions in the block with the given block hash.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockTransactionCountByNumber = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<number> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new JSONRPCInvalidParams(
            'eth_getBlockTransactionCountByNumber',
            -32602,
            `Invalid input params for "eth_getBlockTransactionCountByNumber" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    const block = await ethGetBlockByNumber(thorClient, [params[0], false]);
    if (block !== null) return block.transactions.length;
    return 0;
};

export { ethGetBlockTransactionCountByNumber };
