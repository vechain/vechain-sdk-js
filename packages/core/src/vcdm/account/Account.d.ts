import { type Address } from '../Address';
import { type Currency } from '../currency/Currency';
import { type VeChainDataModel } from '../VeChainDataModel';
type AccountType = 'EOA' | 'Contract';
/**
 * Represents a VeChain account.
 *
 * @implements {VeChainDataModel<Account>}
 */
declare class Account implements VeChainDataModel<Account> {
    readonly address: Address;
    readonly balance: Currency;
    readonly transactions: string[];
    readonly type: AccountType;
    constructor(address: Address, balance: Currency, type?: AccountType, transactions?: string[]);
    /**
     * Throws an exception because the account cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the account.
     * @throws {InvalidOperation} The account cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remarks The conversion to BigInt is not supported for an account.
     */
    get bi(): bigint;
    /**
     * Throws an exception because the account cannot be represented as a byte array.
     * @returns {Uint8Array} The byte array representation of the account.
     * @throws {InvalidOperation} The account cannot be represented as a byte array.
     * @override {@link VeChainDataModel#bytes}
     * @remarks The conversion to byte array is not supported for an account.
     */
    get bytes(): Uint8Array;
    /**
     * Throws an exception because the account cannot be represented as a number.
     * @returns {bigint} The number representation of the account.
     * @throws {InvalidOperation} The account cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remarks The conversion to number is not supported for an account.
     */
    get n(): number;
    /**
     * Adds a transaction to the account.
     * @param {string} transaction The transaction to add.
     */
    addTransaction(transaction: string): void;
    /**
     * Compare this instance with `that` in a meaningful way.
     *
     * @param {Account} that object to compare.
     * @return a negative number if `this` < `that`, zero if `this` = `that`, a positive number if `this` > that`.
     * @override {@link VeChainDataModel#compareTo}
     */
    compareTo(that: Account): number;
    /**
     * Checks if the given value is equal to the current instance.
     *
     * @param {Account} that - The value to compare.
     * @returns {boolean} - True if the values are equal, false otherwise.
     * @override {@link VeChainDataModel#isEqual}
     */
    isEqual(that: Account): boolean;
    /**
     * Returns a string representation of the account.
     *
     * @returns {string} A string representation of the account.
     */
    toString(): string;
}
export { Account };
export type { AccountType };
//# sourceMappingURL=Account.d.ts.map