"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModule = void 0;
const AccountDetail_1 = require("./AccountDetail");
const utils_1 = require("../../utils");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * of the VeChain Thor blockchain.
 * It allows to retrieve details, bytecode, and storage data for a specific blockchain account.
 */
class AccountsModule {
    httpClient;
    /**
     * Creates an instance of the class with a specified HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client instance to be used for making requests.
     */
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    /**
     * Retrieves the details of an account given the account address and optional parameters.
     *
     * @param {Address} address - The address of the account to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters to modify the account retrieval.
     * @return {Promise<AccountDetail>} Returns a promise that resolves to the account details.
     */
    async getAccount(address, options) {
        const revision = options?.revision?.toString();
        return new AccountDetail_1.AccountDetail((await this.httpClient.get(utils_1.thorest.accounts.get.ACCOUNT_DETAIL(address.toString()), {
            query: (0, utils_1.buildQuery)({ revision })
        })));
    }
    /**
     * Retrieves the bytecode of the smart contract deployed at the specified address.
     *
     * @param {Address} address - The address of the smart contract.
     * @param {AccountInputOptions} [options] - Optional settings for the request, including the block revision.
     * @return {Promise<HexUInt>} A promise that resolves to the bytecode of the smart contract.
     */
    async getBytecode(address, options) {
        const revision = options?.revision?.toString();
        const result = (await this.httpClient.get(utils_1.thorest.accounts.get.ACCOUNT_BYTECODE(address.toString()), {
            query: (0, utils_1.buildQuery)({ revision })
        }));
        return sdk_core_1.HexUInt.of(result.code);
    }
    /**
     * Retrieves the storage value at the specified storage position for a given address.
     *
     * @param {Address} address - The address of the account whose storage value is to be retrieved.
     * @param {ThorId} position - The position in the storage from where the value is to be retrieved.
     * @param {AccountInputOptions} [options] - Optional parameters including revision for specifying the block number or ID to query against.
     * @return {Promise<HexUInt>} - A promise that resolves to the storage value as a string.
     */
    async getStorageAt(address, position, options) {
        const pos = position.toString();
        const revision = options?.revision?.toString();
        const result = (await this.httpClient.get(utils_1.thorest.accounts.get.STORAGE_AT(address.toString(), pos), {
            query: (0, utils_1.buildQuery)({ pos, revision })
        }));
        return sdk_core_1.HexUInt.of(result.value);
    }
}
exports.AccountsModule = AccountsModule;
