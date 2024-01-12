import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { estimateGasTestCases, invalidEstimateGasTestCases } from './fixture';
import { ThorClient } from '../../../src';
import { soloNetwork } from '../../fixture';
import { generateRandomValidAddress } from '@vechain/vechain-sdk-core/tests/fixture';

/**
 * Gas module tests.
 *
 * @group integration/clients/thor-client/gas
 */
describe('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
    });

    afterEach(() => {
        thorSoloClient.destroy();
    });

    /**
     * Test suide for 'estimateGas' method
     */
    describe('estimateGas', () => {
        /**
         * Test cases where the transaction should revert
         */
        estimateGasTestCases.revert.forEach(
            ({ description, clauses, caller, options, expected }) => {
                test(
                    description,
                    async () => {
                        const result = await thorSoloClient.gas.estimateGas(
                            clauses,
                            caller,
                            options
                        );

                        expect(result).toBeDefined();
                        expect(result).toStrictEqual(expected);
                    },
                    3000
                );
            }
        );

        /**
         * Test cases where the transaction should succeed
         */
        estimateGasTestCases.success.forEach(
            ({ description, clauses, caller, options, expected }) => {
                test(
                    description,
                    async () => {
                        const result = await thorSoloClient.gas.estimateGas(
                            clauses,
                            caller,
                            options
                        );

                        expect(result).toBeDefined();
                        expect(result).toStrictEqual(expected);
                    },
                    3000
                );
            }
        );

        /**
         * Test cases where the gas estimate should throw an error
         */
        invalidEstimateGasTestCases.forEach(
            ({ clauses, options, expectedError }) => {
                test(`Should throw an error with clauses: ${JSON.stringify(
                    clauses
                )}, options: ${JSON.stringify(options)}`, async () => {
                    await expect(
                        thorSoloClient.gas.estimateGas(
                            clauses,
                            generateRandomValidAddress(),
                            options
                        )
                    ).rejects.toThrow(expectedError);
                });
            }
        );
    });
});
