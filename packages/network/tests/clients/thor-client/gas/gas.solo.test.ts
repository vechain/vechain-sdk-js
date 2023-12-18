import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { estimateGasTestCases } from './fixture';
import { ThorClient } from '../../../../src';
import { thorestSoloClient } from '../../../fixture';

/**
 * Gas module tests.
 *
 * @group integration/clients/thor-client/gas
 */
describe('Gas Module', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = new ThorClient(thorestSoloClient);
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
