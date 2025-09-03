import { describe, expect, test, jest } from '@jest/globals';
import {
    FeeHistoryResponse,
    THOR_SOLO_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '../../../src';
import { getConfigData, AccountDispatcher } from '@vechain/sdk-solo-setup';
import { Hex, TransactionBody } from '@vechain/sdk-core';

/**
 * Contract max fee per gas tests suite.
 *
 * @group integration
 */
describe('ContractMaxFeePerGas', () => {
    test('contract transactions have correct maxfeepergas', async () => {
        // setup thor client and spy on tx body
        const thorClient = ThorClient.at(THOR_SOLO_URL);
        const txBodySpy = jest.spyOn(
            thorClient.transactions,
            'buildTransactionBody'
        );
        // setup mocks for fee history
        // note next block base fee comes from the fee history
        const mockBaseFeePerGas = '0xA012317B000';
        const mockRewardHistory = [
            '0x66bb89cd27',
            '0x66bb8d4b62',
            '0x66bb8d4b62'
        ];
        const mockedFeeHistory: FeeHistoryResponse = {
            oldestBlock: '0x0',
            baseFeePerGas: [mockBaseFeePerGas], //
            gasUsedRatio: ['0.5'],
            reward: [mockRewardHistory]
        };
        const feeHistorySpy = jest.spyOn(thorClient.gas, 'getFeeHistory');
        feeHistorySpy.mockResolvedValue(mockedFeeHistory);
        // call contract function as a transaction
        const testContractABI = getConfigData().TESTING_CONTRACT_ABI;
        const testContractAddress = getConfigData().TESTING_CONTRACT_ADDRESS;
        const testAccount = AccountDispatcher.getInstance().getNextAccount();
        const provider = new VeChainProvider(thorClient);
        const signer = new VeChainPrivateKeySigner(
            Hex.of(testAccount.privateKey).bytes,
            provider
        );
        const testContract = thorClient.contracts.load(
            testContractAddress,
            testContractABI,
            signer
        );
        const result = await testContract.transact.setStateVariable(1);
        expect(result.id).toBeDefined();
        const actualTxBody = (await txBodySpy.mock.results[0]
            .value) as TransactionBody;
        expect(actualTxBody).toBeDefined();
        expect(actualTxBody.maxFeePerGas).toBeDefined();
        const actualMaxFeePerGas = Hex.of(
            actualTxBody.maxFeePerGas ?? '0x0'
        ).bi;
        // check the max fee calculations are correct
        const expectedMaxFeePerGas =
            (112n * BigInt(mockBaseFeePerGas)) / 100n +
            BigInt(mockRewardHistory[2]);
        expect(actualMaxFeePerGas).toBe(expectedMaxFeePerGas);
    });
});
