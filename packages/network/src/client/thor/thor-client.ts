import { type HttpClient } from '../http';
import { AccountClient, type AccountDetail } from './accounts';
import { type IThorClient } from './types';

/**
 * The `ThorClient` class serves as an interface to interact with the VeChain Thor blockchain.
 * It provides methods for accessing account details, contract bytecode, and storage.
 */
class ThorClient implements IThorClient {
    /**
     * An instance of `AccountClient` to delegate account-related requests.
     */
    private readonly accountClient: AccountClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.accountClient = new AccountClient(httpClient);
    }

    /* --------------------------- Account (Externally Owned Accounts & Smart Contracts) --------------------------- */

    /**
     * Retrieves details for an account such as balance and nonce.
     * This can be used for both externally owned accounts (EOAs) and smart contracts.
     *
     * @param address - The address of the account to query.
     * @param revision - (Optional) A specific block number or ID to reference the state.
     * @returns A promise resolved with the account details.
     */
    public async getAccount(
        address: string,
        revision?: string | undefined
    ): Promise<AccountDetail> {
        return await this.accountClient.getAccount(address, revision);
    }

    /**
     * Fetches the bytecode of a smart contract at a specified address.
     *
     * @param address - The contract address to get the bytecode for.
     * @param revision - (Optional) A specific block number or ID to reference the bytecode version.
     * @returns A promise resolved with the contract bytecode as a string.
     */
    public async getBytecode(
        address: string,
        revision?: string | undefined
    ): Promise<string> {
        return await this.accountClient.getBytecode(address, revision);
    }

    /**
     * Retrieves the storage value from a specified position in a smart contract.
     *
     * @param address - The address of the contract to query storage from.
     * @param position - The hex-encoded storage position to retrieve the value from.
     * @param revision - (Optional) A specific block number or ID to reference the storage state.
     * @returns A promise resolved with the storage value at the specified position.
     */
    public async getStorageAt(
        address: string,
        position: string,
        revision?: string | undefined
    ): Promise<string> {
        return await this.accountClient.getStorageAt(
            address,
            position,
            revision
        );
    }
}

export { ThorClient };
