import * as nc_utils from '@noble/curves/abstract/utils';
import { type Account } from 'viem';
import { SendTransaction, type ThorNetworks } from '@thor/thorest';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { Address, Blake2b256, Hex, HexInt, HexUInt } from '@common/vcdm';
import { FetchHttpClient, type HttpClient } from '@common/http';
import {
    IllegalArgumentError,
    UnsupportedOperationError
} from '@common/errors';
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

    /**
     * Signs the given transaction request and returns the resulting hexadecimal representation.
     * The transaction request can either be
     * - an unsigned transaction request,
     * - an unsigned sponsored transaction request this wallet signs as origin/sender,
     * - a signed sponsored transaction request this wallet sisgns as gas-payer.sponsor.
     *
     * @param {TransactionRequest | TransactionRequest} transactionRequest - The transaction request to be signed.
     * @return {Promise<Hex>} A promise that resolves to the signed transaction in hexadecimal format.
     * @throws {UnsupportedOperationError} If the account is not set.
     */
    public async signTransaction(
        transactionRequest: TransactionRequest
    ): Promise<Hex> {
        if (this.account !== null) {
            if (transactionRequest instanceof TransactionRequest) {
                return await WalletClient.sponsorTransactionRequest(
                    transactionRequest,
                    this.account
                );
            }
            return await WalletClient.signTransactionRequest(
                transactionRequest,
                this.account
            );
        }
        throw new UnsupportedOperationError(
            `${FQP}WalletClient.signTransaction(transactionRequest: TransactionRequest | SignedTransactionRequest): Hex`,
            'account is not set'
        );
    }

    /**
     * Signs a given transaction request with the provided account and returns the signed transaction in hexadecimal format.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @param {Account} account - The account object containing the necessary credentials for signing.
     * @return {Promise<Hex>} A promise that resolves to the signed transaction encoded in hexadecimal format.
     */
    private static async signTransactionRequest(
        transactionRequest: TransactionRequest,
        account: Account
    ): Promise<Hex> {
        const originHash = Blake2b256.of(
            TransactionRequestRLPCodec.encode(transactionRequest)
        ).bytes;
        const originSignature = await WalletClient.signHash(
            originHash,
            account
        );
        const signedTransactionRequest = new TransactionRequest(
            {
                ...transactionRequest
            },
            originSignature,
            undefined,
            originSignature
        );
        return HexUInt.of(
            TransactionRequestRLPCodec.encode(signedTransactionRequest)
        );
    }

    /**
     * Sponsors a transaction request and returns the resulting hex-encoded sponsored transaction.
     *
     * @param {TransactionRequest} signedTransactionRequest - The signed transaction request to be sponsored.
     *        Must have the `isIntendedToBeSponsored` flag set to true.
     * @param {Account} account - The account object providing the gas payer's private key for signing the transaction.
     * @return {Promise<Hex>} A Promise that resolves to the hex-encoded representation of the sponsored transaction request.
     * @throws {IllegalArgumentError} If the transaction request is not intended to be sponsored.
     */
    private static async sponsorTransactionRequest(
        signedTransactionRequest: TransactionRequest,
        account: Account
    ): Promise<Hex> {
        if (signedTransactionRequest.isIntendedToBeSponsored) {
            const originHash = Blake2b256.of(
                TransactionRequestRLPCodec.encode(
                    new TransactionRequest({
                        blockRef: signedTransactionRequest.blockRef,
                        chainTag: signedTransactionRequest.chainTag,
                        clauses: signedTransactionRequest.clauses,
                        dependsOn: signedTransactionRequest.dependsOn,
                        expiration: signedTransactionRequest.expiration,
                        gas: signedTransactionRequest.gas,
                        gasPriceCoef: signedTransactionRequest.gasPriceCoef,
                        nonce: signedTransactionRequest.nonce
                    })
                )
            );
            const gasPayerHash = Blake2b256.of(
                nc_utils.concatBytes(
                    originHash.bytes //,
                    // signedTransactionRequest.origin.bytes
                )
            );
            const gasPayerSignature = await WalletClient.signHash(
                gasPayerHash.bytes,
                account
            );
            const sponsoredTransactionRequest = new TransactionRequest(
                {
                    blockRef: signedTransactionRequest.blockRef,
                    chainTag: signedTransactionRequest.chainTag,
                    clauses: signedTransactionRequest.clauses,
                    dependsOn: signedTransactionRequest.dependsOn,
                    expiration: signedTransactionRequest.expiration,
                    gas: signedTransactionRequest.gas,
                    gasPriceCoef: signedTransactionRequest.gasPriceCoef,
                    nonce: signedTransactionRequest.nonce
                },
                signedTransactionRequest.originSignature,
                gasPayerSignature,
                nc_utils.concatBytes(
                    signedTransactionRequest.originSignature,
                    gasPayerSignature
                )
            );
            return HexUInt.of(
                TransactionRequestRLPCodec.encode(sponsoredTransactionRequest)
            );
        }
        throw new IllegalArgumentError(
            `${FQP}WalletClient.signTransaction(signedTransactionRequest: SignedTransactionRequest): Hex`,
            'not intended to be sponsored'
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
