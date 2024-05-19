import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    jest
} from '@jest/globals';

import { testnetUrl } from '../../../fixture';
import { ThorClient, VechainProvider, vnsUtils } from '../../../../src';

/**
 * Vechain provider tests
 *
 * @group integration/providers/vechain-provider
 */
describe('Vechain provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(testnetUrl);
        provider = new VechainProvider(thorClient);
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    describe('resolveName(vnsName)', () => {
        test('Should use vnsUtils.resolveNames() to resolve an address by name', async () => {
            jest.spyOn(vnsUtils, 'resolveName');
            const name = 'test-sdk.vet';
            await provider.resolveName(name);
            expect(vnsUtils.resolveName).toHaveBeenCalledWith(
                provider.thorClient,
                name
            );
        });

        test('Should return null if there were invalid result', async () => {
            const name = 'error.vet';
            jest.spyOn(vnsUtils, 'resolveNames').mockImplementation(
                async () => {
                    return await Promise.resolve([]);
                }
            );
            const address = await provider.resolveName(name);
            expect(address).toEqual(null);
        });

        test('Should pass address provided by resolveNames()', async () => {
            const name = 'address1.vet';
            jest.spyOn(vnsUtils, 'resolveName').mockImplementation(async () => {
                return await Promise.resolve(
                    '0x0000000000000000000000000000000000000001'
                );
            });
            const address = await provider.resolveName(name);
            expect(address).toEqual(
                '0x0000000000000000000000000000000000000001'
            );
        });
    });

    describe('lookupAddress(address)', () => {
        test('Should use vnsUtils.lookupAddress() to resolve an address by name', async () => {
            jest.spyOn(vnsUtils, 'lookupAddress');
            const address = '0x105199a26b10e55300CB71B46c5B5e867b7dF427';
            await provider.lookupAddress(address);
            expect(vnsUtils.lookupAddress).toHaveBeenCalledWith(
                provider.thorClient,
                address
            );
        });

        test('Should return null if there were invalid results', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            jest.spyOn(vnsUtils, 'lookupAddresses').mockImplementation(
                async () => {
                    return await Promise.resolve([]);
                }
            );
            const name = await provider.lookupAddress(address);
            expect(name).toEqual(null);
        });

        test('Should pass name provided by vnsUtils.resolveName()', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            jest.spyOn(vnsUtils, 'resolveName').mockImplementation(async () => {
                return await Promise.resolve('test.vet');
            });
            const name = await provider.resolveName(address);
            expect(name).toEqual('test.vet');
        });
    });
});
