import {
    Address,
    FetchHttpClient,
    SendTransaction,
    ThorNetworks
} from '@index';
import { PublicClient } from './PublicClient';

class WalletClient extends PublicClient {
    readonly account: Address;

    protected constructor(httpClient: ThorNetworks, account: Address) {
        super(httpClient); // viem specific
        this.account = account; // viem specific
    }

    public async sendTransaction(encodedTx: Uint8Array) {
        // viem specific
        return await SendTransaction.of(encodedTx).askTo(
            FetchHttpClient.at(this.httpClient)
        );
    }
}

export { WalletClient };
