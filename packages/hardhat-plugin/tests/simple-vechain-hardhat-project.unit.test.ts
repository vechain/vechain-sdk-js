import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { resetHardhatContext } from 'hardhat/plugins-testing';
import {
    type HardhatRuntimeEnvironment,
    type HttpNetworkConfig
} from 'hardhat/types';
import { setHardhatContext } from './test-utils';
import { HardhatPluginError } from 'hardhat/plugins';

/**
 * Simple hardhat project with vechain network configuration defined
 *
 * @group unit/simple-vechain-hardhat-project
 */
describe('Custom network configuration hardhat - testnet', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre: HardhatRuntimeEnvironment;

    beforeEach(async function () {
        // Set hardhat context
        setHardhatContext('simple-vechain-hardhat-project');

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
            expect(hre.config.networks.vechain_testnet).toBeDefined();
            expect(
                (hre.config.networks.vechain_testnet as HttpNetworkConfig)
                    .delegator
            ).toBeDefined();
            expect(
                (hre.config.networks.vechain_testnet as HttpNetworkConfig)
                    .debugMode
            ).toBeDefined();
            expect(hre.vechainProvider).toBeDefined();
            expect(hre.vechainProvider?.send('eth_accounts', [])).toBeDefined();
        });
    });

    /**
     * Negative test cases for the provider. It must throw an error
     */
    describe('Custom network configuration hardhat', () => {
        /**
         * Negative test cases for the provider. It must throw an error
         */
        test('Should throw an error when a send call goes wrong', async () => {
            await expect(
                hre.vechainProvider?.send('WRONG_ENDPOINT', [])
            ).rejects.toThrowError(HardhatPluginError);
        });
    });
});
