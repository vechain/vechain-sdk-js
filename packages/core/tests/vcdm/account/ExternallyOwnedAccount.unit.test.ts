import { Address, type Currency, Mnemonic } from '../../../src';
import { Account, ExternallyOwnedAccount } from '../../../src/vcdm/account';

/**
 * Test ExternallyOwnedAccount class.
 * @group unit/vcdm
 */
describe('Account class tests', () => {
    describe('Construction tests', () => {
        test('Return an Account instance if the passed arguments are valid', () => {
            const balance = 1000000000000000000n;
            const mnemonic = Mnemonic.generate();
            const address = Address.ofMnemonic(mnemonic);
            const account = new ExternallyOwnedAccount(
                address,
                balance as unknown as Currency,
                mnemonic
            );
            expect(account).toBeInstanceOf(Account);
            expect(account).toBeInstanceOf(ExternallyOwnedAccount);
        });
    });
});
