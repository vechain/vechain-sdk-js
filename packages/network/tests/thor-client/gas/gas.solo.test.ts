import { describe, expect, test } from '@jest/globals';
import { estimateGasTestCases } from './fixture';
import { thorSoloClient } from '../../fixture';

/**
 * Gas module tests.
 *
 * @group integration/clients/thor-client/gas
 */
describe('Gas Module', () => {
    /**
     * Test suide for 'estimateGas' method
     */
    describe('estimateGas', () => {
        /**
         * Test cases where the transaction should revert
         */
        estimateGasTestCases.revert.forEach(
            ({ description, clauses, caller, options, expected }) => {
                test(description, async () => {
                    const result = await thorSoloClient.gas.estimateGas(
                        clauses,
                        caller,
                        options
                    );

                    expect(result).toBeDefined();
                    expect(result).toStrictEqual(expected);
                });
            }
        );

        /**
         * Test cases where the transaction should succeed
         */
        estimateGasTestCases.success.forEach(
            ({ description, clauses, caller, options, expected }) => {
                test(description, async () => {
                    const result = await thorSoloClient.gas.estimateGas(
                        clauses,
                        caller,
                        options
                    );

                    expect(result).toBeDefined();
                    expect(result).toStrictEqual(expected);
                });
            }
        );
    });
});
