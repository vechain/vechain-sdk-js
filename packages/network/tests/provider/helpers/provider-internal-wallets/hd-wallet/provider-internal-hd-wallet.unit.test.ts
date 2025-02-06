import { describe, expect, test } from '@jest/globals';

import { hdNodeFixtures } from './fixture';
import {
    DelegationHandler,
    ProviderInternalHDWallet
} from '../../../../../src';

/**
 * Unit test for ProviderInternalHDWallet class.
 *
 * @group unit/provider/helpers/provider-internal-hd-wallet
 */
describe('ProviderInternalHDWallet wallet tests', () => {
    /**
     * Test the creation of the hd wallet
     */
    describe('Test wallet creation', () => {
        /**
         * Test without blocking execution on steps
         */
        hdNodeFixtures.forEach((hdNodeFixture) => {
            /**
             * Test wallet creation and execution of wallet functions
             */
            test('Should be able to create a wallet and execute functions', async () => {
                const hdWallet = new ProviderInternalHDWallet(
                    hdNodeFixture.mnemonic.split(' '),
                    hdNodeFixture.count,
                    hdNodeFixture.initialIndex,
                    hdNodeFixture.path,
                    { delegator: hdNodeFixture.delegator }
                );

                const addresses = await hdWallet.getAddresses();
                const delegator = await hdWallet.getGasPayer();

                expect(addresses).toEqual(hdNodeFixture.expectedAddress);
                expect(delegator).toEqual(
                    DelegationHandler(delegator).delegatorOrNull()
                );
            });
        });
    });
});
