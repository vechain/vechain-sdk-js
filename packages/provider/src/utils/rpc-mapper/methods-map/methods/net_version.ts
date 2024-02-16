import { type ThorClient } from '@vechain/vechain-sdk-network';
import { ethChainId } from './eth_chainId/eth_chainId';

/**
 * RPC Method net_version implementation
 *
 * @link [net_version](https://docs.infura.io/networks/ethereum/json-rpc-methods/net_version)
 *
 * @param thorClient - ThorClient instance.
 *
 * @returns The net version (equivalent to chain id in our case).
 */
const netVersion = async (thorClient: ThorClient): Promise<string> => {
    return await ethChainId(thorClient);
};

export { netVersion };
