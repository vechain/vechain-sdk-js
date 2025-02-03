import { BlockId } from '@vechain/sdk-core/src';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type BlocksRPC } from '../../../formatter';
import { type ThorClient } from '../../../../../thor-client';

/**
 * RPC Method eth_getBlockByHash implementation
 *
 * @link [eth_getBlockByHash](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 *                 * params[1]: The transaction hydrated detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 * @returns the block at the given block hash formatted to the RPC standard or null if the block does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<BlocksRPC | null> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        !BlockId.isValid(params[0]) ||
        typeof params[1] !== 'boolean'
    )
        throw new JSONRPCInvalidParams(
            'eth_getBlockByHash',
            `Invalid input params for "eth_getBlockByHash" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        // Return the block by number (in this case, the block hash is the block number)
        return await ethGetBlockByNumber(thorClient, params);
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getBlockByHash()',
            'Method "eth_getBlockByHash" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetBlockByHash };
