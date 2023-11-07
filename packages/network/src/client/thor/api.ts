/**
 * Constructs the endpoint URL for retrieving account details.
 *
 * @param address - The account address.
 * @returns The URL endpoint to fetch account details.
 */
const GET_ACCOUNT_DETAIL_ENDPOINT = (address: string): string =>
    `/accounts/${address}`;

/**
 * Constructs the endpoint URL for retrieving the bytecode of a smart contract.
 *
 * @param address - The account address.
 * @returns The URL endpoint to fetch the smart contract's bytecode.
 */
const GET_ACCOUNT_BYTECODE_ENDPOINT = (address: string): string =>
    `/accounts/${address}/code`;

/**
 * Constructs the endpoint URL for retrieving the storage at a specific position of a smart contract.
 * This is usually used for querying the state of smart contracts.
 *
 * @param address - The account address.
 * @param position - The specified position in the contract's storage.
 * @returns The URL endpoint to fetch the storage data at the given position.
 */
const GET_STORAGE_AT_ENDPOINT = (address: string, position: string): string =>
    `/accounts/${address}/storage/${position}`;

export {
    GET_ACCOUNT_DETAIL_ENDPOINT,
    GET_ACCOUNT_BYTECODE_ENDPOINT,
    GET_STORAGE_AT_ENDPOINT
};
