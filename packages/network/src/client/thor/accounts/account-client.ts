import { DATA, buildError } from '@vechain-sdk/errors';
import { blockUtils, buildQuery } from '../../../utils';
import { type HttpClient } from '../../http';
import {
    GET_ACCOUNT_BYTECODE_ENDPOINT,
    GET_ACCOUNT_DETAIL_ENDPOINT,
    GET_STORAGE_AT_ENDPOINT
} from '../api';
import {
    type ResponseBytecode,
    type AccountDetail,
    type IAccountClient,
    type ResponseStorage
} from './types';
import { dataUtils, addressUtils } from '@vechain-sdk/core';

/**
 * The `AccountClient` class provides methods to interact with account-related endpoints
 * of the VechainThor blockchain. It allows fetching details, bytecode, and storage data
 * for a specific blockchain account.
 */
class AccountClient implements IAccountClient {
    /**
     * Initializes a new instance of the `AccountClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Retrieves account details such as balance of VET, VTHO, and if the address is a smart contract.
     *
     * @param address - The account address to query details for.
     * @param revision - (Optional) The block number or ID to reference the state of the account.
     * @returns A promise that resolves to an object containing the account details (balance, energy, hasCode).
     *
     * @throws {InvalidDataTypeError} - Will throw an error if the revision is not a valid block number or ID
     *         or if the address is not a valid address.
     */
    public async getAccount(
        address: string,
        revision?: string
    ): Promise<AccountDetail> {
        if (!addressUtils.isAddress(address)) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid address. The address must be 20 bytes (a 42 characters hex string with a `0x` prefix.)'
            );
        }

        if (revision != null && !blockUtils.isBlockRevision(revision))
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid revision. The revision must be a string representing a block number or block id.'
            );

        return (await this.httpClient.http(
            'GET',
            GET_ACCOUNT_DETAIL_ENDPOINT(address),
            {
                query: buildQuery({ revision })
            }
        )) as AccountDetail;
    }

    /**
     * Fetches the bytecode of a contract at a given address.
     *
     * @param address - The contract address to get the bytecode for.
     * @param revision - (Optional) The block number or ID to reference the bytecode version.
     * @returns A promise that resolves to the contract bytecode as a string.
     *
     * @throws {InvalidDataTypeError} - Will throw an error if the revision is not a valid block number or ID
     *         or if the address is not a valid address.
     */
    public async getBytecode(
        address: string,
        revision?: string
    ): Promise<string> {
        if (!addressUtils.isAddress(address)) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid address. The address must be 20 bytes (a 42 characters hex string with a `0x` prefix.)'
            );
        }

        if (revision != null && !blockUtils.isBlockRevision(revision))
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid revision. The revision must be a string representing a block number or block id.'
            );

        const result = (await this.httpClient.http(
            'GET',
            GET_ACCOUNT_BYTECODE_ENDPOINT(address),
            {
                query: buildQuery({ revision })
            }
        )) as ResponseBytecode;

        return result.code;
    }

    /**
     * Retrieves the value from a smart contract's storage at a given position.
     *
     * @param address - The contract address to query storage from.
     * @param position - The position in the storage to retrieve the value from. Must be a 32 bytes hex string (66 characters including `0x` prefix).
     * @param revision - (Optional) The block number or ID to reference the storage state.
     * @returns A promise that resolves to the storage value in hex string format.
     *
     * @throws {InvalidDataTypeError} - Will throw an error if the revision is not a valid block number or ID
     *         or if the position is not a 32 bytes hex string or if the address is not a valid address.
     */
    public async getStorageAt(
        address: string,
        position: string,
        revision?: string
    ): Promise<string> {
        if (!addressUtils.isAddress(address)) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid address. The address must be 20 bytes (a 42 characters hex string with a `0x` prefix.)'
            );
        }

        if (revision != null && !blockUtils.isBlockRevision(revision))
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid `revision`. The revision must be a string representing a block number or block id.'
            );

        // The position represents a slot in the VM storage. Each slot is 32 bytes.
        if (!dataUtils.isHexString(position) || position.length !== 66)
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid `position`. The position must be a hex string of 32 bytes (66 characters including `0x` prefix).'
            );

        const result = (await this.httpClient.http(
            'GET',
            GET_STORAGE_AT_ENDPOINT(address, position),
            {
                query: buildQuery({ position, revision })
            }
        )) as ResponseStorage;

        return result.value;
    }
}

export { AccountClient };
