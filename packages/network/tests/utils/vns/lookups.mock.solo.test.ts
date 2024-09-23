import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { TESTNET_URL, ThorClient, vnsUtils } from '../../../src';
import { ABIFunction, ABIItem } from '@vechain/sdk-core';

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
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    describe('resolveNames(string[])', () => {
        test('Should use the correct resolveUtils based on the passed thor client', async () => {
            const names = ['test-sdk-1.vet', 'test-sdk-2.vet'];
            const executeCall = jest.fn(async () => {
                return await Promise.reject(new Error('error'));
            });
            jest.spyOn(
                thorClient.contracts,
                'executeCall'
            ).mockImplementationOnce(executeCall);

            await expect(
                vnsUtils.resolveNames(thorClient, names)
            ).rejects.toThrow();
            expect(executeCall).toHaveBeenCalledWith(
                '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
                ABIItem.ofSignature(
                    ABIFunction,
                    'function getAddresses(string[] names) returns (address[] addresses)'
                ),
                [names]
            );
        });

        test('Should return null if genesisBlock can not be loaded', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getGenesisBlock'
            ).mockResolvedValueOnce(null);

            const addresses = await vnsUtils.resolveNames(thorClient, [
                'test-sdk.vet'
            ]);
            expect(addresses).toEqual([null]);
        });

        test('Should return null if genesis has no matching configuration unknown', async () => {
            jest.spyOn(
                thorClient.blocks,
                'getGenesisBlock'
            ).mockResolvedValueOnce({
                number: 0,
                id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea0000', // different genesis id
                size: 170,
                parentID:
                    '0xffffffff00000000000000000000000000000000000000000000000000000000',
                timestamp: 1526400000,
                gasLimit: 10000000,
                beneficiary: '0x0000000000000000000000000000000000000000',
                gasUsed: 0,
                totalScore: 0,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 0,
                stateRoot:
                    '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                signer: '0x0000000000000000000000000000000000000000',
                isTrunk: true,
                transactions: []
            });

            const addresses = await vnsUtils.resolveNames(thorClient, [
                'test-sdk.vet'
            ]);
            expect(addresses).toEqual([null]);
        });
    });

    describe('lookupAddresses(string[])', () => {
        test('Should throw an error and call executeCall', async () => {
            const addresses = [
                '0x0000000000000000000000000000456E65726779',
                '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF'
            ];
            const executeCall = jest.fn(async () => {
                return await Promise.reject(new Error('error'));
            });
            jest.spyOn(
                thorClient.contracts,
                'executeCall'
            ).mockImplementationOnce(executeCall);

            await expect(
                vnsUtils.lookupAddresses(thorClient, addresses)
            ).rejects.toThrow();
            expect(executeCall).toHaveBeenCalledWith(
                '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
                ABIItem.ofSignature(
                    ABIFunction,
                    'function getNames(address[] addresses) returns (string[] names)'
                ),
                [addresses]
            );
        });

        test('Should return null if genesisBlock can not be loaded', async () => {
            // Mock the  method to return null
            jest.spyOn(
                thorClient.blocks,
                'getGenesisBlock'
            ).mockResolvedValueOnce(null);

            const names = await vnsUtils.lookupAddresses(thorClient, [
                '0x0000000000000000000000000000000000000000'
            ]);
            expect(names).toEqual([null]);
        });

        test('Should return null if genesis has no matching configuration unknown', async () => {
            jest.spyOn(
                thorClient.blocks,
                'getGenesisBlock'
            ).mockResolvedValueOnce({
                number: 0,
                id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea0000', // different genesis id
                size: 170,
                parentID:
                    '0xffffffff00000000000000000000000000000000000000000000000000000000',
                timestamp: 1526400000,
                gasLimit: 10000000,
                beneficiary: '0x0000000000000000000000000000000000000000',
                gasUsed: 0,
                totalScore: 0,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 0,
                stateRoot:
                    '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                signer: '0x0000000000000000000000000000000000000000',
                isTrunk: true,
                transactions: []
            });

            const names = await vnsUtils.lookupAddresses(thorClient, [
                '0x0000000000000000000000000000000000000000'
            ]);
            expect(names).toEqual([null]);
        });
    });
});
