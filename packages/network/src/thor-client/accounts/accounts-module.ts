import { InvalidDataType } from '@vechain/sdk-errors';
import { Address, Revision, ThorId } from '@vechain/sdk-core';
import { buildQuery, thorest } from '../../utils';
import {
    type AccountDetail,
    type AccountInputOptions,
    type ResponseBytecode,
    type ResponseStorage
} from './types';
import { type ThorClient } from '../thor-client';

/**
 * The `AccountModule` class provides methods to interact with account-related endpoints
 * of the VeChainThor blockchain. It allows fetching details, bytecode, and storage data
 * for a specific blockchain account.
 */
class AccountsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Retrieves account details such as balance of VET, VTHO, and if the address is a smart contract.
     *
     * @param address - The account address to query details for.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to an object containing the account details (balance, energy, hasCode).
     * @throws {InvalidDataType}
     */
    public async getAccount(
        address: string,
        options?: AccountInputOptions
    ): Promise<AccountDetail> {
        // Invalid address
        if (!Address.isValid(address)) {
            throw new InvalidDataType(
                'AccountsModule.getAccount()',
                'Invalid address. The address must be a valid VeChainThor address.',
                { address }
            );
        }

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
     * @throws {InvalidDataType}
     */
    public async getBytecode(
        address: string,
        options?: AccountInputOptions
    ): Promise<string> {
        // Invalid address
        if (!Address.isValid(address)) {
            throw new InvalidDataType(
                'AccountsModule.getBytecode()',
                'Invalid address. The address must be a valid VeChainThor address.',
                { address }
            );
        }

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
     * @throws {InvalidDataType}
     */
    public async getStorageAt(
        address: string,
        position: string,
        options?: AccountInputOptions
    ): Promise<string> {
        // Invalid address
        if (!Address.isValid(address)) {
            throw new InvalidDataType(
                'AccountsModule.getStorageAt()',
                'Invalid address. The address must be a valid VeChainThor address.',
                { address }
            );
        }

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

        // The position represents a slot in the VM storage. Each slot is 32 bytes.
        if (!ThorId.isValid(position)) {
            throw new InvalidDataType(
                'AccountsModule.getStorageAt()',
                'Invalid `position`. The position must be a hex string of 32 bytes (66 characters including `0x` prefix).',
                { position }
            );
        }

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
