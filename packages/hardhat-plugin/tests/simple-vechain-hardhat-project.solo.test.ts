import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { HardhatPluginError } from 'hardhat/plugins';
import { resetHardhatContext } from 'hardhat/plugins-testing';
import {
    type HardhatRuntimeEnvironment,
    type HttpNetworkConfig
} from 'hardhat/types';
import { setHardhatContext } from './test-utils';

/**
 * Tests for hardhat plugin with custom network configuration.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/hardhat-plugin
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
                    .gasPayer
            ).toBeDefined();
            expect(
                (hre.config.networks.vechain_testnet as HttpNetworkConfig).debug
            ).toBeDefined();
            expect(hre.VeChainProvider).toBeDefined();
            expect(hre.VeChainProvider?.send('eth_accounts', [])).toBeDefined();
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
                hre.VeChainProvider?.send('WRONG_ENDPOINT', [])
            ).rejects.toThrowError(HardhatPluginError);
        });
    });

    describe('Invoke hardhat functions', () => {
        /**
         * Test suite for getSigner
         */
        test('Get signer', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            expect(signer).toBeDefined();

            const impersonatedSigner = await hre.ethers.getSigner(
                '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
            );

            expect(impersonatedSigner).toBeDefined();
        }, 10000);

        /**
         * Test suite for getImpersonatedSigner
         */
        test('Get impersonated signer', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            expect(signer).toBeDefined();

            await expect(
                async () =>
                    await hre.ethers.getImpersonatedSigner(
                        '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
                    )
            ).rejects.toThrowError();
        }, 10000);

        /**
         * Test suite for the deployment of the hello world contract
         */
        test('Should deploy the hello world contract', async () => {
            const signer = (await hre.ethers.getSigners())[0];

            const helloWorldContract = await hre.ethers.deployContract(
                'VechainHelloWorld',
                signer
            );

            expect(helloWorldContract).toBeDefined();

            expect(await helloWorldContract.sayHello()).toBe(
                'Hello world from Vechain!'
            );
        }, 10000);

        /**
         * Test suite for invoking the hello world contract
         */
        test('Should invoke the hello world contract', async () => {
            const signer = (await hre.ethers.getSigners())[0];

            const helloWorldContract = await (
                await hre.ethers.getContractFactory('VechainHelloWorld', signer)
            ).deploy();

            expect(helloWorldContract).toBeDefined();

            expect(await helloWorldContract.sayHello()).toBe(
                'Hello world from Vechain!'
            );
        }, 10000);

        /**
         * Test suite for getContractFactoryFromArtifact
         */
        test('Should invoke the hello world contract using getContractFactoryFromArtifact', async () => {
            const signer = (await hre.ethers.getSigners())[0];

            const helloWorldContractArtifact =
                await hre.artifacts.readArtifact('VechainHelloWorld');

            const helloWorldContract = await (
                await hre.ethers.getContractFactoryFromArtifact(
                    helloWorldContractArtifact,
                    signer
                )
            ).deploy();

            expect(helloWorldContract).toBeDefined();

            expect(await helloWorldContract.sayHello()).toBe(
                'Hello world from Vechain!'
            );
        }, 10000);
    });
});
