import { InvalidDataType } from '@vechain/sdk-errors';
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
        test('Throw an error if the passed arguments are invalid', () => {
            const balance = 1000000000000000000n;
            const mnemonic = Mnemonic.generate();
            const address = Address.of(
                '0x7Fa3c67d905886Cf5A4E4243F557d69282393693'
            );
            const createAccount = (): ExternallyOwnedAccount => {
                return new ExternallyOwnedAccount(
                    address,
                    balance as unknown as Currency,
                    mnemonic
                );
            };

            expect(createAccount).toThrow(InvalidDataType);
            try {
                createAccount();
            } catch (e) {
                if (e instanceof InvalidDataType) {
                    expect(e.message).toBe(
                        `Method 'ExternallyOwnedAccount.constructor' failed.` +
                            `\n-Reason: 'The address and mnemonic do not match.'` +
                            `\n-Parameters: \n\t{"address":"${address}"}` +
                            `\n-Internal error: \n\tNo internal error given`
                    );
                }
            }
        });
    });
});
