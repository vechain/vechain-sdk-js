import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { resetHardhatContext } from 'hardhat/plugins-testing';
import { type HardhatRuntimeEnvironment } from 'hardhat/types';
import { setHardhatContext } from './test-utils';

/**
 * Simple hardhat project withoutVeChain network configuration defined
 *
 * @group unit/no-vechain-network-defined-project
 */
describe('Custom network configuration hardhat withoutVeChain network defined', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre: HardhatRuntimeEnvironment;

    beforeEach(function () {
        // Set hardhat context
        setHardhatContext('no-vechain-network-defined-project');

        // Load hardhat environment using require instead of dynamic import
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        hre = require('hardhat') as HardhatRuntimeEnvironment;
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
