import { AccountDetail } from './AccountDetail';
import { InvalidDataType } from '@vechain/sdk-errors';
import { Revision, type Address, type ThorId } from '@vechain/sdk-core';
import { buildQuery, thorest } from '../../utils';
import { type HttpClient } from '../../http';
import {
    type AccountData,
    type AccountInputOptions,
    type ResponseBytecode,
    type ResponseStorage
} from './types';

/**
 * The `AccountModule` class provides methods to interact with account-related endpoints
 * of the VeChainThor blockchain.
 * It allows fetching details, bytecode, and storage data for a specific blockchain account.
 */
class AccountsModule {
    /**
     * Creates an instance of the class with a specified HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client instance to be used for making requests.
     */
    constructor(readonly httpClient: HttpClient) {}

    /**
     * Retrieves the details of an account given the account address and optional parameters.
     *
     * @param {Address} address - The address of the account to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters to modify the account retrieval.
     * @return {Promise<AccountDetail>} Returns a promise that resolves to the account details.
     * @throws {InvalidDataType} If the provided revision is not valid.
     */
    public async getAccount(
        address: Address,
        options?: AccountInputOptions
    ): Promise<AccountDetail> {
        // Check if the revision is a valid block number or ID
        if (
            options?.revision !== null &&
            options?.revision !== undefined &&
            !Revision.isValid(options.revision)
        ) {
            throw new InvalidDataType(
                'AccountsModule.getAccount()',
                'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
                { revision: options?.revision }
            );
        }
        return new AccountDetail(
            (await this.httpClient.get(
                thorest.accounts.get.ACCOUNT_DETAIL(address.toString()),
                {
                    query: buildQuery({ revision: options?.revision })
                }
            )) as AccountData
        );
    }

    /**
     * Retrieves the bytecode of the smart contract deployed at the specified address.
     *
     * @param {Address} address - The address of the smart contract.
     * @param {AccountInputOptions} [options] - Optional settings for the request, including the block revision.
     * @return {Promise<string>} A promise that resolves to the bytecode of the smart contract.
     * @throws {InvalidDataType} If the provided revision is not valid.
     */
    public async getBytecode(
        address: Address,
        options?: AccountInputOptions
    ): Promise<string> {
        // Check if the revision is a valid block number or ID
        if (
            options?.revision !== null &&
            options?.revision !== undefined &&
            !Revision.isValid(options.revision)
        ) {
            throw new InvalidDataType(
                'AccountsModule.getBytecode()',
                'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
                { revision: options?.revision }
            );
        }

        const result = (await this.httpClient.get(
            thorest.accounts.get.ACCOUNT_BYTECODE(address.toString()),
            {
                query: buildQuery({ revision: options?.revision })
            }
        )) as ResponseBytecode;

        return result.code;
    }

    /**
     * Retrieves the storage value at the specified storage position for a given address.
     *
     * @param {Address} address - The address of the account whose storage value is to be retrieved.
     * @param {ThorId} position - The position in the storage from where the value is to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters including revision for specifying the block number or ID to query against.
     * @return {Promise<string>} - A promise that resolves to the storage value as a string.
     * @throws {InvalidDataType} - Throws an error if the provided revision in options is invalid.
     */
    public async getStorageAt(
        address: Address,
        position: ThorId,
        options?: AccountInputOptions
    ): Promise<string> {
        // Check if the revision is a valid block number or ID
        if (
            options?.revision !== null &&
            options?.revision !== undefined &&
            !Revision.isValid(options.revision)
        ) {
            throw new InvalidDataType(
                'AccountsModule.getStorageAt()',
                'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
                { revision: options?.revision }
            );
        }
        const pos = position.toString();
        const result = (await this.httpClient.get(
            thorest.accounts.get.STORAGE_AT(address.toString(), pos),
            {
                query: buildQuery({ pos, revision: options?.revision })
            }
        )) as ResponseStorage;

        return result.value;
    }
}

export { AccountDetail, AccountsModule };
