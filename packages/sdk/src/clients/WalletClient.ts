import * as nc_utils from '@noble/curves/abstract/utils';
import { type Account } from 'viem';
import {
    Clause,
    RLPCodec,
    SendTransaction,
    SignedTransactionRequest,
    type ThorNetworks,
    TransactionRequest
} from '@thor';
import { Address, Blake2b256, BlockRef, Hex, HexUInt } from '@vcdm';
import { UnsupportedOperationError } from '@errors';
import { FetchHttpClient, type HttpClient } from '@http';
import { PublicClient, type PublicClientConfig } from './PublicClient';

const FQP = 'packages/sdk/src/clients/WalletClient.ts!';


function createWalletClient({
    network,
    transport,
    account
}: WalletClientConfig): WalletClient {
    const transportLayer = transport ?? new FetchHttpClient(new URL(network));
    return new WalletClient(network, transportLayer, account ?? null);
}

class WalletClient extends PublicClient {
    private readonly account: Account | null;

    constructor(
        network: URL | ThorNetworks,
        transport: HttpClient,
        account: Account | null
    ) {
        super(network, transport);
        this.account = account;
    }

    /**
     * Returns a list of account addresses owned by the wallet or client.
     *
     * @see https://viem.sh/docs/actions/wallet/getAddresses
     */
    public getAddresses(): Address[] {
        return this.account != null ? [Address.of(this.account.address)] : [];
    }

    public prepareTransactionRequest(
        request: PrepareTransactionRequestRequest,
        isSponsored: boolean = false
    ): TransactionRequest {
        try {
            const clause = new Clause(
                request.to ?? null,
                request.value instanceof Hex
                    ? HexUInt.of(request.value).bi
                    : BigInt(request.value),
                request.data instanceof Hex ? HexUInt.of(request.data) : null,
                request.comment ?? null,
                request.abi instanceof Hex
                    ? HexUInt.of(request.abi).toString()
                    : null
            );
            return new TransactionRequest({
                blockRef: BlockRef.of(request.blockRef),
                chainTag: request.chainTag,
                clauses: [clause],
                dependsOn: request.dependsOn ?? null,
                expiration: request.expiration,
                gas:
                    request.gas instanceof Hex
                        ? HexUInt.of(request.gas).bi
                        : BigInt(request.gas),
                gasPriceCoef: BigInt(request.gasPriceCoef),
                nonce: request.nonce,
                isSponsored
            });
        } catch (e) {
            throw new UnsupportedOperationError(
                `${FQP}WalletClient.prepareTransactionRequest(request: PrepareTransactionRequestRequest): void`,
                'invalid request',
                {
                    request
                }
            );
        }
    }

    private static async signHash(
        hash: Uint8Array,
        account: Account
    ): Promise<Uint8Array> {
        if (account.sign !== undefined) {
            const viemSignature = HexUInt.of(
                await account.sign({
                    hash: `0x${HexUInt.of(hash).digits}`
                })
            ).bytes;
            const r = nc_utils.bytesToNumberBE(viemSignature.slice(0, 32));
            const s = nc_utils.bytesToNumberBE(viemSignature.slice(32, 64));
            const v =
                nc_utils.bytesToNumberBE(viemSignature.slice(64, 65)) - 27n;
            return nc_utils.concatBytes(
                nc_utils.numberToBytesBE(r, 32),
                nc_utils.numberToBytesBE(s, 32),
                nc_utils.numberToVarBytesBE(v)
            );
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.sign(hash: Hex, signer: Account): Uint8Array`,
            'account cannot sign',
            {
                account: `${account.address}`
            }
        );
    }

    public async sendRawTransaction(raw: Hex): Promise<Hex> {
        return (await SendTransaction.of(raw.bytes).askTo(this.httpClient))
            .response.id;
    }

    public async sendTransaction(
        request: PrepareTransactionRequestRequest
    ): Promise<Hex> {
        const tx = this.prepareTransactionRequest(request);
        const raw = await this.signTransaction(tx);
        return await this.sendRawTransaction(raw);
    }

    public async signTransaction(
        transactionRequest: TransactionRequest
    ): Promise<Hex> {
        if (this.account !== null) {
            const hash = Blake2b256.of(
                RLPCodec.encodeTransactionRequest(transactionRequest)
            ).bytes;
            this.getAddresses();
            const signature = await WalletClient.signHash(hash, this.account);
            const signedTransaction = new SignedTransactionRequest({
                ...transactionRequest,
                origin: Address.of(this.account.address),
                originSignature: signature,
                signature
            });
            return HexUInt.of(
                RLPCodec.encodeSignedTransactionRequest(signedTransaction)
            );
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.signTransaction(encodedTx: Hex): Hex`,
            'account is not set'
        );
    }
}

interface PrepareTransactionRequestRequest {
    // Clause
    to?: Address;
    value: Hex | number;
    data?: Hex;
    comment?: string;
    abi?: Hex;
    // Transaction body
    blockRef: Hex;
    chainTag: number;
    dependsOn?: Hex;
    expiration: number;
    gas: Hex | number;
    gasPriceCoef: number;
    nonce: number;
}

interface WalletClientConfig extends PublicClientConfig {
    account?: Account;
}

export {
    createWalletClient,
    WalletClient,
    type PrepareTransactionRequestRequest,
    type WalletClientConfig
};
