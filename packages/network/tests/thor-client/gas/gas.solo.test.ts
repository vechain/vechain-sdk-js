import { beforeEach, describe, expect, test } from '@jest/globals';
import { estimateGasTestCases, invalidEstimateGasTestCases } from './fixture';
import { ThorClient } from '../../../src';
import { stringifyData } from '@vechain/sdk-errors';
import { Hex0x, secp256k1 } from '../../../../core/src';
import { THOR_SOLO_URL } from '@vechain/sdk-constant';

/**
 * Gas module tests.
 *
 * @group integration/clients/thor-client/gas
 */
describe('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);
    });

    /**
     * Test suite for 'estimateGas' method
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
                test(`Should throw an error with clauses: ${stringifyData(
                    clauses
                )}, options: ${stringifyData(options)}`, async () => {
                    await expect(
                        thorSoloClient.gas.estimateGas(
                            clauses,
                            // Random address
                            Hex0x.of(secp256k1.randomBytes(20)),
                            options
                        )
                    ).rejects.toThrow(expectedError);
                });
            }
        );
    });
});
