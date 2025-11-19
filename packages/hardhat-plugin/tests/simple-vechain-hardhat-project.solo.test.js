"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const plugins_1 = require("hardhat/plugins");
const plugins_testing_1 = require("hardhat/plugins-testing");
const test_utils_1 = require("./test-utils");
/**
 * Tests for hardhat plugin with custom network configuration.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/hardhat-plugin
 */
(0, globals_1.describe)('Custom network configuration hardhat - testnet', () => {
    /**
     * Init hardhat runtime environment
     */
    let hre;
    (0, globals_1.beforeEach)(function () {
        // Set hardhat context
        (0, test_utils_1.setHardhatContext)('simple-vechain-hardhat-project');
        // Load hardhat environment using require instead of dynamic import
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        hre = require('hardhat');
    });
    (0, globals_1.afterEach)(function () {
        (0, plugins_testing_1.resetHardhatContext)();
    });
    /**
     * Test suite for createWalletFromHardhatNetworkConfig
     */
    (0, globals_1.describe)('Custom network configuration hardhat', () => {
        /**
         * Positive test cases for createWalletFromHardhatNetworkConfig function
         */
        (0, globals_1.test)('Should be able to get custom configuration from a project', () => {
            (0, globals_1.expect)(hre.config.networks.vechain_testnet).toBeDefined();
            (0, globals_1.expect)(hre.config.networks.vechain_testnet
                .gasPayer).toBeDefined();
            (0, globals_1.expect)(hre.config.networks.vechain_testnet.debug).toBeDefined();
            (0, globals_1.expect)(hre.VeChainProvider).toBeDefined();
            (0, globals_1.expect)(hre.VeChainProvider?.send('eth_accounts', [])).toBeDefined();
        });
    });
    /**
     * Negative test cases for the provider. It must throw an error
     */
    (0, globals_1.describe)('Custom network configuration hardhat', () => {
        /**
         * Negative test cases for the provider. It must throw an error
         */
        (0, globals_1.test)('Should throw an error when a send call goes wrong', async () => {
            await (0, globals_1.expect)(hre.VeChainProvider?.send('WRONG_ENDPOINT', [])).rejects.toThrowError(plugins_1.HardhatPluginError);
        });
    });
    (0, globals_1.describe)('Invoke hardhat functions', () => {
        /**
         * Test suite for getSigner
         */
        (0, globals_1.test)('Get signer', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            (0, globals_1.expect)(signer).toBeDefined();
            const impersonatedSigner = await hre.ethers.getSigner('0x3db469a79593dcc67f07DE1869d6682fC1eaf535');
            (0, globals_1.expect)(impersonatedSigner).toBeDefined();
        }, 10000);
        /**
         * Test suite for getImpersonatedSigner
         */
        (0, globals_1.test)('Get impersonated signer', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            (0, globals_1.expect)(signer).toBeDefined();
            await (0, globals_1.expect)(async () => await hre.ethers.getImpersonatedSigner('0x3db469a79593dcc67f07DE1869d6682fC1eaf535')).rejects.toThrowError();
        }, 10000);
        /**
         * Test suite for the deployment of the hello world contract
         */
        (0, globals_1.test)('Should deploy the hello world contract', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            const helloWorldContract = await hre.ethers.deployContract('VechainHelloWorld', signer);
            (0, globals_1.expect)(helloWorldContract).toBeDefined();
            (0, globals_1.expect)(await helloWorldContract.sayHello()).toBe('Hello world from Vechain!');
        }, 10000);
        /**
         * Test suite for invoking the hello world contract
         */
        (0, globals_1.test)('Should invoke the hello world contract', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            const helloWorldContract = await (await hre.ethers.getContractFactory('VechainHelloWorld', signer)).deploy();
            (0, globals_1.expect)(helloWorldContract).toBeDefined();
            (0, globals_1.expect)(await helloWorldContract.sayHello()).toBe('Hello world from Vechain!');
        }, 10000);
        /**
         * Test suite for getContractFactoryFromArtifact
         */
        (0, globals_1.test)('Should invoke the hello world contract using getContractFactoryFromArtifact', async () => {
            const signer = (await hre.ethers.getSigners())[0];
            const helloWorldContractArtifact = await hre.artifacts.readArtifact('VechainHelloWorld');
            const helloWorldContract = await (await hre.ethers.getContractFactoryFromArtifact(helloWorldContractArtifact, signer)).deploy();
            (0, globals_1.expect)(helloWorldContract).toBeDefined();
            (0, globals_1.expect)(await helloWorldContract.sayHello()).toBe('Hello world from Vechain!');
        }, 10000);
    });
});
