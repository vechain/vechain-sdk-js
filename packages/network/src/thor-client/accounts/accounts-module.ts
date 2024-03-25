import { assert, DATA } from '@vechain/sdk-errors';
import { buildQuery, thorest } from '../../utils';
import {
    type AccountDetail,
    type AccountInputOptions,
    type ResponseBytecode,
    type ResponseStorage
} from './types';
import {
    assertIsAddress,
    assertIsRevisionForAccount,
    Hex0x
} from '@vechain/sdk-core';
import { type ThorClient } from '../thor-client';

/**
 * The `AccountModule` class provides methods to interact with account-related endpoints
 * of the VechainThor blockchain. It allows fetching details, bytecode, and storage data
 * for a specific blockchain account.
 */
class AccountsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

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
        assertIsAddress('getAccount', address);

        assertIsRevisionForAccount('getAccount', options?.revision);

        return (await this.thor.httpClient.http(
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
        assertIsAddress('getBytecode', address);

        assertIsRevisionForAccount('getBytecode', options?.revision);

        const result = (await this.thor.httpClient.http(
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
        assertIsAddress('getStorageAt', address);

        assertIsRevisionForAccount('getStorageAt', options?.revision);

        // The position represents a slot in the VM storage. Each slot is 32 bytes.
        assert(
            'getStorageAt',
            Hex0x.isValid(position) && position.length === 66,
            DATA.INVALID_DATA_TYPE,
            'Invalid `position`. The position must be a hex string of 32 bytes (66 characters including `0x` prefix).',
            { position }
        );

        const result = (await this.thor.httpClient.http(
            'GET',
            thorest.accounts.get.STORAGE_AT(address, position),
            {
                query: buildQuery({ position, revision: options?.revision })
            }
        )) as ResponseStorage;

        return result.value;
    }
}

export { AccountsModule };
