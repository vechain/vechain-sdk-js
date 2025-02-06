import { describe, expect, test } from '@jest/globals';
import { Transaction } from '@vechain/sdk-core';
import { NotDelegatedTransaction } from '@vechain/sdk-errors';
import { DelegationHandler, TESTNET_URL, ThorClient } from '../../../../src';
import { TransactionFixture } from '../../../../../core/tests/transaction/Transaction.unit.test';
import { delegationHandlerFixture } from './fixture';

/**
 * DelegationHandler helper function tests.
 * Testing the DelegationHandler helper function.
 *
 * @group unit/thor-client/transactions/helpers/delegation-handler
 */
describe('Tests of DelegationHandler helper function', () => {
    /**
     * DelegateHandler tests.
     *
     * @note we don't test the getDelegationSignatureUsingUrl method here, because:
     * - It's a method that uses the network.
     * - It's already tested in the integration tests of transactions-module.
     */
    delegationHandlerFixture.forEach(({ testName, delegator, expected }) => {
        test(testName, () => {
            const delegationHandler = DelegationHandler(delegator);
            expect(delegationHandler.isDelegated()).toBe(expected.isDelegated);
            expect(delegationHandler.delegatorOrUndefined()).toEqual(
                expected.delegatorOrUndefined
            );
            expect(delegationHandler.delegatorOrNull()).toEqual(
                expected.delegatorOrNull
            );
        });
    });

    /**
     * Negative tests cases
     */
    describe('Negative tests cases', () => {
        /**
         *Should throw an error when get delegatorUrl if delegator url is not provided.
         */
        test('Should throw an error when get delegatorUrl if delegator url is not provided', async () => {
            await expect(async () => {
                await DelegationHandler({
                    gasPayerPrivateKey:
                        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                }).getDelegationSignatureUsingUrl(
                    Transaction.of(TransactionFixture.delegated.body),
                    '0x',
                    ThorClient.at(TESTNET_URL).httpClient
                );
            }).rejects.toThrowError(NotDelegatedTransaction);
        });
    });
});
