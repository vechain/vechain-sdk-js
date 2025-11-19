"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
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
    (0, globals_1.describe)('resolveNames(string[])', () => {
        (0, globals_1.test)('Should use the correct resolveUtils based on the passed thor client', async () => {
            const names = ['test-sdk-1.vet', 'test-sdk-2.vet'];
            const executeCall = globals_1.jest.fn(async () => {
                return await Promise.reject(new Error('error'));
            });
            globals_1.jest.spyOn(thorClient.transactions, 'executeCall').mockImplementationOnce(executeCall);
            await (0, globals_1.expect)(src_1.vnsUtils.resolveNames(thorClient.blocks, thorClient.transactions, names)).rejects.toThrow();
            (0, globals_1.expect)(executeCall).toHaveBeenCalledWith('0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94', sdk_core_1.ABIItem.ofSignature(sdk_core_1.ABIFunction, 'function getAddresses(string[] names) returns (address[] addresses)'), [names]);
        });
        (0, globals_1.test)('Should return null if genesisBlock can not be loaded', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValueOnce(null);
            const addresses = await src_1.vnsUtils.resolveNames(thorClient.blocks, thorClient.transactions, ['test-sdk.vet']);
            (0, globals_1.expect)(addresses).toEqual([null]);
        });
        (0, globals_1.test)('Should return null if genesis has no matching configuration unknown', async () => {
            globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValueOnce({
                number: 0,
                id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea0000', // different genesis id
                size: 170,
                parentID: '0xffffffff00000000000000000000000000000000000000000000000000000000',
                timestamp: 1526400000,
                gasLimit: 10000000,
                beneficiary: '0x0000000000000000000000000000000000000000',
                gasUsed: 0,
                totalScore: 0,
                txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 0,
                stateRoot: '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
                receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                signer: '0x0000000000000000000000000000000000000000',
                isTrunk: true,
                transactions: []
            });
            const addresses = await src_1.vnsUtils.resolveNames(thorClient.blocks, thorClient.transactions, ['test-sdk.vet']);
            (0, globals_1.expect)(addresses).toEqual([null]);
        });
    });
    (0, globals_1.describe)('lookupAddresses(string[])', () => {
        (0, globals_1.test)('Should throw an error and call executeCall', async () => {
            const addresses = [
                '0x0000000000000000000000000000456E65726779',
                '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF'
            ];
            const executeCall = globals_1.jest.fn(async () => {
                return await Promise.reject(new Error('error'));
            });
            globals_1.jest.spyOn(thorClient.contracts, 'executeCall').mockImplementationOnce(executeCall);
            await (0, globals_1.expect)(src_1.vnsUtils.lookupAddresses(thorClient, addresses)).rejects.toThrow();
            (0, globals_1.expect)(executeCall).toHaveBeenCalledWith('0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94', sdk_core_1.ABIItem.ofSignature(sdk_core_1.ABIFunction, 'function getNames(address[] addresses) returns (string[] names)'), [addresses]);
        });
        (0, globals_1.test)('Should return null if genesisBlock can not be loaded', async () => {
            // Mock the  method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValueOnce(null);
            const names = await src_1.vnsUtils.lookupAddresses(thorClient, [
                '0x0000000000000000000000000000000000000000'
            ]);
            (0, globals_1.expect)(names).toEqual([null]);
        });
        (0, globals_1.test)('Should return null if genesis has no matching configuration unknown', async () => {
            globals_1.jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValueOnce({
                number: 0,
                id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea0000', // different genesis id
                size: 170,
                parentID: '0xffffffff00000000000000000000000000000000000000000000000000000000',
                timestamp: 1526400000,
                gasLimit: 10000000,
                beneficiary: '0x0000000000000000000000000000000000000000',
                gasUsed: 0,
                totalScore: 0,
                txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 0,
                stateRoot: '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
                receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                signer: '0x0000000000000000000000000000000000000000',
                isTrunk: true,
                transactions: []
            });
            const names = await src_1.vnsUtils.lookupAddresses(thorClient, [
                '0x0000000000000000000000000000000000000000'
            ]);
            (0, globals_1.expect)(names).toEqual([null]);
        });
    });
});
