"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Represents a VeChain account.
 *
 * @implements {VeChainDataModel<Account>}
 */
class Account {
    address;
    balance;
    // Replace the string array with a Transaction class #1162
    transactions;
    type;
    constructor(address, balance, type = 'EOA', transactions) {
        this.address = address;
        this.balance = balance;
        this.type = type;
        this.transactions = transactions ?? [];
    }
    /**
     * Throws an exception because the account cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the account.
     * @throws {InvalidOperation} The account cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remarks The conversion to BigInt is not supported for an account.
     */
    get bi() {
        throw new sdk_errors_1.InvalidOperation('Account.bi', 'There is no big integer representation for an account.', { data: '' });
    }
    /**
     * Throws an exception because the account cannot be represented as a byte array.
     * @returns {Uint8Array} The byte array representation of the account.
     * @throws {InvalidOperation} The account cannot be represented as a byte array.
     * @override {@link VeChainDataModel#bytes}
     * @remarks The conversion to byte array is not supported for an account.
     */
    get bytes() {
        throw new sdk_errors_1.InvalidOperation('Account.bytes', 'There is no bytes representation for an account.', { data: '' });
    }
    /**
     * Throws an exception because the account cannot be represented as a number.
     * @returns {bigint} The number representation of the account.
     * @throws {InvalidOperation} The account cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remarks The conversion to number is not supported for an account.
     */
    get n() {
        throw new sdk_errors_1.InvalidOperation('Account.n', 'There is no number representation for an account.', { data: '' });
    }
    /**
     * Adds a transaction to the account.
     * @param {string} transaction The transaction to add.
     */
    addTransaction(transaction) {
        // Replace body once Transaction class is implemented #1162
        this.transactions.push(transaction);
    }
    /**
     * Compare this instance with `that` in a meaningful way.
     *
     * @param {Account} that object to compare.
     * @return a negative number if `this` < `that`, zero if `this` = `that`, a positive number if `this` > that`.
     * @override {@link VeChainDataModel#compareTo}
     */
    compareTo(that) {
        const typeDiff = this.type.localeCompare(that.type);
        if (typeDiff === 0) {
            const addressDiff = this.address.compareTo(that.address);
            if (addressDiff === 0) {
                const codeDiff = this.balance.code.compareTo(that.balance.code);
                if (codeDiff === 0) {
                    return this.balance.value.compareTo(that.balance.value);
                }
                return codeDiff;
            }
            return addressDiff;
        }
        return typeDiff;
    }
    /**
     * Checks if the given value is equal to the current instance.
     *
     * @param {Account} that - The value to compare.
     * @returns {boolean} - True if the values are equal, false otherwise.
     * @override {@link VeChainDataModel#isEqual}
     */
    isEqual(that) {
        return this.compareTo(that) === 0;
    }
    /**
     * Returns a string representation of the account.
     *
     * @returns {string} A string representation of the account.
     */
    toString() {
        return `${this.type} Address: ${this.address.toString()} Balance: ${this.balance.value} ${this.balance.code}`;
    }
}
exports.Account = Account;
