import type { ThorClient } from '../../../../../../thor-client';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { ethGetBlockByHash } from '../eth_getBlockByHash';
import { ThorId } from '@vechain/sdk-core';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getBlockTransactionCountByHash implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 * @returns The number of transactions in the block with the given block hash.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockTransactionCountByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<number> => {
    // Input validation
    if (
        params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !ThorId.isValid(params[0])
    )
        throw new JSONRPCInvalidParams(
            'eth_getBlockTransactionCountByHash',
            -32602,
            `Invalid input params for "eth_getBlockTransactionCountByHash" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    const block = await ethGetBlockByHash(thorClient, [params[0], false]);
    if (block !== null) return block.transactions.length;
    return 0;
};

export { ethGetBlockTransactionCountByHash };
