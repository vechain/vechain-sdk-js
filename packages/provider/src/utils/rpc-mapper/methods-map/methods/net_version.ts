import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildProviderError, JSONRPC } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method net_version implementation
 *
 * @link [net_version](https://docs.infura.io/networks/ethereum/json-rpc-methods/net_version)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @returns A string representing the current network ID or '0' if the network ID is not available.
 */
const netVersion = async (thorClient: ThorClient): Promise<string> => {
    try {
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        return genesisBlock?.id ?? '0';
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'net_version' failed: Error while getting the network id.\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { netVersion };
