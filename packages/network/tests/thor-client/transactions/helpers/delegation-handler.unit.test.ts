import { describe, expect, test } from '@jest/globals';
import { delegationHandlerFixture } from './fixture';
import { DelegationHandler } from '../../../../src';

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
});
