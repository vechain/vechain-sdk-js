"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src");
const VET_1 = require("../../../src/vcdm/currency/VET");
/**
 * Test Account class.
 * @group unit/vcdm
 */
describe('Account class tests', () => {
    const balance = VET_1.VET.of(src_1.FixedPointNumber.of(0));
    const mnemonic = src_1.Mnemonic.of();
    describe('Construction tests', () => {
        test('Return an Account instance if the passed arguments are valid', () => {
            const address = src_1.Address.ofMnemonic(mnemonic);
            const account = new src_1.Account(address, balance);
            expect(account).toBeInstanceOf(src_1.Account);
            account.addTransaction('0x1234567890abcdef');
            expect(account.transactions.length).toBe(1);
        });
    });
    describe('Unused methods tests', () => {
        test('bi - throw an error', () => {
            const address = src_1.Address.ofMnemonic(mnemonic);
            const account = new src_1.Account(address, balance);
            expect(() => account.bi).toThrow();
        });
        test('bytes - throw an error', () => {
            const address = src_1.Address.ofMnemonic(mnemonic);
            const account = new src_1.Account(address, balance);
            expect(() => account.bytes).toThrow();
        });
        test('n - throw an error', () => {
            const address = src_1.Address.ofMnemonic(mnemonic);
            const account = new src_1.Account(address, balance);
            expect(() => account.n).toThrow();
        });
    });
    describe('VCDM interface tests', () => {
        test('compareTo - compare two Account instances with different addresses', () => {
            const address1 = src_1.Address.ofMnemonic(mnemonic);
            const address2 = src_1.Address.ofMnemonic(src_1.Mnemonic.of());
            const account1 = new src_1.Account(address1, balance);
            const account2 = new src_1.Account(address2, balance);
            expect(account1.compareTo(account2)).not.toBe(0);
        });
        test('isEqual - compare two Account instances', () => {
            const address1 = src_1.Address.ofMnemonic(mnemonic);
            const account1 = new src_1.Account(address1, balance);
            const account2 = new src_1.Account(address1, balance);
            expect(account1.isEqual(account2)).toBe(true);
        });
        test('toString - get a string representation of the Account', () => {
            const address = src_1.Address.ofMnemonic(mnemonic);
            const account = new src_1.Account(address, balance);
            expect(account.toString()).toBe(`EOA Address: ${address.toString()} Balance: ${balance.toString()}`);
        });
    });
});
