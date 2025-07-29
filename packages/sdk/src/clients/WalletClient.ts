import * as nc_utils from '@noble/curves/abstract/utils';
import { type Account } from 'viem';
import {
    SendTransaction,
    Transaction,
    type TransactionBody,
    type TransactionClause
} from '@thor';
import {
    Address,
    Blake2b256,
    Hex,
    HexInt,
    HexUInt,
    HexUInt32,
    RLPProfiler
} from '@vcdm';
import { UnsupportedOperationError } from '@errors';
import { FetchHttpClient, type HttpClient } from '@http';
import { PublicClient } from '@clients/PublicClient';

const FQP = 'packages/sdk/src/clients/WalletClient.ts!';

/**
 * Used internally to tag a transaction without data.
 */
const NO_DATA = Hex.PREFIX;

function createWalletClient(parameters: WalletClientConfig): WalletClient {
    return new WalletClient(
        parameters.baseUrl,
        parameters.account ?? null,
        parameters.transport ??
            ((url: URL): HttpClient => {
                return FetchHttpClient.at(url);
            })
    );
}

class WalletClient extends PublicClient {
    private readonly account: Account | null;

    constructor(
        baseUrl: URL,
        account: Account | null,
        httpClientFactory: (url: URL) => HttpClient
    ) {
        super(baseUrl, httpClientFactory);
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
        request: PrepareTransactionRequestRequest
    ): Transaction {
        try {
            const txClause: TransactionClause = {
                to: request.to !== undefined ? request.to.toString() : null,
                value:
                    request.value instanceof Hex
                        ? HexUInt.of(HexInt.of(request.value)).bi
                        : BigInt(request.value),
                data:
                    request.data instanceof Hex
                        ? HexUInt.of(request.data).toString()
                        : NO_DATA,
                comment: request.comment,
                abi:
                    request.abi instanceof Hex
                        ? HexUInt.of(HexInt.of(request.abi)).toString()
                        : undefined
            } satisfies TransactionClause;
            const txBody: TransactionBody = {
                chainTag: request.chainTag,
                blockRef: HexInt.of(request.blockRef).toString(),
                expiration: request.expiration,
                clauses: [txClause],
                gasPriceCoef: request.gasPriceCoef,
                gas:
                    request.gas instanceof Hex
                        ? HexUInt.of(HexInt.of(request.gas)).toString()
                        : request.gas,
                dependsOn:
                    request.dependsOn instanceof Hex
                        ? HexUInt32.of(HexInt.of(request.dependsOn)).toString()
                        : null,
                nonce: request.nonce
            } satisfies TransactionBody;
            return Transaction.of(txBody);
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
        return (
            await SendTransaction.of(raw.bytes).askTo(
                this.httpClientFactory(this.baseUrl)
            )
        ).response.id;
    }

    public async sendTransaction(
        request: PrepareTransactionRequestRequest
    ): Promise<Hex> {
        const tx = this.prepareTransactionRequest(request);
        const raw = await this.signTransaction(tx);
        return await this.sendRawTransaction(raw);
    }

    public async signTransaction(tx: Transaction): Promise<Hex> {
        if (this.account !== null) {
            const encodedTx = RLPProfiler.ofObject(
                {
                    // Existing body and the optional `reserved` field if present.
                    ...tx.body,
                    /*
                     * The `body.clauses` property is already an array,
                     * albeit TypeScript realize; hence cast is needed
                     * otherwise encodeObject will throw an error.
                     */
                    clauses: tx.body.clauses as Array<{
                        to: string | null;
                        value: bigint | number;
                        data: string;
                    }>,
                    // New reserved field.
                    reserved: tx.encodeReservedField()
                },
                Transaction.RLP_UNSIGNED_TRANSACTION_PROFILE
            ).encoded;
            const txHash = Blake2b256.of(encodedTx).bytes;
            const signature = await WalletClient.signHash(txHash, this.account);
            return HexUInt.of(Transaction.of(tx.body, signature).encode(true));
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

interface WalletClientConfig {
    baseUrl: URL;
    account?: Account;
    transport?: (url: URL) => HttpClient;
}

export {
    createWalletClient,
    WalletClient,
    type PrepareTransactionRequestRequest,
    type WalletClientConfig
};
