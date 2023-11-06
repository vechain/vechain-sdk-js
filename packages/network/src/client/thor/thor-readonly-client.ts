import { type IHttpClient } from '../http';
import { type Account } from '../../types/account';
import { type Block } from '../../types/block';
import { type Status } from '../../types/status';

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
}

export { ThorReadonlyClient };
