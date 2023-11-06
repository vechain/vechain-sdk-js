/**
 * Represents a blockchain account
 */
interface Account {
    // Balance of the account in VET as a hexadecimal string
    balance: string;

    // Energy of the account in VTHO as a hexadecimal string
    energy: string;

    // Indicates whether the account has associated code
    hasCode: boolean;
}

export type { Account };
