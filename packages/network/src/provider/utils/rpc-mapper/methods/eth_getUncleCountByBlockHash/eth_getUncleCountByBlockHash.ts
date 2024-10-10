import { ThorId } from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';

/**
 * RPC Method eth_getUncleCountByBlockHash implementation
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash to get as a hex string.
 */
const ethGetUncleCountByBlockHash = async (
    params: unknown[]
): Promise<number> => {
    // Input validation
    if (
        params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !ThorId.isValid(params[0])
    )
        throw new JSONRPCInvalidParams(
            'eth_getUncleCountByBlockHash',
            `Invalid input params for "eth_getUncleCountByBlockHash" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    return await Promise.resolve(0);
};

export { ethGetUncleCountByBlockHash };
