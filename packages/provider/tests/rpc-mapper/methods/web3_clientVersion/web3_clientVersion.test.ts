import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'web3_clientVersion' method
 *
 * @group integration/rpc-mapper/methods/web3_clientVersion
 */
describe('RPC Mapper - web3_clientVersion method tests', () => {
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
     * web3_clientVersion RPC call tests - Positive cases
     */
    describe('web3_clientVersion - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('web3_clientVersion - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.web3_clientVersion
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * web3_clientVersion RPC call tests - Negative cases
     */
    describe('web3_clientVersion - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('web3_clientVersion - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.web3_clientVersion
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
