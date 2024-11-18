import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Method eth_getUncleByBlockNumberAndIndex implementation
 *
 * @link [eth_getUncleByBlockNumberAndIndex](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_getunclebyblocknumberandindex)
 *
 * @note
 *  * Standard RPC method `eth_getUncleByBlockNumberAndIndex` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, VeChain only supports hex number of block, 'latest' and 'finalized'.
 *  * We return a constant empty object for now.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 *                 * params[1]: A hexadecimal equivalent of the integer indicating the uncle's index position.
 * @returns The uncle block at the given block number and index.
 * @throws {JSONRPCInvalidParams}
 */
const ethGetUncleByBlockNumberAndIndex = async (
    params: unknown[]
): Promise<object | null> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'string'
    )
        throw new JSONRPCInvalidParams(
            'eth_getUncleByBlockNumberAndIndex',
            'Invalid input params for "eth_getUncleByBlockNumberAndIndex" method. See https://docs.infura.io/api/networks/ethereum/json-rpc-methods/eth_getunclebyblocknumberandindex for details.',
            { params }
        );

    return await Promise.resolve(null);
};

export { ethGetUncleByBlockNumberAndIndex };
