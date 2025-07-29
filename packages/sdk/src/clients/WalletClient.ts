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

    protected constructor(network: ThorNetworks, account: Address) {
        super(network, FetchHttpClient.at(new URL(network))); // viem specific
        this.account = account; // viem specific
    }

    public async sendTransaction(encodedTx: Uint8Array): Promise<TXID> {
        // viem specific
        const data = await SendTransaction.of(encodedTx).askTo(
            FetchHttpClient.at(new URL(this.network))
        );
        return data.response;
    }
}

export { WalletClient };
