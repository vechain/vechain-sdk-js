import { type Address, FetchHttpClient, type HttpClient } from '@common';
import { SendTransaction, type ThorNetworks, type TXID } from '@thor/thorest';
import { PublicClient } from './PublicClient';

interface WalletClientConfig {
    network: URL | ThorNetworks;
    transport?: HttpClient;
    account: Address;
}

function createWalletClient({
    network,
    transport,
    account
}: WalletClientConfig): WalletClient {
    const transportLayer = transport ?? new FetchHttpClient(new URL(network));
    return new WalletClient(network, transportLayer, account);
}

class WalletClient extends PublicClient {
    readonly account: Address;

    constructor(
        network: URL | ThorNetworks,
        transport: HttpClient,
        account: Address
    ) {
        super(network, transport);
        this.account = account;
    }

    public async sendTransaction(encodedTx: Uint8Array): Promise<TXID> {
        const data = await SendTransaction.of(encodedTx).askTo(this.httpClient);
        return data.response;
    }
}

export { WalletClient, createWalletClient };
