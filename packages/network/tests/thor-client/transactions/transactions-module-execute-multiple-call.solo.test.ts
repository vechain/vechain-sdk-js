import { describe, expect, test } from '@jest/globals';
import {
    type ContractCallOptions,
    THOR_SOLO_URL,
    ThorClient
} from '../../../src';
import { ABIContract } from '@vechain/sdk-core';
import {
    AccountDispatcher,
    getConfigData,
    type ThorSoloAccount
} from '@vechain/sdk-solo-setup';

/**
 * Tests for the executeMultipleClausesCall method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module Execute Call', () => {
    let thorSoloClient: ThorClient;
    let accountDispatcher: AccountDispatcher;
    let account: ThorSoloAccount;

    const testContractABI = ABIContract.ofAbi(
        getConfigData().TESTING_CONTRACT_ABI
    );
    const testContractAddress = getConfigData().TESTING_CONTRACT_ADDRESS;
    const getBalanceFn = testContractABI.getFunction('getBalance');
    const greaterThan10Fn = testContractABI.getFunction('testRequireError');

    beforeAll(() => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
        accountDispatcher = AccountDispatcher.getInstance();
        account = accountDispatcher.getNextAccount();
    });

    test('ok <- Execute multiple call for testing contract', async () => {
        // setup options
        const options: ContractCallOptions = {
            gas: 1000000
        };
        // setup clauses
        const clauses = [
            {
                clause: {
                    to: testContractAddress,
                    data: getBalanceFn.encodeData([account.address]).toString(),
                    value: '0x0'
                },
                functionAbi: getBalanceFn
            },
            {
                clause: {
                    to: testContractAddress,
                    data: greaterThan10Fn.encodeData([100]).toString(),
                    value: '0x0'
                },
                functionAbi: greaterThan10Fn
            }
        ];
        // execute the transaction
        const result =
            await thorSoloClient.transactions.executeMultipleClausesCall(
                clauses,
                options
            );
        expect(result[0].success).toBe(true);
        expect(result[1].success).toBe(true);
    });
});
