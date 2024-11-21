import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { ThorId } from '@vechain/sdk-core';

/**
 * RPC Method eth_getUncleByBlockHashAndIndex implementation
 *
 * @link [eth_getUncleByBlockHashAndIndex](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_getunclebyblockhashandindex)
 *
 * @note
 *  * Standard RPC method `eth_getUncleByBlockHashAndIndex` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, VeChain only supports hex number of block, 'latest' and 'finalized'.
 *  * We return a constant empty object for now.
 *
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash to get as a hex string.
 *                 * params[1]: A hexadecimal equivalent of the integer indicating the uncle's index position.
 * @returns The uncle block at the given block number and index.
 * @throws {JSONRPCInvalidParams}
 */
const ethGetUncleByBlockHashAndIndex = async (
    params: unknown[]
): Promise<object | null> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        !ThorId.isValid(params[0]) ||
        typeof params[1] !== 'string'
    )
        throw new JSONRPCInvalidParams(
            'eth_getUncleByBlockHashAndIndex',
            'Invalid input params for "eth_getUncleByBlockHashAndIndex" method. See https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_getunclebyblockhashandindex for details.',
            { params }
        );

    return await Promise.resolve(null);
};

export { ethGetUncleByBlockHashAndIndex };
