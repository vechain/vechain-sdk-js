"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
/**
 * vnsUtils vet.domains tests
 *
 * @group unit/utils/vnsUtils
 */
(0, globals_1.describe)('vnsUtils', () => {
    /**
     * ThorClient instances
     */
    let thorClient;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    /**
     * Destroy thor client after each test
     */
    (0, globals_1.afterEach)(() => {
        thorClient.destroy();
    });
    (0, globals_1.describe)('resolveName(name)', () => {
        (0, globals_1.test)('Should use resolveNames() to resolve an address by name', async () => {
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveNames');
            const name = 'test-sdk.vet';
            await src_1.vnsUtils.resolveName(thorClient, name);
            (0, globals_1.expect)(src_1.vnsUtils.resolveNames).toHaveBeenCalledWith(thorClient.blocks, thorClient.transactions, [name]);
        });
        (0, globals_1.test)('Should return null if resolveNames() has invalid result', async () => {
            const name = 'error.vet';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveNames').mockImplementation(async () => {
                return await Promise.resolve([]);
            });
            const address = await src_1.vnsUtils.resolveName(thorClient, name);
            (0, globals_1.expect)(address).toEqual(null);
        });
        (0, globals_1.test)('Should pass address provided by resolveNames()', async () => {
            const name = 'address1.vet';
            globals_1.jest.spyOn(src_1.vnsUtils, 'resolveNames').mockImplementation(async () => {
                return await Promise.resolve([
                    '0x0000000000000000000000000000000000000001'
                ]);
            });
            const address = await src_1.vnsUtils.resolveName(thorClient, name);
            (0, globals_1.expect)(address).toEqual('0x0000000000000000000000000000000000000001');
        });
    });
    (0, globals_1.describe)('lookupAddress(address)', () => {
        (0, globals_1.test)('Should use lookupAddresses() to lookup the single address', async () => {
            globals_1.jest.spyOn(src_1.vnsUtils, 'lookupAddresses');
            const address = '0x0000000000000000000000000000000000000001';
            await src_1.vnsUtils.lookupAddress(thorClient, address);
            (0, globals_1.expect)(src_1.vnsUtils.lookupAddresses).toHaveBeenCalledWith(thorClient, [
                address
            ]);
        });
        (0, globals_1.test)('Should return null if lookupAddresses() has invalid result', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            globals_1.jest.spyOn(src_1.vnsUtils, 'lookupAddresses').mockImplementation(async () => {
                return await Promise.resolve([]);
            });
            const name = await src_1.vnsUtils.lookupAddress(thorClient, address);
            (0, globals_1.expect)(name).toEqual(null);
        });
        (0, globals_1.test)('Should pass name provided by lookupAddresses()', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            globals_1.jest.spyOn(src_1.vnsUtils, 'lookupAddresses').mockImplementation(async () => {
                return await Promise.resolve(['test.vet']);
            });
            const name = await src_1.vnsUtils.lookupAddress(thorClient, address);
            (0, globals_1.expect)(name).toEqual('test.vet');
        });
    });
});
