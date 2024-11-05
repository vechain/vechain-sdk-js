import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { TESTNET_URL, ThorClient, vnsUtils } from '../../../src';

/**
 * vnsUtils vet.domains tests
 *
 * @group unit/utils/vnsUtils
 */
describe('vnsUtils', () => {
    /**
     * ThorClient instances
     */
    let thorClient: ThorClient;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    describe('resolveName(name)', () => {
        test('Should use resolveNames() to resolve an address by name', async () => {
            jest.spyOn(vnsUtils, 'resolveNames');
            const name = 'test-sdk.vet';
            await vnsUtils.resolveName(thorClient, name);
            expect(vnsUtils.resolveNames).toHaveBeenCalledWith(thorClient, [
                name
            ]);
        });

        test('Should return null if resolveNames() has invalid result', async () => {
            const name = 'error.vet';
            jest.spyOn(vnsUtils, 'resolveNames').mockImplementation(
                async () => {
                    return await Promise.resolve([]);
                }
            );
            const address = await vnsUtils.resolveName(thorClient, name);
            expect(address).toEqual(null);
        });

        test('Should pass address provided by resolveNames()', async () => {
            const name = 'address1.vet';
            jest.spyOn(vnsUtils, 'resolveNames').mockImplementation(
                async () => {
                    return await Promise.resolve([
                        '0x0000000000000000000000000000000000000001'
                    ]);
                }
            );
            const address = await vnsUtils.resolveName(thorClient, name);
            expect(address).toEqual(
                '0x0000000000000000000000000000000000000001'
            );
        });
    });

    describe('lookupAddress(address)', () => {
        test('Should use lookupAddresses() to lookup the single address', async () => {
            jest.spyOn(vnsUtils, 'lookupAddresses');
            const address = '0x0000000000000000000000000000000000000001';
            await vnsUtils.lookupAddress(thorClient, address);
            expect(vnsUtils.lookupAddresses).toHaveBeenCalledWith(thorClient, [
                address
            ]);
        });

        test('Should return null if lookupAddresses() has invalid result', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            jest.spyOn(vnsUtils, 'lookupAddresses').mockImplementation(
                async () => {
                    return await Promise.resolve([]);
                }
            );
            const name = await vnsUtils.lookupAddress(thorClient, address);
            expect(name).toEqual(null);
        });

        test('Should pass name provided by lookupAddresses()', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            jest.spyOn(vnsUtils, 'lookupAddresses').mockImplementation(
                async () => {
                    return await Promise.resolve(['test.vet']);
                }
            );
            const name = await vnsUtils.lookupAddress(thorClient, address);
            expect(name).toEqual('test.vet');
        });
    });
});
