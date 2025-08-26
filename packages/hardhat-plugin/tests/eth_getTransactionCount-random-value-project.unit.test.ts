import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { resetHardhatContext } from 'hardhat/plugins-testing';
import {
    type HardhatRuntimeEnvironment,
    type HttpNetworkConfig
} from 'hardhat/types';
import { setHardhatContext } from './test-utils';

/**
 * Simple hardhat project eth_getTransactionCount-random-value-project network configuration defined
 *
 * @group unit/eth_getTransactionCount-random-value-project
 */
describe('Using eth_getTransactionCount with random value (not the default 0x0 value)', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre: HardhatRuntimeEnvironment;

    beforeEach(function () {
        // Set hardhat context
        setHardhatContext('eth_getTransactionCount-random-value-project');

        // Load hardhat environment using require instead of dynamic import
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        hre = require('hardhat') as HardhatRuntimeEnvironment;
    });

    afterEach(function () {
        resetHardhatContext();
    });

    /**
     * Test suite for eth_getTransactionCount with random value
     */
    describe('Custom network configuration hardhat', () => {
        /**
         * Should be able to get random value from eth_getTransactionCount
         */
        test('Should be able to get random value from eth_getTransactionCount', async () => {
            // Network configuration should be defined
            expect(hre.config.networks.vechain_testnet).toBeDefined();

            // Initialize network configuration AND check ethGetTransactionCountDefaultValue parameter
            const networkConfig = hre.config.networks
                .vechain_testnet as HttpNetworkConfig;
            expect(
                networkConfig.rpcConfiguration
                    ?.ethGetTransactionCountMustReturn0
            ).toBe(false);

            // Get the provider
            expect(hre.VeChainProvider).toBeDefined();
            const provider = hre.VeChainProvider;

            // Expect 0 as the default value
            const request = await provider?.request({
                method: 'eth_getTransactionCount',
                params: ['0x0b41c56e19c5151122568873a039fEa090937Fe2', 'latest']
            });
            expect(request).not.toBe('0x0');
        });
    });
});
