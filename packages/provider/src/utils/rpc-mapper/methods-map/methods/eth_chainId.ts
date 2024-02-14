import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildProviderError, JSONRPC } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_chainid)
 *
 * @param thorClient - ThorClient instance.
 *
 * @returns The chain id
 */
const ethChainId = async (thorClient: ThorClient): Promise<string> => {
    let genesisBlock;
    try {
        genesisBlock = await thorClient.blocks.getGenesisBlock();
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_chainId' failed: Error while getting the chain id.\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                innerError: JSON.stringify(e)
            }
        );
    }
    if (genesisBlock !== null) {
        return genesisBlock.id;
    } else {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_chainId' failed: Genesis block is null.\n
            URL: ${thorClient.httpClient.baseURL}`
        );
    }
};

export { ethChainId };
