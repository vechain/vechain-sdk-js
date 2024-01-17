import { type ThorClient } from '@vechain/vechain-sdk-network';
import { buildError, FUNCTION } from '@vechain/vechain-sdk-errors';

/**
 * RPC Method eth_subscribe implementation
 *
 * @link [eth_subscribe](https://docs.infura.io/networks/ethereum/json-rpc-methods/subscription-methods/eth_subscribe)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - TBD
 *
 * @returns The ID of the newly created subscription on the node.
 */
const ethSubscribe = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<void> => {
    // To avoid eslint error
    await Promise.resolve(0);

    // Not implemented yet
    throw buildError(
        FUNCTION.NOT_IMPLEMENTED,
        'Method "eth_subscribe" not not implemented yet',
        {
            params,
            thorClient
        }
    );
};

export { ethSubscribe };
