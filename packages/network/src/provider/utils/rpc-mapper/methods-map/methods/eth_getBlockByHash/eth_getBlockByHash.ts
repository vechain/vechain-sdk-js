import { type ThorClient } from '../../../../../../thor-client';
import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { type BlocksRPC } from '../../../../formatter';
import { Hex0x } from '@vechain/sdk-core';
import { ethGetBlockByNumber } from '../eth_getBlockByNumber';

/**
 * RPC Method eth_getBlockByHash implementation
 *
 * @link [eth_getBlockByHash](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getblockbyhash)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block hash of block to get.
 *                 * params[1]: The transaction detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 *
 * @returns the block at the given block hash formatted to the RPC standard or null if the block does not exist.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the block fails.
 */
const ethGetBlockByHash = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<BlocksRPC | null> => {
    assert(
        'eth_getBlockByHash',
        params.length === 2 &&
            typeof params[0] === 'string' &&
            Boolean(Hex0x.isThorId(params[0])) &&
            typeof params[1] === 'boolean',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 2.\nThe params should be [hash: hash of block, transactionDetailFlag: boolean]'
    );

    try {
        // Return the block by number (in this case, the block hash is the block number)
        return await ethGetBlockByNumber(thorClient, params);
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getBlockByHash' failed: Error while getting block ${
                params[0] as string
            }\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetBlockByHash };
