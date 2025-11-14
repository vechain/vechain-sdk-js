import * as nc_utils from '@noble/curves/utils';
import { concatBytes } from '@noble/curves/utils';
import { type Account } from 'viem';
import type { ThorNetworks } from '@thor/utils/const';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { Address, Blake2b256, Hex, HexInt, HexUInt } from '@common/vcdm';
import { FetchHttpClient, type HttpClient } from '@common/http';
import { UnsupportedOperationError } from '@common/errors';
import { PublicClient, type PublicClientConfig } from './PublicClient';

/**
 * Fill-Qualified Path
 */
const FQP = 'packages/sdk/src/viem/clients/WalletClient.ts!';

/**
 * Creates a viem-compatible WalletClient for VeChain.
 *
 * Extends PublicClient with account-specific operations for signing and sending transactions.
 *
 * @param {WalletClientConfig} config - Configuration object.
 * @param {URL | ThorNetworks} config.network - Network URL or ThorNetworks enum.
 * @param {HttpClient} config.transport - Custom HTTP transport (optional, defaults to FetchHttpClient).
 * @param {Account} config.account - Account for signing transactions (optional).
 * @returns {WalletClient} A configured WalletClient instance.
 *
 * @see {@link https://viem.sh/docs/clients/wallet | Viem WalletClient}
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

    /**
     * Finalizes the transaction request based on its sponsorship intent and signature availability.
     *
     * - If the `transactionRequest` is intended to be sponsored and has both origin and gas payer signatures,
     *   a new `TransactionRequest` is created, combining these signatures;
     *   if only one or neither signature is present, the original `transactionRequest` is returned unmodified.
     *
     * - If the `transactionRequest` is not intended to be sponsored,
     *   if the origin signature is present, a new `TransactionRequest` is created based on the origin signature;
     *   otherwise, the original request is returned as-is.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be finalized, which includes
     * details of the transaction, its signatures (if available), and its sponsorship intent.
     * @return {TransactionRequest} The finalized `TransactionRequest` object, updated based on the sponsorship
     * intent and available signatures.
     *
     * @remarks Security auditable method, depends on
     * - `concatBytes` from [noble-curves](https://github.com/paulmillr/noble-curves).
     */
    private static finalize(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        if (transactionRequest.isIntendedToBeSponsored) {
            // Intended to be sponsored.
            if (WalletClient.hasRequiredSignatures(transactionRequest)) {
                // Both origin and gas payer signed.
                return new TransactionRequest(
                    transactionRequest,
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
        if (WalletClient.hasRequiredSignatures(transactionRequest)) {
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
     * Gets the account addresses associated with this wallet.
     *
     * @returns {Address[]} Array containing the wallet's address, or empty array if no account.
     * @see {@link https://viem.sh/docs/actions/wallet/getAddresses | Viem getAddresses}
     */
    public getAddresses(): Address[] {
        return this.account != null ? [Address.of(this.account.address)] : [];
    }

    /**
     * Checks if the required signatures are present for the transaction type.
     *
     * @param transactionRequest - The transaction request to check
     * @returns true if all required signatures are present, false otherwise
     */
    private static hasRequiredSignatures(
        transactionRequest: TransactionRequest
    ): boolean {
        if (transactionRequest.isIntendedToBeSponsored) {
            return (
                transactionRequest.originSignature.length > 0 &&
                transactionRequest.gasPayerSignature.length > 0
            );
        }
        return transactionRequest.originSignature.length > 0;
    }

    /**
     * Prepares a transaction request for signing.
     *
     * @param {PrepareTransactionRequestRequest} request - Transaction parameters.
     * @returns {TransactionRequest} The prepared transaction request.
     * @throws {UnsupportedOperationError} If the request parameters are invalid.
     * @see {@link https://viem.sh/docs/actions/wallet/prepareTransactionRequest | Viem prepareTransactionRequest}
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
                beggar: request.beggar,
                blockRef: request.blockRef,
                chainTag: request.chainTag,
                clauses: [clause],
                dependsOn: request.dependsOn ?? null,
                expiration: request.expiration,
                gas: HexUInt.of(request.gas).bi,
                gasPriceCoef: BigInt(request.gasPriceCoef),
                maxFeePerGas: request.maxFeePerGas,
                maxPriorityFeePerGas: request.maxPriorityFeePerGas,
                nonce: request.nonce
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
     * Sends a raw signed transaction to the network.
     *
     * @param {Hex} raw - The RLP-encoded signed transaction.
     * @returns {Promise<Hex>} The transaction hash.
     * @see {@link https://viem.sh/docs/actions/wallet/sendRawTransaction | Viem sendRawTransaction}
     */
    public async sendRawTransaction(raw: Hex): Promise<Hex> {
        const txId = await this.thorClient.transactions.sendRawTransaction(raw);
        return txId;
    }

    /**
     * Signs and sends a transaction to the network.
     *
     * Handles both unsigned transactions (which will be signed) and signed transactions (for sponsorship).
     *
     * @param {PrepareTransactionRequestRequest | TransactionRequest} request - Transaction to sign and send.
     * @returns {Promise<Hex>} The transaction hash.
     * @throws {UnsupportedOperationError} If no account is configured.
     * @see {@link https://viem.sh/docs/actions/wallet/sendTransaction | Viem sendTransaction}
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

    /**
     * Signs a transaction request.
     *
     * For sponsored transactions, signs as origin (sender) or gas payer based on the beggar address.
     * For regular transactions, signs as the origin.
     *
     * @param {TransactionRequest} transactionRequest - The transaction to sign.
     * @returns {Promise<Hex>} The RLP-encoded signed transaction.
     * @throws {UnsupportedOperationError} If no account is configured.
     */
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
                        WalletClient.finalize(
                            await WalletClient.signAsOrigin(
                                transactionRequest,
                                this.account
                            )
                        ).encoded
                    );
                }
                return HexUInt.of(
                    WalletClient.finalize(
                        await WalletClient.signAsGasPayer(
                            transactionRequest,
                            this.account
                        )
                    ).encoded
                );
            }
            return HexUInt.of(
                WalletClient.finalize(
                    await WalletClient.signAsOrigin(
                        transactionRequest,
                        this.account
                    )
                ).encoded
            );
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.signTransaction(transactionRequest: TransactionRequest): Hex`,
            'account is not set'
        );
    }

    /**
     * Signs the given transaction request as a gas payer.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to sign,
     * which includes all necessary transaction details.
     * @param {Account} account - The account object used for signing the transaction.
     * @return {TransactionRequest} The signed transaction request with updated gas payer signature.
     * @throws {InvalidPrivateKeyError} Throws an error if the private key is not available.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of};
     * - `concatBytes` from [noble-curves](https://github.com/paulmillr/noble-curves);
     * - {@link Secp256k1.sign}.
     */
    private static async signAsGasPayer(
        transactionRequest: TransactionRequest,
        account: Account
    ): Promise<TransactionRequest> {
        const gasPayerHash = Blake2b256.of(
            concatBytes(
                transactionRequest.hash.bytes, // Origin hash.
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

    /**
     * Signs the given transaction request as the origin using the private key.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be signed.
     * @param {Account} account - The account object used for signing the transaction.
     * @return {TransactionRequest} A new instance of TransactionRequest with the origin signature included.
     * @throws {InvalidPrivateKeyError} If no private key is available for signing.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of};
     * - `concatBytes` from [noble-curves](https://github.com/paulmillr/noble-curves);
     * - {@link Secp256k1.sign}.
     */
    private static async signAsOrigin(
        transactionRequest: TransactionRequest,
        account: Account
    ): Promise<TransactionRequest> {
        const originSignature = await WalletClient.signHash(
            transactionRequest.hash.bytes, // Origin hash.
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

/**
 *
 * Define an object compatible with
 * [Viem prepareTransactionRequest](https://www.viem.sh/docs/actions/wallet/prepareTransactionRequest)
 * argument.
 */
interface PrepareTransactionRequestRequest {
    // Clause
    to?: Address;
    value: Hex | number;
    data?: Hex;
    comment?: string;
    abi?: Hex;
    // Transaction body
    beggar?: Address;
    blockRef: Hex;
    chainTag: number;
    dependsOn?: Hex;
    expiration: number;
    gas: Hex | number;
    gasPriceCoef: number;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce: number;
}

/**
 * Configuration object for the WalletClient.
 */
interface WalletClientConfig extends PublicClientConfig {
    account?: Account;
}

export {
    createWalletClient,
    WalletClient,
    type PrepareTransactionRequestRequest,
    type WalletClientConfig
};
