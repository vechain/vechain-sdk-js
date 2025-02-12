import { describe, expect, test } from '@jest/globals';
import {
    createWalletFromHardhatNetworkConfigNegativeCasesFixture,
    createWalletFromHardhatNetworkConfigPositiveCasesFixture
} from './fixture';

import { type HttpNetworkConfig } from 'hardhat/types';
import { createWalletFromHardhatNetworkConfig } from '../../src/helpers';

/**
 * Provider hardhat helpers test suite
 *
 * @group unit/hardhat-helpers
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
                    const gasPayer = await wallet.getGasPayer();
                    expect(addresses).toEqual(fixture.expectedAddresses);
                    expect(gasPayer).toEqual(
                        fixture.networkConfig.gasPayer ?? null
                    );
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
                    createWalletFromHardhatNetworkConfig(
                        fixture.networkConfig as HttpNetworkConfig
                    )
                ).toThrowError(fixture.expectedError);
            });
        }
    );
});
