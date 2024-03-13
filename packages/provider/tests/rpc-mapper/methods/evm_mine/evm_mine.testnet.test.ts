import { beforeEach, describe, expect, test } from '@jest/globals';
import { type BlocksRPC, RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'evm_mine' method
 *
 * @group integration/rpc-mapper/methods/evm_mine
 */
describe('RPC Mapper - evm_mine method tests', () => {
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
     * evm_mine RPC call tests - Positive cases
     */
    describe('evm_mine - Positive cases', () => {
        /**
         * Positive case 1 - get new block
         */
        test('evm_mine - positive case 1', async () => {
            const bestBlock = await thorClient.blocks.getBestBlockCompressed();

            const rpcCallEvmMine = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.evm_mine
            ]([])) as BlocksRPC | null;

            if (bestBlock != null && rpcCallEvmMine != null) {
                expect(Number(rpcCallEvmMine.number)).toBeGreaterThanOrEqual(
                    bestBlock.number + 1
                );
            }
        }, 15000);
    });
});
