import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { type HttpClient, buildQuery, thorest } from '../../../utils';
import {
    type ResponseBytecode,
    type AccountDetail,
    type ResponseStorage,
    type AccountInputOptions
} from './types';
import {
    dataUtils,
    assertIsAddress,
    assertIsRevisionForAccount
} from '@vechainfoundation/vechain-sdk-core';

/**
 * The `AccountClient` class provides methods to interact with account-related endpoints
 * of the VechainThor blockchain. It allows fetching details, bytecode, and storage data
 * for a specific blockchain account.
 */
class AccountsClient {
    /**
     * Initializes a new instance of the `AccountClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Retrieves account details such as balance of VET, VTHO, and if the address is a smart contract.
     *
     * @param address - The account address to query details for.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to an object containing the account details (balance, energy, hasCode).
     *
     * @throws {InvalidDataTypeError} - Will throw an error if the revision is not a valid block number or ID
     *         or if the address is not a valid address.
     */
    public async getAccount(
        address: string,
        options?: AccountInputOptions
    ): Promise<AccountDetail> {
        assertIsAddress(address);

        assertIsRevisionForAccount(options?.revision);

        return (await this.httpClient.http(
            'GET',
            thorest.accounts.get.ACCOUNT_DETAIL(address),
            {
                query: buildQuery({ revision: options?.revision })
            }
        )) as AccountDetail;
    }

    /**
     * Fetches the bytecode of a contract at a given address.
     *
     * @param address - The contract address to get the bytecode for.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the contract bytecode as a string.
     *
     * @throws {InvalidDataTypeError} - Will throw an error if the revision is not a valid block number or ID
     *         or if the address is not a valid address.
     */
    public async getBytecode(
        address: string,
        options?: AccountInputOptions
    ): Promise<string> {
        assertIsAddress(address);

        assertIsRevisionForAccount(options?.revision);

        const result = (await this.httpClient.http(
            'GET',
            thorest.accounts.get.ACCOUNT_BYTECODE(address),
            {
                query: buildQuery({ revision: options?.revision })
            }
        )) as ResponseBytecode;

        return result.code;
    }

    /**
     * Retrieves the value from a smart contract's storage at a given position.
     *
     * @param address - The contract address to query storage from.
     * @param position - The position in the storage to retrieve the value from. Must be a 32 bytes hex string (66 characters including `0x` prefix).
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the storage value in hex string format.
     *
     * @throws {InvalidDataTypeError} - Will throw an error if the revision is not a valid block number or ID
     *         or if the position is not a 32 bytes hex string or if the address is not a valid address.
     */
    public async getStorageAt(
        address: string,
        position: string,
        options?: AccountInputOptions
    ): Promise<string> {
        assertIsAddress(address);

        assertIsRevisionForAccount(options?.revision);

        // The position represents a slot in the VM storage. Each slot is 32 bytes.
        assert(
            dataUtils.isHexString(position) && position.length === 66,
            DATA.INVALID_DATA_TYPE,
            'Invalid `position`. The position must be a hex string of 32 bytes (66 characters including `0x` prefix).',
            { position }
        );

        const result = (await this.httpClient.http(
            'GET',
            thorest.accounts.get.STORAGE_AT(address, position),
            {
                query: buildQuery({ position, revision: options?.revision })
            }
        )) as ResponseStorage;

        return result.value;
    }
}

export { AccountsClient };
