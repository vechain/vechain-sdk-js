import { describe, expect, test } from '@jest/globals';
import {
    type ContractCallOptions,
    THOR_SOLO_URL,
    ThorClient
} from '../../../src';
import { ABIContract } from '@vechain/sdk-core';
import { AccountDispatcher, getConfigData } from '@vechain/sdk-solo-setup';

/**
 * Tests for the executeCall method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module Execute Call', () => {
    let thorSoloClient: ThorClient;
    let accountDispatcher: AccountDispatcher;

    const testContractABI = ABIContract.ofAbi(
        getConfigData().TESTING_CONTRACT_ABI
    );
    const testContractAddress = getConfigData().TESTING_CONTRACT_ADDRESS;
    const getBalanceFn = testContractABI.getFunction('getBalance');

    beforeAll(() => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
        accountDispatcher = AccountDispatcher.getInstance();
    });

    test('ok <- Execute call for testing contract', async () => {
        // setup options
        const options: ContractCallOptions = {
            gas: 1000000
        };
        // execute the transaction
        const result = await thorSoloClient.transactions.executeCall(
            testContractAddress,
            getBalanceFn,
            [accountDispatcher.getNextAccount().address],
            options
        );
        expect(result.success).toBe(true);
    });
});
