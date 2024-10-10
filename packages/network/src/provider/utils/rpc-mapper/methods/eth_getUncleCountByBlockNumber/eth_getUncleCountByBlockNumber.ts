import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';

/**
 * RPC Method eth_getUncleCountByBlockNumber implementation
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 */
const ethGetUncleCountByBlockNumber = async (
    params: unknown[]
): Promise<number> => {
    // Input validation
    if (params.length !== 1 || typeof params[0] !== 'string')
        throw new JSONRPCInvalidParams(
            'eth_getUncleCountByBlockNumber',
            `Invalid input params for "eth_getUncleCountByBlockNumber" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    return await Promise.resolve(0);
};

export { ethGetUncleCountByBlockNumber };
