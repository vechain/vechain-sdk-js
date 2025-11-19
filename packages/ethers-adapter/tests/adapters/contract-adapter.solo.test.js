"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
const globals_1 = require("@jest/globals");
const sdk_network_1 = require("@vechain/sdk-network");
const ethers_1 = require("ethers");
const src_1 = require("../../src");
/**
 *VeChain adapters tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
(0, globals_1.describe)('Hardhat contract adapter tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = sdk_network_1.ThorClient.at(sdk_network_1.THOR_SOLO_URL);
        provider = new sdk_network_1.HardhatVeChainProvider(new sdk_network_1.ProviderInternalBaseWallet([]), sdk_network_1.THOR_SOLO_URL, (message, parent) => new Error(message, parent));
        (0, globals_1.expect)(thorClient).toBeDefined();
    });
    (0, globals_1.test)('Should create a contract adapter', () => {
        const contract = new ethers_1.Contract('0x', []);
        // Create a contract adapter
        const adapter = (0, src_1.contractAdapter)(contract, provider);
        (0, globals_1.expect)(adapter).toBeDefined();
    });
    (0, globals_1.test)('Should get the address of a contract', () => {
        const contract = new ethers_1.Contract('0x', []);
        src_1.helpers.getContractAddress = globals_1.jest.fn(async () => await Promise.resolve('0x'));
        contract.getAddress = globals_1.jest.fn(async () => await Promise.resolve('0x'));
        // Create a contract adapter
        const adapter = (0, src_1.contractAdapter)(contract, provider);
        (0, globals_1.expect)(adapter.getAddress()).toBeDefined();
    });
});
