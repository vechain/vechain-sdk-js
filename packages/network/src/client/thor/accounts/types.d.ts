/**
 * An account represents both an EOA and a smart contract on the VechainThor blockchain.
 *
 * This interface provides methods to interact with accounts on the VechainThor blockchain.
 */
interface IAccountClient {
    /**
     * Get the account details of the specified account.
     *
     * @param address - The address of the account.
     * @param revision - The block revision as the desired block number o block id (default: best block).
     *
     * @returns an object containing the account's balance (VET), energy (VTHO) & whether it is a smart contract (hasCode).
     */
    getAccount: (address: string, revision?: string) => Promise<AccountDetail>;

    /**
     * Get the bytecode of the deployed smart contract.
     *
     * @param address - The address of the smart contract.
     * @param revision - The block revision as the desired block number o block id (default: best block).
     *                   Bytecode is immutable for a smart contract, thus the revision can be useful to check if the
     *                   smart contract was deployed at the specified block.
     *
     * @returns the bytecode of the deployed smart contract in hex string.
     */
    getBytecode: (address: string, revision?: string) => Promise<string>;

    /**
     * Get the storage data at the specified position of the smart contract.
     *
     * @param address - The address of the smart contract.
     * @param position - The position of the storage data.
     * @param revision - The block revision as the desired block number o block id (default: best block).
     *
     * @returns the storage data at the specified position of the smart contract in hex string.
     */
    getStorageAt: (
        address: string,
        position: string,
        revision?: string
    ) => Promise<string>;
}

/**
 * The account details represent the balance, energy & whether the account is a smart contract.
 */
interface AccountDetail {
    /**
     * The balance of VET of the account.
     */
    balance: string;

    /**
     * The balance of VTHO of the account.
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
    code: string;
}

/**
 * The storage data of a smart contract at the specified position.
 * The storage data is represented in hex string.
 */
interface ResponseStorage {
    value: string;
}

export type {
    IAccountClient,
    AccountDetail,
    ResponseBytecode,
    ResponseStorage
};
