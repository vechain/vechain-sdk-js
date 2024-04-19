import { type ThorClient } from '../../../../../../thor-client';
import { buildProviderError, JSONRPC } from '@vechain/sdk-errors';
import { CHAIN_ID } from '../../../../const';
import { networkInfo } from '@vechain/sdk-core';

/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_chainid)
 * @link [Chain IDs](https://chainlist.org/?search=vechain&testnets=true)
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

        // We are on Mainnet
        if (genesisBlock.id === networkInfo.mainnet.genesisBlock.id)
            return CHAIN_ID.MAINNET;

        // Testnet OR Solo OR some other network
        return CHAIN_ID.TESTNET;
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
