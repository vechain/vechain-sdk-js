import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { Hex } from '../../../../../core/src/utils/hex/Hex';

/**
 * RPC Mapper integration tests for 'eth_blockNumber' method on Testnet Network
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
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * eth_blockNumber RPC call tests - Positive cases
     */
    describe('eth_blockNumber - Positive cases', () => {
        /**
         * Test case where the latest block number is returned and updated when a new block is mined
         */
        test('Should return the latest block number and the updated latest block number when updated', async () => {
            const rpcCallLatestBlockNumber = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_blockNumber
            ]([]);

            expect(rpcCallLatestBlockNumber).not.toBe('0x0');

            await thorClient.blocks.waitForBlock(
                Number(rpcCallLatestBlockNumber) + 1
            );

            const rpcCallUpdatedLatestBlockNumber = await RPCMethodsMap(
                thorClient
            )[RPC_METHODS.eth_blockNumber]([]);

            expect(rpcCallUpdatedLatestBlockNumber).not.toBe('0x0');
            expect(rpcCallUpdatedLatestBlockNumber).toBe(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                Hex.of(Number(rpcCallLatestBlockNumber) + 1)
            );
        }, 15000);
    });

    /**
     * eth_blockNumber RPC call tests - Negative cases
     */
    describe('eth_blockNumber - Negative cases', () => {});
});
