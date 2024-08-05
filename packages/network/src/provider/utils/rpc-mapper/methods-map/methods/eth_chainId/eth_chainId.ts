import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { CHAIN_ID } from '../../../../const';
import { networkInfo } from '@vechain/sdk-core';

/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_chainid)
 * @link [Chain IDs](https://chainlist.org/?search=vechain&testnets=true)
 *
 * @param thorClient - ThorClient instance.
 * @returns The chain id
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethChainId = async (thorClient: ThorClient): Promise<string> => {
    try {
        const genesisBlock = await thorClient.blocks.getGenesisBlock();

        if (genesisBlock?.id === null || genesisBlock?.id === undefined) {
            throw new JSONRPCInvalidParams(
                'eth_chainId()',
                -32602,
                'The genesis block id is null or undefined. Unable to get the chain id.',
                {
                    url: thorClient.httpClient.baseURL
                }
            );
        }

        // We are on Mainnet
        if (genesisBlock.id === networkInfo.mainnet.genesisBlock.id)
            return CHAIN_ID.MAINNET;

        // Testnet OR Solo OR some other network
        return CHAIN_ID.TESTNET;
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_chainId()',
            -32603,
            'Method "eth_chainId" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethChainId };
