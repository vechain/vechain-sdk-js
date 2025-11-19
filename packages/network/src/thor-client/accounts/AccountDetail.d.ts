import { VET, VTHO } from '@vechain/sdk-core';
import { type AccountData } from './AccountData';
/**
 * Represents detailed account information.
 *
 * Implements the {@link AccountData} interface.
 */
declare class AccountDetail implements AccountData {
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
     * Returns the balance of the account in {@link VET}.
     */
    get vet(): VET;
    /**
     * Returns the energy balance of the account in {@link VTHO}.
     */
    get vtho(): VTHO;
    /**
     * Constructs a new instance of the class.
     *
     * @param {AccountData} accountData - The data to initialize the account with.
     */
    constructor(accountData: AccountData);
}
export { AccountDetail };
//# sourceMappingURL=AccountDetail.d.ts.map