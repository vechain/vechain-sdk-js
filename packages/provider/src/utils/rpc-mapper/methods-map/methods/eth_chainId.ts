import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildProviderError, JSONRPC } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_chainid)
 *
 * @param thorClient - ThorClient instance.
 *
 * @returns The chain id or '0x0' if the chain id is not available.
 */
const ethChainId = async (thorClient: ThorClient): Promise<string> => {
    try {
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        return genesisBlock?.id ?? '0x0';
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
};

export { ethChainId };
