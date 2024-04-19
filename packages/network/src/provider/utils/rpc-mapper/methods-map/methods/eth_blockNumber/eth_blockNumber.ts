import { JSONRPC, buildProviderError } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../../thor-client';

/**
 * RPC Method eth_blockNumber implementation
 *
 * @link [eth_blockNumber](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_blocknumber)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @returns the latest block number as a hex string. If the block number cannot be retrieved, it will return '0x0'.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the block number fails.
 */
const ethBlockNumber = async (thorClient: ThorClient): Promise<string> => {
    try {
        // 'best' is the alias for 'latest' in Vechain Thorest
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();

        return latestBlock?.number !== undefined
            ? `0x${latestBlock.number.toString(16)}`
            : '0x0';
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_blockNumber' failed: Error while getting the latest block number.\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethBlockNumber };
