import { type HttpClient } from '@http';
import { type Revision, type Address, HexUInt, type Hex } from '@vcdm';
import { AccountDetail } from './account-detail';
import {
    RetrieveAccountDetails,
    RetrieveContractBytecode,
    RetrieveStoragePositionValue
} from '@thor/accounts';

/**
 * The accounts module of the VeChain Thor blockchain.
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
     * @param {Revision} [revision] - Optional revision to modify the account retrieval.
     * @return {Promise<AccountDetail>} Returns a promise that resolves to the account details.
     */
    public async getAccount(
        address: Address,
        revision?: Revision
    ): Promise<AccountDetail> {
        const query = RetrieveAccountDetails.of(address, revision);
        const response = (await query.askTo(this.httpClient)).response;
        return new AccountDetail(response);
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
        revision?: Revision
    ): Promise<HexUInt> {
        const query = RetrieveContractBytecode.of(address, revision);
        const response = (await query.askTo(this.httpClient)).response;
        return HexUInt.of(response.code);
    }

    /**
     * Retrieves the storage value at the specified storage position for a given address.
     *
     * @param {Address} address - The address of the account whose storage value is to be retrieved.
     * @param {Hex} position - The position in the storage from where the value is to be retrieved.
     * @param {Revision} [revision] - Optional revision for specifying the block number or ID to query against.
     * @return {Promise<HexUInt>} - A promise that resolves to the storage value as a string.
     */
    public async getStorageAt(
        address: Address,
        position: Hex,
        revision?: Revision
    ): Promise<HexUInt> {
        const query = RetrieveStoragePositionValue.of(
            address,
            position,
            revision
        );
        const response = (await query.askTo(this.httpClient)).response;
        return HexUInt.of(response.value);
    }
}

export { AccountsModule };
