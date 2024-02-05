import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { logsFixture } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs
 */
describe('RPC Mapper - eth_getLogs method tests', () => {
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
     * eth_getLogs RPC call tests - Positive cases
     */
    describe('eth_getLogs - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        logsFixture.forEach((fixture, index) => {
            test(`eth_getLogs - Should be able to get logs - ${index}`, async () => {
                // Call RPC method
                const logs = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getLogs
                ]([fixture]);
                console.log('final logs:', logs);
            }, 20000);
        });
    });

    /**
     * eth_getLogs RPC call tests - Negative cases
     */
    // describe('eth_getLogs - Negative cases', () => {
    //     /**
    //      * Negative case 1 - ... Description ...
    //      */
    //     test('eth_getLogs - negative case 1', async () => {
    //         // NOT IMPLEMENTED YET!
    //         await expect(
    //             async () =>
    //                 await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getLogs]([
    //                     'SOME_RANDOM_PARAM'
    //                 ])
    //         ).rejects.toThrowError(NotImplementedError);
    //     });
    // });
});
