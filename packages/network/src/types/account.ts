interface Account {
    /** balance (VET) in hex string */
    balance: string;
    /** energy (VTHO) in hex string */
    energy: string;
    /** whether the account has code */
    hasCode: boolean;
}

export type { Account };
