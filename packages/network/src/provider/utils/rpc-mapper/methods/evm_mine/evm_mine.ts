import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';

/**
 * RPC Method evm_mine implementation
 *
 * @link [evm_mine](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)
 *
 * @param thorClient - The thor client instance to use.
 * @param options - Additional options for polling
 * @param options.checkpointInterval - Interval to check finalized blocks
 * @param options.pollingInterval - Time interval between checks in milliseconds
 * @returns The new block or null if the block is not available.
 * @throws {JSONRPCInternalError}
 */
const evmMine = async (
    thorClient: ThorClient,
    options: { checkpointInterval?: number; pollingInterval?: number } = {}
): Promise<null> => {
    const { checkpointInterval = 100, pollingInterval = 1000 } = options;

    try {
        const head = await thorClient.blocks.getBestBlockExpanded();
        if (head === null) {
            throw new JSONRPCInternalError(
                'evm_mine()',
                'Method "evm_mine" failed. No best block found.',
                {
                    url: thorClient.httpClient.baseURL
                }
            );
        }

        const sleep = async (ms: number): Promise<void> => {
            await new Promise((resolve) => setTimeout(resolve, ms));
        };

        while (true) {
            try {
                const newHead = await thorClient.blocks.getBestBlockExpanded();

                if (newHead === null) {
                    await sleep(pollingInterval);
                    continue;
                }

                if (newHead.id !== head.id && newHead.number >= head.number) {
                    if (
                        head.number === 0 ||
                        (newHead.number + 1) % checkpointInterval === 0
                    ) {
                        try {
                            await thorClient.blocks.getBestBlockExpanded();
                        } catch {
                            // Ignore errors
                        }
                    }

                    return null;
                }

                await sleep(pollingInterval);
            } catch (error) {
                if (error instanceof JSONRPCInternalError) {
                    throw error;
                }
                await sleep(pollingInterval);
            }
        }
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
