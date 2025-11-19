"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_network_1 = require("@vechain/sdk-network");
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 *VeChain helpers tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
(0, globals_1.describe)('Helpers tests', () => {
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
    (0, globals_1.test)('Should get the contract address', async () => {
        provider.thorClient.transactions.waitForTransaction = globals_1.jest.fn(async (_txID, _options) => {
            return await Promise.resolve({
                outputs: [{ contractAddress: 'sampleAddress' }]
            });
        });
        const address = await src_1.helpers.getContractAddress('0x', provider);
        (0, globals_1.expect)(address).toBe('sampleAddress');
        provider.thorClient.transactions.waitForTransaction = globals_1.jest.fn(async (_txID, _options) => {
            return await Promise.resolve(null);
        });
        const addressEmpty = await src_1.helpers.getContractAddress('0x', provider);
        (0, globals_1.expect)(addressEmpty).toBe('');
    });
});
