import { InvalidDataType } from '@vechain/sdk-errors';
import { Address, Mnemonic } from '../../../src';
import { Account, ExternallyOwnedAccount } from '../../../src/vcdm/account';
import { type Currency } from '../../../src/vcdm/Currency';

// TODO: Use actual Currency subclasses once they are implemented.
const mockCurrency: Currency = {
    compareTo: jest.fn().mockReturnValue(0),
    bi: 0n,
    code: 'VET',
    n: 0,
    isEqual: jest.fn().mockReturnValue(true),
    bytes: new Uint8Array(0)
};

/**
 * Test ExternallyOwnedAccount class.
 * @group unit/vcdm
 */
describe('Account class tests', () => {
    const balance = mockCurrency;
    const mnemonic = Mnemonic.generate();
    describe('Construction tests', () => {
        test('Return an Account instance if the passed arguments are valid', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(account).toBeInstanceOf(Account);
            expect(account).toBeInstanceOf(ExternallyOwnedAccount);
            account.addTransaction('0x1234567890abcdef');
            expect(account.transactions.length).toBe(1);
        });
        test('Throw an error if the passed arguments are invalid', () => {
            const address = Address.of(
                '0x7Fa3c67d905886Cf5A4E4243F557d69282393693'
            );
            const createAccount = (): ExternallyOwnedAccount => {
                return new ExternallyOwnedAccount(address, balance, mnemonic);
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
    describe('Unused methods tests', () => {
        test('bi - throw an error', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(() => account.bi).toThrow();
        });
        test('bytes - throw an error', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(() => account.bytes).toThrow();
        });
        test('n - throw an error', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(() => account.n).toThrow();
        });
    });
    describe('VCDM interface tests', () => {
        test('compareTo - compare two ExternallyOwnedAccount instances', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account1 = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            const account2 = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(account1.compareTo(account2)).toBe(0);
        });
        test('compareTo - compare two ExternallyOwnedAccount instances with different addresses', () => {
            const address1 = Address.ofMnemonic(mnemonic);
            const mnemonic2 = Mnemonic.generate();
            const address2 = Address.ofMnemonic(mnemonic2);
            const account1 = new ExternallyOwnedAccount(
                address1,
                balance,
                mnemonic
            );
            const account2 = new ExternallyOwnedAccount(
                address2,
                balance,
                mnemonic2
            );
            expect(account1.compareTo(account2)).not.toBe(0);
        });
        test('isEqual - compare two ExternallyOwnedAccount instances', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account1 = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            const account2 = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(account1.isEqual(account2)).toBe(true);
        });
        test('toString - get a string representation of the ExternallyOwnedAccount', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new ExternallyOwnedAccount(
                address,
                balance,
                mnemonic
            );
            expect(account.toString()).toBe(
                `EOA Address: ${address.toString()} Balance: 0 Mnemonic: ${mnemonic.toString()}`
            );
        });
    });
});
