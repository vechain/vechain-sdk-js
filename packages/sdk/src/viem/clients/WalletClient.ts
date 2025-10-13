import * as nc_utils from '@noble/curves/utils';
import { concatBytes } from '@noble/curves/utils';
import { type Account } from 'viem';
import { SendTransaction, type ThorNetworks } from '@thor/thorest';
import { Clause, TransactionRequest } from '@thor/thor-client/model/transactions';
import { Address, Blake2b256, Hex, HexInt, HexUInt } from '@common/vcdm';
import { FetchHttpClient, type HttpClient } from '@common/http';
import { UnsupportedOperationError } from '@common/errors';
import { PublicClient, type PublicClientConfig } from './PublicClient';
import { TransactionRequestRLPCodec } from '@thor';

/**
 * Fill-Qualified Path
 */
const FQP = 'packages/sdk/src/viem/clients/WalletClient.ts!';

/**
 * Creates a new instance of the WalletClient configured with the provided parameters.
 *
 * @param {Object} config - Configuration object for the WalletClient.
 * @param {string} config.network - The network endpoint or base URL for the wallet client.
 * @param {Object} [config.transport] - Optional transport layer instance for handling network requests.
 * @param {Object|null} [config.account] - Optional account object associated with the wallet client.
 * @return {WalletClient} A new instance of WalletClient configured with the specified network, transport, and account.
 *
 * @see https://viem.sh/docs/clients/wallet#wallet-client
 */
function createWalletClient({
    network,
    transport,
    account
}: WalletClientConfig): WalletClient {
    const transportLayer = transport ?? new FetchHttpClient(new URL(network));
    return new WalletClient(network, transportLayer, account ?? null);
}

/**
 * Represents a client for managing wallet operations, extending the capabilities
 * of a `PublicClient` to enable account-specific functionalities like signing
 * and sending transactions.
 *
 * @see https://viem.sh/docs/clients/wallet#wallet-client
 */
class WalletClient extends PublicClient {
    /**
     * Represents a user's account information or null if the account does not exist or is unavailable.
     */
    private readonly account: Account | null;

    /**
     * Constructs an instance of the class.
     *
     * @param {URL | ThorNetworks} network - The network to be used, either a URL or a ThorNetworks instance.
     * @param {HttpClient} transport - The HTTP client to handle network communications.
     * @param {Account | null} account - The account to associate with the instance, or null if no account is provided.
     */
    constructor(
        network: URL | ThorNetworks,
        transport: HttpClient,
        account: Account | null
    ) {
        super(network, transport);
        this.account = account;
    }

    private static finalize(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (transactionRequest.isIntendedToBeSponsored) {
            // Intended to be sponsored.
            if (
                transactionRequest.originSignature.length > 0 &&
                transactionRequest.gasPayerSignature.length > 0
            ) {
                // Both origin and gas payer signed.
                return new TransactionRequest(
                    { ...transactionRequest },
                    transactionRequest.originSignature,
                    transactionRequest.gasPayerSignature,
                    concatBytes(
                        transactionRequest.originSignature,
                        transactionRequest.gasPayerSignature
                    )
                );
            }
            // Not both origin and gas payer signed.
            return transactionRequest;
        }
        // Not intended to be sponsored.
        if (transactionRequest.originSignature.length > 0) {
            // Origin signed.
            return new TransactionRequest(
                { ...transactionRequest },
                transactionRequest.originSignature,
                transactionRequest.gasPayerSignature,
                transactionRequest.originSignature
            );
        }
        // Not intended to be sponsored, no origin signature.
        return transactionRequest;
    }

    /**
     * Returns a list of account addresses owned by the wallet or client.
     *
     * @see https://viem.sh/docs/actions/wallet/getAddresses
     */
    public getAddresses(): Address[] {
        return this.account != null ? [Address.of(this.account.address)] : [];
    }

    /**
     * Prepares a transaction request by constructing and returning a `TransactionRequest` object.
     *
     * @param {PrepareTransactionRequestRequest} request - The request object containing details necessary to prepare the transaction.
     * @return {TransactionRequest} The prepared transaction request object with all required properties set, ready for execution.
     * @throws {UnsupportedOperationError} Throws an error if the provided request object is invalid.
     *
     * @see https://viem.sh/docs/actions/wallet/prepareTransactionRequest
     */
    public prepareTransactionRequest(
        request: PrepareTransactionRequestRequest
    ): TransactionRequest {
        try {
            const clause = new Clause(
                request.to ?? null,
                request.value instanceof Hex
                    ? HexUInt.of(HexInt.of(request.value)).bi
                    : BigInt(request.value),
                request.data instanceof Hex ? HexUInt.of(request.data) : null,
                request.comment ?? null,
                request.abi instanceof Hex
                    ? HexUInt.of(HexInt.of(request.abi)).toString()
                    : null
            );
            return new TransactionRequest({
                blockRef: request.blockRef,
                chainTag: request.chainTag,
                clauses: [clause],
                dependsOn: request.dependsOn ?? null,
                expiration: request.expiration,
                gas: HexUInt.of(request.gas).bi,
                gasPriceCoef: BigInt(request.gasPriceCoef),
                nonce: request.nonce
                // isIntendedToBeSponsored:
                //     request.isIntendedToBeSponsored ?? false
            });
        } catch (e) {
            throw new UnsupportedOperationError(
                `${FQP}WalletClient.prepareTransactionRequest(request: PrepareTransactionRequestRequest): TransactionRequest`,
                'invalid request',
                {
                    request
                }
            );
        }
    }

    /**
     * Signs the provided hash using the given account's signing method.
     *
     * This method adapts the [Viem](https://viem.sh/docs/actions/wallet/signTransaction)
     * Ethereum signing algorithm to the Thor signing algorithm.
     *
     * @param {Uint8Array} hash The hash to be signed.
     * @param {Account} account The account object used for signing the hash.
     * @return {Promise<Uint8Array>} A promise that resolves to the signed hash as a Uint8Array.
     * @throws {UnsupportedOperationError}
     *
     * @remarks Security auditable method, depends on
     * - {@link Account.sign}
     */
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

    /**
     * Sends a raw transaction to the network through the provided HTTP client.
     *
     * @param {Hex} raw - The raw hexadecimal representation of the transaction to be sent.
     * @return {Promise<Hex>} A promise that resolves with the transaction ID in hexadecimal format.
     * @throws ThorError if the response is invalid or the request fails.
     *
     * @see https://viem.sh/docs/actions/wallet/sendRawTransaction
     */
    public async sendRawTransaction(raw: Hex): Promise<Hex> {
        return (await SendTransaction.of(raw.bytes).askTo(this.httpClient))
            .response.id;
    }

    /**
     * Sends a transaction request to the blockchain network.
     * The transaction request can either be
     * - a prepared transaction request to be signed and sent,
     * - a signed transaction request to be sponsored and sent.
     *
     * @param {PrepareTransactionRequestRequest | TransactionRequest} request - The transaction request object.
     * This can either be a prepared transaction request to be signed or a signed transaction request to be sponsored.
     * @return {Promise<Hex>} A promise that resolves to the transaction hash (Hex) of the sent transaction.
     * @throws {ThorError} If the transaction fails to send or the response is invalid.
     * @throws {UnsupportedOperationError} If the account is not set.
     *
     * @see https://viem.sh/docs/actions/wallet/sendTransaction
     * @see signTransaction
     * @see sendRawTransaction
     */
    public async sendTransaction(
        request: PrepareTransactionRequestRequest | TransactionRequest
    ): Promise<Hex> {
        const transactionRequest =
            request instanceof TransactionRequest
                ? request
                : this.prepareTransactionRequest(request);
        const raw = await this.signTransaction(transactionRequest);
        return await this.sendRawTransaction(raw);
    }

    public async signTransaction(
        transactionRequest: TransactionRequest
    ): Promise<Hex> {
        if (this.account !== null) {
            if (transactionRequest.beggar !== undefined) {
                if (
                    transactionRequest.beggar.isEqual(
                        Address.of(this.account.address)
                    )
                ) {
                    return HexUInt.of(
                        TransactionRequestRLPCodec.encode(
                            WalletClient.finalize(
                                await WalletClient.signAsOrigin(
                                    transactionRequest,
                                    this.account
                                )
                            )
                        )
                    );
                }
                return HexUInt.of(
                    TransactionRequestRLPCodec.encode(
                        WalletClient.finalize(
                            await WalletClient.signAsGasPayer(
                                transactionRequest,
                                this.account
                            )
                        )
                    )
                );
            }
            return HexUInt.of(
                TransactionRequestRLPCodec.encode(
                    WalletClient.finalize(
                        await WalletClient.signAsOrigin(
                            transactionRequest,
                            this.account
                        )
                    )
                )
            );
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.signTransaction(transactionRequest: TransactionRequest): Hex`,
            'account is not set'
        );
    }

    private static async signAsGasPayer(
        transactionRequest: TransactionRequest,
        account: Account
    ): Promise<TransactionRequest> {
        const originHash = Blake2b256.of(
            TransactionRequestRLPCodec.encode(transactionRequest, true)
        ).bytes;
        const gasPayerHash = Blake2b256.of(
            concatBytes(
                originHash,
                transactionRequest.beggar?.bytes ?? new Uint8Array()
            )
        ).bytes;
        const gasPayerSignature = await WalletClient.signHash(
            gasPayerHash,
            account
        );
        return new TransactionRequest(
            { ...transactionRequest },
            transactionRequest.originSignature,
            gasPayerSignature,
            transactionRequest.signature
        );
    }

    private static async signAsOrigin(
        transactionRequest: TransactionRequest,
        account: Account
    ): Promise<TransactionRequest> {
        const originHash = Blake2b256.of(
            TransactionRequestRLPCodec.encode(transactionRequest)
        ).bytes;
        const originSignature = await WalletClient.signHash(
            originHash,
            account
        );
        return new TransactionRequest(
            { ...transactionRequest },
            originSignature,
            transactionRequest.gasPayerSignature,
            transactionRequest.signature
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
    isIntendedToBeSponsored?: boolean;
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
