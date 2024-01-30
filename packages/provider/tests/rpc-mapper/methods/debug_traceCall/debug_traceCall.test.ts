import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'debug_traceCall' method
 *
 * @group integration/rpc-mapper/methods/debug_traceCall
 */
describe('RPC Mapper - debug_traceCall method tests', () => {
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
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * debug_traceCall RPC call tests - Positive cases
     */
    describe('debug_traceCall - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_traceCall - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_traceCall
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * debug_traceCall RPC call tests - Negative cases
     */
    describe('debug_traceCall - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('debug_traceCall - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_traceCall
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
