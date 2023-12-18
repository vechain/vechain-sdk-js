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
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const result = await thorSoloClient.gas.estimateGas(
                        clauses,
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
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const result = await thorSoloClient.gas.estimateGas(
                        clauses,
                        options
                    );

                    expect(result).toBeDefined();
                    expect(result).toStrictEqual(expected);
                });
            }
        );
    });

    /**
     * Test suite for 'getBaseGasPrice' method
     */
    describe('getBaseGasPrice', () => {
        test('Should return the base gas price of the Solo network', async () => {
            const baseGasPrice = await thorSoloClient.gas.getBaseGasPrice();
            expect(baseGasPrice).toBe(
                '0x00000000000000000000000000000000000000000000000000038d7ea4c68000'
            );
            expect(Number(baseGasPrice)).toBe(10 ** 15); // 10^15 wei
        });
    });
});
