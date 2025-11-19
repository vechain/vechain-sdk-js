"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Contract max fee per gas tests suite.
 *
 * @group integration
 */
(0, globals_1.describe)('ContractMaxFeePerGas', () => {
    (0, globals_1.test)('contract transactions have correct maxfeepergas', async () => {
        // setup thor client and spy on tx body
        const thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        const txBodySpy = globals_1.jest.spyOn(thorClient.transactions, 'buildTransactionBody');
        // setup mocks for fee history
        // note next block base fee comes from the fee history
        const mockBaseFeePerGas = '0xA012317B000';
        const mockRewardHistory = [
            '0x66bb89cd27',
            '0x66bb8d4b62',
            '0x66bb8d4b62'
        ];
        const mockedFeeHistory = {
            oldestBlock: '0x0',
            baseFeePerGas: [mockBaseFeePerGas], //
            gasUsedRatio: ['0.5'],
            reward: [mockRewardHistory]
        };
        const feeHistorySpy = globals_1.jest.spyOn(thorClient.gas, 'getFeeHistory');
        feeHistorySpy.mockResolvedValue(mockedFeeHistory);
        // call contract function as a transaction
        const testContractABI = (0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ABI;
        const testContractAddress = (0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ADDRESS;
        const testAccount = sdk_solo_setup_1.AccountDispatcher.getInstance().getNextAccount();
        const provider = new src_1.VeChainProvider(thorClient);
        const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.Hex.of(testAccount.privateKey).bytes, provider);
        const testContract = thorClient.contracts.load(testContractAddress, testContractABI, signer);
        const result = await testContract.transact.setStateVariable(1);
        (0, globals_1.expect)(result.id).toBeDefined();
        const actualTxBody = (await txBodySpy.mock.results[0]
            .value);
        (0, globals_1.expect)(actualTxBody).toBeDefined();
        (0, globals_1.expect)(actualTxBody.maxFeePerGas).toBeDefined();
        const actualMaxFeePerGas = sdk_core_1.Hex.of(actualTxBody.maxFeePerGas ?? '0x0').bi;
        // check the max fee calculations are correct
        const expectedMaxFeePerGas = (112n * BigInt(mockBaseFeePerGas)) / 100n +
            BigInt(mockRewardHistory[2]);
        (0, globals_1.expect)(actualMaxFeePerGas).toBe(expectedMaxFeePerGas);
    });
});
