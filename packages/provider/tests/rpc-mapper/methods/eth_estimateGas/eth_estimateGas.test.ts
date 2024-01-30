import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

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
    // describe('eth_estimateGas - Positive cases', () => {
    //     /**
    //      * Positive case 1 - ... Description ...
    //      */
    //     test('eth_estimateGas - positive case 1', async () => {
    //         const clauses: TransactionClause[] = [
    //             {
    //                 to: '0xDafCA4A51eA97B3b5F21171A95DAbF540894a55A',
    //                 value: 0,
    //                 data: ''
    //             }
    //         ];
    //         const estimatedGas =
    //             await RPCMethodsMap(thorClient)[RPC_METHODS.eth_estimateGas](
    //                 clauses
    //             );

    //         expect(estimatedGas).toBe(2);
    //     });
    // });

    /**
     * eth_estimateGas RPC call tests - Negative cases
     */
    describe('eth_estimateGas - Negative cases', () => {
        /**
         * Negative case 1 - Np parameter passed
         */
        test('eth_estimateGas - no parameter passed', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_estimateGas
                    ]([])
            ).rejects.toThrowError('a');
        });
    });
});
