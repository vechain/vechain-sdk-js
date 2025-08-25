import { type Address, type VeChainDataModel } from '@common/vcdm';
import { UnsupportedOperationError } from '@common/errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/vcdm/account/Account.ts!';

type AccountType = 'EOA' | 'Contract';

/**
 * Represents a VeChain account.
 *
 * @implements {VeChainDataModel<Account>}
 */
class Account implements VeChainDataModel<Account> {
    public readonly address: Address;
    public readonly balance: bigint;
    // Replace the string array with a Transaction class #1162
    public readonly transactions: string[];

    public readonly type: AccountType;

    constructor(
        address: Address,
        balance: bigint,
        type: AccountType = 'EOA',
        transactions?: string[]
    ) {
        this.address = address;
        this.balance = balance;
        this.type = type;
        this.transactions = transactions ?? [];
    }

    /**
     * Throws an exception because the account cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the account.
     * @throws {UnsupportedOperation} The account cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remarks The conversion to BigInt is not supported for an account.
     */
    public get bi(): bigint {
        throw new UnsupportedOperationError(
            `${FQP}<Account>.bi: bigint`,
            'There is no big integer representation for an account.'
        );
    }

    /**
     * Throws an exception because the account cannot be represented as a byte array.
     * @returns {Uint8Array} The byte array representation of the account.
     * @throws {UnsupportedOperation} The account cannot be represented as a byte array.
     * @override {@link VeChainDataModel#bytes}
     * @remarks The conversion to byte array is not supported for an account.
     */
    public get bytes(): Uint8Array {
        throw new UnsupportedOperationError(
            `${FQP}<Account>.bytes: Uint8Array`,
            'There is no bytes representation for an account.'
        );
    }

    /**
     * Throws an exception because the account cannot be represented as a number.
     * @returns {bigint} The number representation of the account.
     * @throws {UnsupportedOperation} The account cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remarks The conversion to number is not supported for an account.
     */
    public get n(): number {
        throw new UnsupportedOperationError(
            `${FQP}<Account>.n: number`,
            'There is no number representation for an account.'
        );
    }

    /**
     * Adds a transaction to the account.
     * @param {string} transaction The transaction to add.
     */
    public addTransaction(transaction: string): void {
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
    public compareTo(that: Account): number {
        const typeDiff = this.type.localeCompare(that.type);
        if (typeDiff === 0) {
            const addressDiff = this.address.compareTo(that.address);
            if (addressDiff === 0) {
                const balanceDiff =
                    this.balance < that.balance
                        ? -1
                        : this.balance > that.balance
                        ? 1
                        : 0;
                return balanceDiff;
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
    public isEqual(that: Account): boolean {
        return this.compareTo(that) === 0;
    }

    /**
     * Returns a string representation of the account.
     *
     * @returns {string} A string representation of the account.
     */
    public toString(): string {
        return `${this.type} Address: ${this.address.toString()} Balance: ${
            this.balance
        }`;
    }
}

export { Account };
export type { AccountType };
