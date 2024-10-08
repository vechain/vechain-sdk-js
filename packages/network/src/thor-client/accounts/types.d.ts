/* --- Input options start --- */

/**
 * Input options for:
 * * getAccount
 * * getBytecode
 * * getStorage
 * Methods
 */
interface AccountInputOptions {
    /**
     * (Optional) The block number or ID to reference the bytecode version.
     */
    revision?: string;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * The account details represent the balance, energy & whether the account is a smart contract.
 */
interface AccountData {
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

/**
 * The bytecode of a smart contract.
 * The bytecode is represented in hex string.
 */
interface ResponseBytecode {
    /**
     * Bytecode of the smart contract
     */
    code: string;
}

/**
 * The storage data of a smart contract at the specified position.
 * The storage data is represented in hex string.
 */
interface ResponseStorage {
    /**
     * Hex string of the storage data
     */
    value: string;
}

/* --- Responses Outputs end --- */

export type {
    AccountInputOptions,
    AccountData,
    ResponseBytecode,
    ResponseStorage
};
