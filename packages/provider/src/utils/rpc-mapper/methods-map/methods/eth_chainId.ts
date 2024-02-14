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
    try {
        const genesisBlock = await thorClient.blocks.getGenesisBlock();

        if (genesisBlock?.id === null || genesisBlock?.id === undefined) {
            throw new Error(
                `The genesis block id is null.\n\tgenesisBlock: ${JSON.stringify(genesisBlock)}`
            );
        }

        return genesisBlock.id;
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
