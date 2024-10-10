import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { Address } from '@vechain/sdk-core';

/**
 * RPC Method txpool_contentFrom implementation
 *
 * @link [txpool_contentFrom](https://www.quicknode.com/docs/ethereum/txpool_contentFrom)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @param params - The standard array of rpc call parameters.
 * params[0]: The address to get the transaction pool status from
 * @returns The transaction pool status
 */
const txPoolContentFrom = async (params: unknown[]): Promise<object> => {
    // Validate input
    if (
        params.length !== 1 ||
        typeof params[0] !== 'string' ||
        !Address.isValid(params[0])
    )
        throw new JSONRPCInvalidParams(
            'txpool_contentFrom()',
            `Invalid input params for "txpool_contentFrom" method. See https://www.quicknode.com/docs/ethereum/txpool_contentFrom for details.`,
            { params }
        );
    return await Promise.resolve({});
};

export { txPoolContentFrom };
