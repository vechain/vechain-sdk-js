import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testnetUrl } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'engine_forkchoiceUpdatedV3' method
 *
 * @group integration/rpc-mapper/methods/engine_forkchoiceUpdatedV3
 */
describe('RPC Mapper - engine_forkchoiceUpdatedV3 method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * engine_forkchoiceUpdatedV3 RPC call tests - Positive cases
     */
    describe('engine_forkchoiceUpdatedV3 - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('engine_forkchoiceUpdatedV3 - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.engine_forkchoiceUpdatedV3
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * engine_forkchoiceUpdatedV3 RPC call tests - Negative cases
     */
    describe('engine_forkchoiceUpdatedV3 - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('engine_forkchoiceUpdatedV3 - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.engine_forkchoiceUpdatedV3
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
