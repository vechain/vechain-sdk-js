import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { TRANSACTIONS_GAS_CONSTANTS } from '@vechain/vechain-sdk-core';

/**
 * RPC Mapper integration tests for 'eth_estimateGas' method
 *
 * @group integration/rpc-mapper/methods/eth_estimateGas
 */
describe('RPC Mapper - eth_estimateGas method tests', () => {
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
     * eth_estimateGas RPC call tests - Positive cases
     */
    describe('eth_estimateGas - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_estimateGas - positive case 1', async () => {
            const clauses = [
                {
                    to: '0x0000000000000000000000000000000000000000',
                    value: 0,
                    data: ''
                }
            ];
            const expected =
                TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS * 5 +
                TRANSACTIONS_GAS_CONSTANTS.TX_GAS;

            const estimatedGas =
                await RPCMethodsMap(thorClient)[RPC_METHODS.eth_estimateGas](
                    clauses
                );

            expect(estimatedGas).toBe(expected);
        });
    });

    /**
     * eth_estimateGas RPC call tests - Negative cases
     */
    // describe('eth_estimateGas - Negative cases', () => {
    //     /**
    //      * Negative case 1 - ... Description ...
    //      */
    //     test('eth_estimateGas - negative case 1', async () => {
    //         // NOT IMPLEMENTED YET!
    //         await expect(
    //             async () =>
    //                 await RPCMethodsMap(thorClient)[
    //                     RPC_METHODS.eth_estimateGas
    //                 ](['SOME_RANDOM_PARAM'])
    //         ).rejects.toThrowError(NotImplementedError);
    //     });
    // });
});
