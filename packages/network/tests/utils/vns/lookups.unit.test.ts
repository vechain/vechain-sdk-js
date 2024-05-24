import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { ThorClient, vnsUtils } from '../../../src';
import { testnetUrl } from '../../fixture';

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
        thorClient = ThorClient.fromUrl(testnetUrl);
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

    // describe('resolveNames([name])', () => {
    //     test('Should use the correct resolveUtils based on the passed thor client', async () => {
    //         const name = 'test-sdk.vet';
    //         jest.spyOn(thorClient.contracts, 'executeCall');
    //         await vnsUtils.resolveName(thorClient, name);
    //         expect(thorClient.contracts.executeCall).toHaveBeenCalledWith(
    //             '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
    //             'function getAddresses(string[] names) returns (address[] addresses)',
    //             [name]
    //         );
    //     });
    // });

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
