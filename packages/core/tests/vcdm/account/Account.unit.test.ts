import { Address, FixedPointNumber, Mnemonic, Account } from '../../../src';
import { VET } from '../../../src/vcdm/currency/VET';

/**
 * Test Account class.
 * @group unit/vcdm
 */
describe('Account class tests', () => {
    const balance = VET.of(FixedPointNumber.of(0));
    const mnemonic = Mnemonic.of();
    describe('Construction tests', () => {
        test('Return an Account instance if the passed arguments are valid', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new Account(address, balance);
            expect(account).toBeInstanceOf(Account);
            account.addTransaction('0x1234567890abcdef');
            expect(account.transactions.length).toBe(1);
        });
    });
    describe('Unused methods tests', () => {
        test('bi - throw an error', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new Account(address, balance);
            expect(() => account.bi).toThrow();
        });
        test('bytes - throw an error', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new Account(address, balance);
            expect(() => account.bytes).toThrow();
        });
        test('n - throw an error', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new Account(address, balance);
            expect(() => account.n).toThrow();
        });
    });
    describe('VCDM interface tests', () => {
        test('compareTo - compare two Account instances with different addresses', () => {
            const address1 = Address.ofMnemonic(mnemonic);
            const address2 = Address.ofMnemonic(Mnemonic.of());
            const account1 = new Account(address1, balance);
            const account2 = new Account(address2, balance);
            expect(account1.compareTo(account2)).not.toBe(0);
        });
        test('isEqual - compare two Account instances', () => {
            const address1 = Address.ofMnemonic(mnemonic);
            const account1 = new Account(address1, balance);
            const account2 = new Account(address1, balance);
            expect(account1.isEqual(account2)).toBe(true);
        });
        test('toString - get a string representation of the Account', () => {
            const address = Address.ofMnemonic(mnemonic);
            const account = new Account(address, balance);
            expect(account.toString()).toBe(
                `EOA Address: ${address.toString()} Balance: ${balance.toString()}`
            );
        });
    });
});
