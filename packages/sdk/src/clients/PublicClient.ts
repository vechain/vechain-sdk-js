import { type Address, type HttpClient, type ThorNetworks } from '@index';

import { createThorClient, ThorClient } from './ThorClient';

interface PublicClientConfig {
    network: URL | ThorNetworks;
    transport?: HttpClient;
}

function createPublicClient({
    network,
    transport
}: PublicClientConfig): PublicClient {
    const thorClient = createThorClient({ network, transport });
    return new PublicClient(thorClient);
}

class PublicClient {
    protected readonly thorClient: ThorClient;

    constructor(thorClient: ThorClient) {
        this.thorClient = thorClient;
    }

    public async getBalance(address: Address): Promise<bigint> {
        const accountDetails =
            await this.thorClient.accounts.getAccount(address);
        return accountDetails.balance;
    }
}

export { PublicClient, type PublicClientConfig, createPublicClient };
