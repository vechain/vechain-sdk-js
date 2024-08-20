import { type Address } from '../Address';
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

    constructor(address: Address, balance: Currency, mnemonic: Mnemonic) {
        super(address, balance);
        this.mnemonic = mnemonic;
    }

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
