"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../src");
/**
 *VeChain provider tests
 *
 * @group integration/providers/vechain-provider
 */
(0, globals_1.describe)('VeChain provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    (0, globals_1.describe)('resolveName(vnsName)', () => {
        (0, globals_1.test)('Should use vnsUtils.resolveNames() to resolve an address by name', async () => {
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveName');
            const name = 'test-sdk.vet';
            await provider.resolveName(name);
            (0, globals_1.expect)(src_1.vnsUtils.resolveName).toHaveBeenCalledWith(provider.thorClient, name);
        });
        (0, globals_1.test)('Should return null if there were invalid result', async () => {
            const name = 'error.vet';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveNames').mockImplementation(async () => {
                return await Promise.resolve([]);
            });
            const address = await provider.resolveName(name);
            (0, globals_1.expect)(address).toEqual(null);
        });
        (0, globals_1.test)('Should pass address provided by resolveNames()', async () => {
            const name = 'address1.vet';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveName').mockImplementation(async () => {
                return await Promise.resolve('0x0000000000000000000000000000000000000001');
            });
            const address = await provider.resolveName(name);
            (0, globals_1.expect)(address).toEqual('0x0000000000000000000000000000000000000001');
        });
    });
    (0, globals_1.describe)('lookupAddress(address)', () => {
        (0, globals_1.test)('Should use vnsUtils.lookupAddress() to resolve an address by name', async () => {
            globals_1.jest.spyOn(src_1.vnsUtils, 'lookupAddress');
            const address = '0x105199a26b10e55300CB71B46c5B5e867b7dF427';
            await provider.lookupAddress(address);
            (0, globals_1.expect)(src_1.vnsUtils.lookupAddress).toHaveBeenCalledWith(provider.thorClient, address);
        });
        (0, globals_1.test)('Should return null if there were invalid results', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            globals_1.jest.spyOn(src_1.vnsUtils, 'lookupAddresses').mockImplementation(async () => {
                return await Promise.resolve([]);
            });
            const name = await provider.lookupAddress(address);
            (0, globals_1.expect)(name).toEqual(null);
        });
        (0, globals_1.test)('Should pass name provided by vnsUtils.resolveName()', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveName').mockImplementation(async () => {
                return await Promise.resolve('test.vet');
            });
            const name = await provider.resolveName(address);
            (0, globals_1.expect)(name).toEqual('test.vet');
        });
    });
});
