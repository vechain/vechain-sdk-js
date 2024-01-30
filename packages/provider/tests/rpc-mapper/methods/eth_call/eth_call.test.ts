import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import {
    type SimulateTransactionClause,
    ThorClient
} from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_call' method
 *
 * @group integration/rpc-mapper/methods/eth_call
 */
describe('RPC Mapper - eth_call method tests', () => {
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
     * eth_call RPC call tests - Positive cases
     */
    describe('eth_call - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        /**
         * Sends 1 VET to the receiver.
         */
        const options = [
            {
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            }
        ] as SimulateTransactionClause[];
        test('eth_call - positive case 1', async () => {
            const response =
                await RPCMethodsMap(thorClient)[RPC_METHODS.eth_call](options);
            expect(response).toBe('a');
        });
    });

    /**
     * eth_call RPC call tests - Negative cases
     */
    // describe('eth_call - Negative cases', () => {
    //     /**
    //      * Negative case 1 - ... Description ...
    //      */
    //     test('eth_call - negative case 1', async () => {
    //         // NOT IMPLEMENTED YET!
    //         await expect(
    //             async () =>
    //                 await RPCMethodsMap(thorClient)[RPC_METHODS.eth_call]([
    //                     'SOME_RANDOM_PARAM'
    //                 ])
    //         ).rejects.toThrowError(NotImplementedError);
    //     });
    // });
});
