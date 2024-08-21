import { describe, expect, test } from '@jest/globals';
import { delegationHandlerFixture } from './fixture';
import { DelegationHandler, TESTNET_URL, ThorClient } from '../../../../src';
import { Transaction } from '@vechain/sdk-core';
import { transactions } from '../../../../../core/tests/transaction/fixture';
import { NotDelegatedTransaction } from '@vechain/sdk-errors';

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
            // await DelegationHandler({
            //     delegatorPrivateKey:
            //         '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
            // }).getDelegationSignatureUsingUrl(
            //     new Transaction(transactions.delegated[0].body),
            //     '0x',
            //     ThorClient.fromUrl(TESTNET_URL).httpClient
            // );
            await expect(async () => {
                await DelegationHandler({
                    delegatorPrivateKey:
                        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                }).getDelegationSignatureUsingUrl(
                    new Transaction(transactions.delegated[0].body),
                    '0x',
                    ThorClient.fromUrl(TESTNET_URL).httpClient
                );
            }).rejects.toThrowError(NotDelegatedTransaction);
        });
    });
});
