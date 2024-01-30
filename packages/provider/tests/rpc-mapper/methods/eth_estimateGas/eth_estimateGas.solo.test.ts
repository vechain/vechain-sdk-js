import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import {
    type TransactionClause,
    contract,
    unitsUtils
} from '@vechain/vechain-sdk-core';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

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
     * eth_estimateGas RPC call tests - Positive cases
     */
    describe('eth_estimateGas - Positive cases', () => {
        /**
         * Positive case 1 - Transfer VET transaction example
         */
        test('eth_estimateGas - positive case 1', async () => {
            const clauses: TransactionClause[] = [
                contract.clauseBuilder.transferVET(
                    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                    unitsUtils.parseVET('1000')
                )
            ];
            const estimatedGas =
                await RPCMethodsMap(thorClient)[RPC_METHODS.eth_estimateGas](
                    clauses
                );

            expect(estimatedGas).toBe('0x5208');
        });
    });

    /**
     * eth_estimateGas RPC call tests - Negative cases
     */
    describe('eth_estimateGas - Negative cases', () => {
        /**
         * Negative case 1 - No parameter passed
         */
        test('eth_estimateGas - no parameter passed', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_estimateGas
                    ]([])
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });
});
