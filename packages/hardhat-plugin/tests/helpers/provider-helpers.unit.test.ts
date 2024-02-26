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
                    const delegator = await wallet.getDelegator();

                    expect(addresses).toEqual(fixture.expectedAddresses);
                    expect(delegator).toEqual(
                        fixture.networkConfig.delegator ?? null
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
