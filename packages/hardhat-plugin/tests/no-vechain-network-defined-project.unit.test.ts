import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { resetHardhatContext } from 'hardhat/plugins-testing';
import { type HardhatRuntimeEnvironment } from 'hardhat/types';
import { setHardhatContext } from './test-utils';

/**
 * Simple hardhat project without vechain network configuration defined
 *
 * @group unit/no-vechain-network-defined-project
 */
describe('Custom network configuration hardhat without vechain network defined', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre: HardhatRuntimeEnvironment;

    beforeEach(async function () {
        // Set hardhat context
        setHardhatContext('no-vechain-network-defined-project');

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
            // Default network (hardhat) should be undefined
            expect(hre.config.networks.hardhat).toBeDefined();
        });
    });
});
