import { type ThorClient } from '../../../../../thor-client';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';

/**
 * RPC Method net_peerCount implementation
 *
 * @link [net_peerCount](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/net_peercount)
 *
 * @param thorClient - The thor client instance to use.
 */
const netPeerCount = async (thorClient: ThorClient): Promise<number> => {
    try {
        const peers = await thorClient.nodes.getNodes();
        return peers.length;
    } catch (e) {
        throw new JSONRPCInternalError(
            'net_peerCount()',
            'Method "net_peerCount" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { netPeerCount };
