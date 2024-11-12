import { AccountDetail } from './AccountDetail';
import { buildQuery, thorest } from '../../utils';
import { type AccountData } from './AccountData';
import { type AccountInputOptions } from './AccountInputOptions';
import { type Address, type BlockId, HexUInt } from '@vechain/sdk-core';
import { type HttpClient } from '../../http';

/**
 * of the VeChain Thor blockchain.
 * It allows to retrieve details, bytecode, and storage data for a specific blockchain account.
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
     */
    public async getAccount(
        address: Address,
        options?: AccountInputOptions
    ): Promise<AccountDetail> {
        const revision = options?.revision?.toString();
        return new AccountDetail(
            (await this.httpClient.get(
                thorest.accounts.get.ACCOUNT_DETAIL(address.toString()),
                {
                    query: buildQuery({ revision })
                }
            )) as AccountData
        );
    }

    /**
     * Retrieves the bytecode of the smart contract deployed at the specified address.
     *
     * @param {Address} address - The address of the smart contract.
     * @param {AccountInputOptions} [options] - Optional settings for the request, including the block revision.
     * @return {Promise<HexUInt>} A promise that resolves to the bytecode of the smart contract.
     */
    public async getBytecode(
        address: Address,
        options?: AccountInputOptions
    ): Promise<HexUInt> {
        const revision = options?.revision?.toString();
        const result = (await this.httpClient.get(
            thorest.accounts.get.ACCOUNT_BYTECODE(address.toString()),
            {
                query: buildQuery({ revision })
            }
        )) as ResponseBytecode;
        return HexUInt.of(result.code);
    }

    /**
     * Retrieves the storage value at the specified storage position for a given address.
     *
     * @param {Address} address - The address of the account whose storage value is to be retrieved.
     * @param {ThorId} position - The position in the storage from where the value is to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters including revision for specifying the block number or ID to query against.
     * @return {Promise<HexUInt>} - A promise that resolves to the storage value as a string.
     */
    public async getStorageAt(
        address: Address,
        position: BlockId,
        options?: AccountInputOptions
    ): Promise<HexUInt> {
        const pos = position.toString();
        const revision = options?.revision?.toString();
        const result = (await this.httpClient.get(
            thorest.accounts.get.STORAGE_AT(address.toString(), pos),
            {
                query: buildQuery({ pos, revision })
            }
        )) as ResponseStorage;

        return HexUInt.of(result.value);
    }
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

export { AccountsModule };
