import {
    type Address,
    FetchHttpClient,
    SendTransaction,
    type ThorNetworks,
    type TXID
} from '@index';
import { PublicClient } from './PublicClient';

class WalletClient extends PublicClient {
    readonly account: Address;

    protected constructor(httpClient: ThorNetworks, account: Address) {
        super(httpClient); // viem specific
        this.account = account; // viem specific
    }

    public async sendTransaction(encodedTx: Uint8Array): Promise<TXID> {
        // viem specific
        const data = await SendTransaction.of(encodedTx).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        return data.response;
    }
}

export { WalletClient };
