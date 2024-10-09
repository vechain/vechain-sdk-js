import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import type { ThorClient } from '../../../../../thor-client';

/**
 * RPC Method net_listening implementation
 *
 * @link [net_listening](https://docs.infura.io/api/networks/ethereum/json-rpc-methods/net_listening)
 *
 * @param thorClient - The thor client instance to use.
 */
const netListening = async (thorClient: ThorClient): Promise<boolean> => {
    try {
        return await thorClient.nodes.isHealthy();
    } catch (e) {
        throw new JSONRPCInternalError(
            'net_listening()',
            'Method "net_listening" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { netListening };
