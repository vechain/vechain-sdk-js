import { describe, expect, test } from '@jest/globals';
import {
    createWalletFromHardhatNetworkConfigNegativeCasesFixture,
    createWalletFromHardhatNetworkConfigPositiveCasesFixture
} from './fixture';
import { createWalletFromHardhatNetworkConfig } from '../../../src';
import { type HttpNetworkConfig } from 'hardhat/types';

/**
 * Provider hardhat helpers test suite
 *
 * @group unit/helpers/hardhat
 */
describe('Provider Hardhat Helpers', () => {
    /**
     * Test suite for createWalletFromHardhatNetworkConfig
     */
    describe('createWalletFromHardhatNetworkConfig', () => {
        /**
         * Positive test cases for createWalletFromHardhatNetworkConfig function
         */
        createWalletFromHardhatNetworkConfigPositiveCasesFixture.forEach(
            (fixture) => {
                test(fixture.test, async () => {
                    const wallet = createWalletFromHardhatNetworkConfig(
                        fixture.networkConfig as HttpNetworkConfig
                    );
                    const addresses = await wallet.getAddresses();

                    expect(addresses).toEqual(fixture.expectedAddresses);
                });
            }
        );
    });

    /**
     * Negative test cases for createWalletFromHardhatNetworkConfig function
     */
    createWalletFromHardhatNetworkConfigNegativeCasesFixture.forEach(
        (fixture) => {
            test(fixture.test, () => {
                expect(() =>
                    createWalletFromHardhatNetworkConfig(fixture.networkConfig)
                ).toThrowError(fixture.expectedError);
            });
        }
    );
});
