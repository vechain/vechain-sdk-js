import { type GetAccountResponse } from '@thor/accounts/response/GetAccountResponse';

/**
 * Represents detailed account information.
 */
class AccountDetail {
    /**
     * The VET balance of the account.
     */
    readonly balance: bigint;

    /**
     * The VTHO balance of the account.
     */
    readonly energy: bigint;

    /**
     * Return `true` if the account is a smart contract, otherwise `false`.
     */
    readonly hasCode: boolean;

    /**
     * Returns the balance of the account in wei.
     */
    get vet(): bigint {
        return this.balance;
    }

    /**
     * Returns the energy balance of the account in wei.
     */
    get vtho(): bigint {
        return this.energy;
    }

    /**
     * Constructs a new instance of the class.
     *
     * @param {AccountData} accountData - The data to initialize the account with.
     */
    constructor(accountData: GetAccountResponse) {
        this.balance = accountData.balance;
        this.energy = accountData.energy;
        this.hasCode = accountData.hasCode;
    }
}

export { AccountDetail };
