import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
// import { config } from 'hardhat';
import { resetHardhatContext } from 'hardhat/plugins-testing';
import * as path from 'path';
import {
    type HardhatRuntimeEnvironment,
    type HttpNetworkConfig
} from 'hardhat/types';

/**
 * Custom HTTP network configuration tests
 *
 * @group unit/custom-hardhat-configuration
 */
describe('Custom network configuration hardhat', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre: HardhatRuntimeEnvironment;

    beforeEach(async function () {
        // Init node environment directory
        process.chdir(
            path.join(__dirname, 'test-environment', 'hardhat-project')
        );

        // Load hardhat environment
        hre = await import('hardhat');
    });

    afterEach(function () {
        resetHardhatContext();
    });

    /**
     * Test suite for createWalletFromHardhatNetworkConfig
     */
    describe('Custom network configuration hardhat', () => {
        /**
         * Positive test cases for createWalletFromHardhatNetworkConfig function
         */
        test('Should be able to get custom configuration from a project', () => {
            expect(hre.config.networks.vechain).toBeDefined();
            expect(
                (hre.config.networks.vechain as HttpNetworkConfig).delegator
            ).toBeDefined();
            expect(
                (hre.config.networks.vechain as HttpNetworkConfig).debug
            ).toBeDefined();
        });
    });
});
