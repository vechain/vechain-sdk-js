/**
 * Constructs the endpoint URL for retrieving account details.
 *
 * @param address - The account address.
 * @returns The URL endpoint to fetch account details.
 */
const ACCOUNT_DETAIL = (address: string): string => `/accounts/${address}`;

/**
 * Constructs the endpoint URL for retrieving the bytecode of a smart contract.
 *
 * @param address - The account address.
 * @returns The URL endpoint to fetch the smart contract's bytecode.
 */
const ACCOUNT_BYTECODE = (address: string): string =>
    `/accounts/${address}/code`;

/**
 * Constructs the endpoint URL for retrieving the storage at a specific position of a smart contract.
 * This is usually used for querying the state of smart contracts.
 *
 * @param address - The account address.
 * @param position - The specified position in the contract's storage.
 * @returns The URL endpoint to fetch the storage data at the given position.
 */
const STORAGE_AT = (address: string, position: string): string =>
    `/accounts/${address}/storage/${position}`;

export const account = {
    ACCOUNT_DETAIL,
    ACCOUNT_BYTECODE,
    STORAGE_AT
};
