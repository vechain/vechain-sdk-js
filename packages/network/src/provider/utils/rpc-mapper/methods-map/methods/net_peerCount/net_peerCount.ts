import { type ThorClient } from '../../../../../../thor-client';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';

/**
 * RPC Method net_peerCount implementation
 *
 * @param thorClient - The thor client instance to use.
 */
const netPeerCount = async (thorClient: ThorClient): Promise<number> => {
    try {
        const peers = await thorClient.nodes.getNodes();
        return peers !== null ? peers.length : 0;
    } catch (e) {
        throw new JSONRPCInternalError(
            'net_peerCount',
            -32603,
            'Method "net_peerCount" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { netPeerCount };
