import { SendTransaction, type ThorNetworks, TXID } from '@thor';
import { FetchHttpClient } from '@http';
import { type Address, Hex } from '@vcdm';
import { type TransactionSerializedGeneric } from 'viem';

function createWalletClient(
    parameters: WalletClientConfig
    // an http client factory here could allow mocking transport for tests
): WalletClient {
    return new WalletClient(parameters.chain, parameters.account ?? null);
}

class WalletClient {
    readonly account: Address | null; // Explicit null preferred than undefined. Possibly this

    readonly chain: ThorNetworks;

    constructor(chain: ThorNetworks, address: Address | null) {
        this.account = address;
        this.chain = chain;
    }

    async sendRawTransaction(
        rawTransaction: TransactionSerializedGeneric,
        onRequest: (request: Request) => Request = (request) => request, // VeChain SDK specific
        onResponse: (response: Response) => Response = (response) => response // VeChain SDK specific
    ): Promise<Hex> {
        const encoded = Hex.of(rawTransaction.toString()).bytes;
        return (
            await SendTransaction.of(encoded).askTo(
                FetchHttpClient.at(this.chain, onRequest, onResponse)
            )
        ).response.id;
    }
}

interface WalletClientConfig {
    account?: Address;
    chain: ThorNetworks;
}

export { createWalletClient, WalletClient, type WalletClientConfig, TXID };
