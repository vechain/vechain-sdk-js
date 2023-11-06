import { type IHttpClient } from '../http';
import { type Account } from '../../types/account';
import { type Block } from '../../types/block';
import { type Status } from '../../types/status';

class ThorReadonlyClient {
    public head: Status['head'];

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

    public async getAccount(addr: string, revision?: string): Promise<Account> {
        return (await this.httpClient.http('GET', `/accounts/${addr}`, {
            revision
        })) as Account;
    }
}

export { ThorReadonlyClient };
