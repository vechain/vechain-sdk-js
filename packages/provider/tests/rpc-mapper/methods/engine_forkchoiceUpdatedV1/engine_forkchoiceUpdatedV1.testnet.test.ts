import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'engine_forkchoiceUpdatedV1' method
 *
 * @group integration/rpc-mapper/methods/engine_forkchoiceUpdatedV1
 */
describe('RPC Mapper - engine_forkchoiceUpdatedV1 method tests', () => {
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
     * engine_forkchoiceUpdatedV1 RPC call tests - Positive cases
     */
    describe('engine_forkchoiceUpdatedV1 - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('engine_forkchoiceUpdatedV1 - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.engine_forkchoiceUpdatedV1
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * engine_forkchoiceUpdatedV1 RPC call tests - Negative cases
     */
    describe('engine_forkchoiceUpdatedV1 - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('engine_forkchoiceUpdatedV1 - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.engine_forkchoiceUpdatedV1
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
