import { type IHttpClient } from '../http';
import {
    type AccountCode,
    type Account,
    type Block,
    type Status,
    type AccountStorage
} from './types';

/**
 * Represents a client with read-only capabilities to interact with a VeChain Thor blockchain.
 *
 * This class provides methods for retrieving account information and maintains the status of the blockchain head.
 *
 * @public
 */
class ThorReadonlyClient {
    /**
     * The current status of the blockchain head.
     */
    public head: Status['head'];

    /**
     * Creates a new instance of ThorReadonlyClient for read-only interactions with a blockchain.
     *
     * @param httpClient - The HTTP client used to interact with the blockchain.
     * @param genesis - The information about the blockchain's genesis block.
     * @param initialHead - (Optional) The initial status of the blockchain head.
     */
    constructor(
        protected readonly httpClient: IHttpClient,
        readonly genesis: Block,
        initialHead?: Status['head']
    ) {
        if (initialHead != null) {
            this.head = initialHead;
        } else {
            this.head = {
                id: genesis.id,
                number: genesis.number,
                timestamp: genesis.timestamp,
                parentID: genesis.parentID,
                txsFeatures: genesis.txsFeatures,
                gasLimit: genesis.gasLimit
            };
        }
    }

    /**
     * Retrieves account information from the blockchain for a given address.
     *
     * @param addr - The address of the account to retrieve.
     * @param revision - (Optional) The revision of the account state to retrieve.
     * @returns A promise that resolves to the account information.
     */
    public async getAccount(addr: string, revision?: string): Promise<Account> {
        return (await this.httpClient.http('GET', `/accounts/${addr}`, {
            revision
        })) as Account;
    }

    /**
     * Retrieves the code associated with a blockchain account.
     *
     * @param addr - The address of the account to retrieve the code for.
     * @param revision - (Optional) The revision of the account state to retrieve.
     * @returns A promise that resolves to the account code information.
     */
    public async getCode(
        addr: string,
        revision?: string
    ): Promise<AccountCode> {
        // Send an HTTP GET request to fetch the code associated with the provided account address and optional revision.
        // The result is a promise that resolves to the account code information.
        return (await this.httpClient.http('GET', `accounts/${addr}/code`, {
            revision
        })) as AccountCode;
    }

    /**
     * Retrieves storage value associated with a blockchain account and a specific storage key.
     *
     * @param addr - The address of the account to retrieve the storage value for.
     * @param key - The storage key associated with the account.
     * @param revision - (Optional) The revision of the account state to retrieve.
     * @returns A promise that resolves to the account storage value information.
     */
    public async getStorage(
        addr: string,
        key: string,
        revision?: string
    ): Promise<AccountStorage> {
        // Send an HTTP GET request to fetch the storage value associated with the provided account address, storage key, and optional revision.
        // The result is a promise that resolves to the account storage value information.
        return (await this.httpClient.http(
            'GET',
            `accounts/${addr}/storage/${key}`,
            { revision }
        )) as AccountStorage;
    }
}

export { ThorReadonlyClient };
