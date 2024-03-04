import { describe, expect, test } from '@jest/globals';
import { HDWallet } from '../../src';
import { DelegationHandler } from '@vechain/vechain-sdk-network';
import { hdNodeFixtures } from './fixture';

/**
 * Unit test for HDWallet class.
 *
 * @group unit/wallet/hd-wallet
 */
describe('HDWallet wallet tests', () => {
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
                const hdWallet = new HDWallet(
                    hdNodeFixture.mnemonic.split(' '),
                    hdNodeFixture.count,
                    hdNodeFixture.initialIndex,
                    hdNodeFixture.path,
                    { delegator: hdNodeFixture.delegator }
                );

                const addresses = await hdWallet.getAddresses();
                const delegator = await hdWallet.getDelegator();

                expect(addresses).toEqual(hdNodeFixture.expectedAddress);
                expect(delegator).toEqual(
                    DelegationHandler(delegator).delegatorOrNull()
                );
            });
        });
    });
});
