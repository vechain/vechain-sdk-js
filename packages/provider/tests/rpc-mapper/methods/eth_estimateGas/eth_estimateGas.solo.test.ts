import { beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { positiveCasesFixtures, negativeCasesFixtures } from './fixture';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';

// import {
//     type TransactionClause,
//     contract,
//     unitsUtils
// } from '@vechain/vechain-sdk-core';
// import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

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
         * Positive cases
         */
        positiveCasesFixtures.forEach((fixture) => {
            test(fixture.description, async () => {
                const response = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_estimateGas
                ](fixture.input);
                expect(response).toBe(fixture.expected);
            });
        });
    });

    /**
     * eth_estimateGas RPC call tests - Negative cases
     */
    describe('eth_estimateGas - Negative cases', () => {
        /**
         * Negative cases
         */
        negativeCasesFixtures.forEach((fixture) => {
            test(fixture.description, async () => {
                await expect(
                    RPCMethodsMap(thorClient)[RPC_METHODS.eth_estimateGas](
                        fixture.input
                    )
                ).rejects.toThrowError(fixture.expected);
            });
        });
    });
});
