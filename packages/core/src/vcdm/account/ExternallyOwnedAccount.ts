import { InvalidDataType } from '@vechain/sdk-errors';
import { Address } from '../Address';
import { type Currency } from '../Currency';
import { type Mnemonic } from '../Mnemonic';
import { Account, type AccountType } from './Account';

/**
 * Represents an externally owned account (EOA) on the VeChainThor blockchain.
 *
 * @extends {Account}
 */
class ExternallyOwnedAccount extends Account {
    readonly type: AccountType = 'EOA';

    private readonly mnemonic: Mnemonic;
    // TODO: Review whether we need to add the SECP256k1 key pair here.

    constructor(
        address: Address,
        balance: Currency,
        mnemonic: Mnemonic,
        transactions?: string[]
    ) {
        if (!ExternallyOwnedAccount.isValid(address, mnemonic)) {
            throw new InvalidDataType(
                'ExternallyOwnedAccount.constructor',
                'The address and mnemonic do not match.',
                { address: address.toString() }
            );
        }
        super(address, balance, transactions);
        this.mnemonic = mnemonic;
    }

    /**
     * Validates that the given address and mnemonic's address match.
     * @param {Address} address Address to validate.
     * @param {Mnemonic} mnemonic Mnemonic to validate.
     * @returns {boolean} True if the address and mnemonic's address match, false otherwise.
     */
    public static isValid(address: Address, mnemonic: Mnemonic): boolean {
        const addressFromMnemonic = Address.ofMnemonic(mnemonic);
        return address.isEqual(addressFromMnemonic);
    }

    /**
     * Compares the current ExternallyOwnedAccount object with the given ExternallyOwnedAccount object.
     * @param {ExternallyOwnedAccount} that - The ExternallyOwnedAccount object to compare with.
     * @return {number} - A negative number if the current object is less than the given object,
     *                   zero if they are equal, or a positive number if the current object is greater.
     * @override {@link Account#compareTo}
     * @remark The comparison is based on the address and mnemonic of the ExternallyOwnedAccount.
     */
    public compareTo(that: ExternallyOwnedAccount): number {
        const accountCompareTo = super.compareTo(that);
        if (accountCompareTo !== 0) {
            return accountCompareTo;
        }
        return this.mnemonic.compareTo(that.mnemonic);
    }

    /**
     * Checks if the current ExternallyOwnedAccount object is equal to the given ExternallyOwnedAccount object.
     * @param {ExternallyOwnedAccount} that - The ExternallyOwnedAccount object to compare with.
     * @return {boolean} - True if the objects are equal, false otherwise.
     * @override {@link Account#isEqual}
     * @remark The comparison is based on the address and mnemonic of the ExternallyOwnedAccount.
     */
    public isEqual(that: ExternallyOwnedAccount): boolean {
        return super.isEqual(that) && this.mnemonic.isEqual(that.mnemonic);
    }

    /**
     * Returns a string representation of the ExternallyOwnedAccount.
     *
     * @returns {string} A string representation of the ExternallyOwnedAccount.
     */
    public toString(): string {
        return `${super.toString()} Mnemonic: ${this.mnemonic.toString()}`;
    }
}

export { ExternallyOwnedAccount };
