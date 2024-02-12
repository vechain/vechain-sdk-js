import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildProviderError, JSONRPC } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_chainid)
 *
 * @param thorClient - ThorClient instance.
 *
 * @returns A hexadecimal of the current chain ID or '0x0' if the chain id is not available.
 */
const ethChainId = async (thorClient: ThorClient): Promise<string> => {
    try {
        const genesisBlock = await thorClient.blocks.getGenesisBlock();
        if (genesisBlock != null) {
            const chainId = genesisBlock?.id;
            return '0x' + (chainId as unknown as number).toString(16);
        } else {
            return '0x0';
        }
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_chainId' failed: Error while getting the chain Id.\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethChainId };
