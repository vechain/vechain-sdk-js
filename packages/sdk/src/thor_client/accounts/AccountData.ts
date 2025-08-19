/**
 * The account details represent the balance, energy & whether the account is a smart contract.
 */
export interface AccountData {
    /**
     * The hexadecimal expression of the wei VET value of the balance.
     */
    balance: string;

    /**
     * The hexadecimal expression of the wei VTHO value of the energy balance.
     */
    energy: string;

    /**
     * Whether the account is a smart contract (i.e., hasCode is true)
     */
    hasCode: boolean;
}
