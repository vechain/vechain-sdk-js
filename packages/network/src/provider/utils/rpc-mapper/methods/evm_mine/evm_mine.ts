import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';
import { Poll } from '../../../../../utils';

/**
 * RPC Method evm_mine implementation
 *
 * @link [evm_mine](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)
 *
 * @param thorClient - The thor client instance to use.
 * @returns The new block or null if the block is not available.
 * @throws {JSONRPCInternalError}
 */
const evmMine = async (thorClient: ThorClient): Promise<null> => {
    try {
        const head = await thorClient.blocks.getBestBlockCompressed();
        if (head === null) {
            throw new JSONRPCInternalError(
                'evm_mine()',
                'Method "evm_mine" failed. No best block found.',
                {
                    url: thorClient.httpClient.baseURL
                }
            );
        }

        await Poll.SyncPoll(() => thorClient.blocks.getHeadBlock()).waitUntil(
            (result) => {
                return result !== head;
            }
        );

        return null;
    } catch (e) {
        if (e instanceof JSONRPCInternalError) {
            throw e;
        }

        throw new JSONRPCInternalError(
            'evm_mine()',
            'Method "evm_mine" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { evmMine };
