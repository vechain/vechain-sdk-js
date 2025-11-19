import { AccountDetail } from './AccountDetail';
import { type AccountInputOptions } from './AccountInputOptions';
import { type Address, type BlockId, HexUInt } from '@vechain/sdk-core';
import { type HttpClient } from '../../http';
/**
 * of the VeChain Thor blockchain.
 * It allows to retrieve details, bytecode, and storage data for a specific blockchain account.
 */
declare class AccountsModule {
    readonly httpClient: HttpClient;
    /**
     * Creates an instance of the class with a specified HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client instance to be used for making requests.
     */
    constructor(httpClient: HttpClient);
    /**
     * Retrieves the details of an account given the account address and optional parameters.
     *
     * @param {Address} address - The address of the account to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters to modify the account retrieval.
     * @return {Promise<AccountDetail>} Returns a promise that resolves to the account details.
     */
    getAccount(address: Address, options?: AccountInputOptions): Promise<AccountDetail>;
    /**
     * Retrieves the bytecode of the smart contract deployed at the specified address.
     *
     * @param {Address} address - The address of the smart contract.
     * @param {AccountInputOptions} [options] - Optional settings for the request, including the block revision.
     * @return {Promise<HexUInt>} A promise that resolves to the bytecode of the smart contract.
     */
    getBytecode(address: Address, options?: AccountInputOptions): Promise<HexUInt>;
    /**
     * Retrieves the storage value at the specified storage position for a given address.
     *
     * @param {Address} address - The address of the account whose storage value is to be retrieved.
     * @param {ThorId} position - The position in the storage from where the value is to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters including revision for specifying the block number or ID to query against.
     * @return {Promise<HexUInt>} - A promise that resolves to the storage value as a string.
     */
    getStorageAt(address: Address, position: BlockId, options?: AccountInputOptions): Promise<HexUInt>;
}
export { AccountsModule };
//# sourceMappingURL=AccountsModule.d.ts.map