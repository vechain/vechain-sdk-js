import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_blockNumber' method on Solo Network
 *
 * @group integration/rpc-mapper/methods/eth_blockNumber
 */
describe('RPC Mapper - eth_blockNumber method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * eth_blockNumber RPC call tests - Positive cases
     */
    describe('eth_blockNumber - Positive cases', () => {
        /**
         * Test case where the latest block number is returned and updated when a new block is mined
         */
        test('Should return the latest block number and the updated latest block number when updated', async () => {
            // Retry mechanism for connection issues
            let lastError: Error | null = null;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const rpcCallLatestBlockNumber = await RPCMethodsMap(
                        thorClient
                    )[RPC_METHODS.eth_blockNumber]([]);

                    expect(rpcCallLatestBlockNumber).not.toBe('0x0');

                    await thorClient.blocks.waitForBlockCompressed(
                        Number(rpcCallLatestBlockNumber) + 1
                    );

                    const rpcCallUpdatedLatestBlockNumber = await RPCMethodsMap(
                        thorClient
                    )[RPC_METHODS.eth_blockNumber]([]);

                    expect(rpcCallUpdatedLatestBlockNumber).not.toBe('0x0');
                    expect(
                        Number(rpcCallUpdatedLatestBlockNumber)
                    ).toBeGreaterThanOrEqual(
                        Number(rpcCallLatestBlockNumber) + 1
                    );

                    // Success - exit retry loop
                    return;
                } catch (error) {
                    lastError = error as Error;
                    if (attempt < 3) {
                        // Wait 2 seconds before retrying
                        await new Promise((resolve) =>
                            setTimeout(resolve, 2000)
                        );
                    }
                }
            }

            // All retries failed
            throw lastError ?? new Error('Connection failed after 3 attempts');
        }, 30000);
    });
});
