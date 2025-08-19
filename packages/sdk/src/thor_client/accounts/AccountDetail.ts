import { type AccountData } from './AccountData';

/**
 * Represents detailed account information.
 *
 * Implements the {@link AccountData} interface.
 */
class AccountDetail implements AccountData {
    /**
     * Return the hexadecimal expression of the wei VET value of the balance.
     */
    readonly balance: string;

    /**
     * Return the hexadecimal expression of the wei VTHO value of the energy balance.
     */
    readonly energy: string;

    /**
     * Return `true` if the account is a smart contract, otherwise `false`.
     */
    readonly hasCode: boolean;

    /**
     * Constructs a new instance of the class.
     *
     * @param {AccountData} accountData - The data to initialize the account with.
     */
    constructor(accountData: AccountData) {
        this.balance = accountData.balance;
        this.energy = accountData.energy;
        this.hasCode = accountData.hasCode;
    }
}

export { AccountDetail };
