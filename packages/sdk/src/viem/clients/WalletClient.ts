import type { ThorNetworks } from '@thor/utils/const';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { Address, Hex, HexInt, HexUInt } from '@common/vcdm';
import { FetchHttpClient, type HttpClient } from '@common/http';
import { UnsupportedOperationError } from '@common/errors';
import { PublicClient, type PublicClientConfig } from './PublicClient';
import { type PrivateKeyAccount } from '../accounts';

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
    private readonly account: PrivateKeyAccount | null;

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
        account: PrivateKeyAccount | null
    ) {
        super(network, transport);
        this.account = account;
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
            return TransactionRequest.of({
                blockRef: request.blockRef,
                chainTag: request.chainTag,
                clauses: [clause],
                dependsOn: request.dependsOn ?? null,
                expiration: request.expiration,
                gas: HexUInt.of(request.gas).bi,
                gasPriceCoef: BigInt(request.gasPriceCoef),
                maxFeePerGas: request.maxFeePerGas,
                maxPriorityFeePerGas: request.maxPriorityFeePerGas,
                nonce: request.nonce,
                reserved: {
                    features: request.delegated ? 1 : 0,
                    unused: []
                }
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
     * Sends a raw signed transaction to the network.
     *
     * @param {Hex} raw - The RLP-encoded signed transaction.
     * @returns {Promise<Hex>} The transaction hash.
     * @see {@link https://viem.sh/docs/actions/wallet/sendRawTransaction | Viem sendRawTransaction}
     */
    public async sendRawTransaction(raw: Hex): Promise<Hex> {
        console.log('raw', raw.toString());
        const txId = await this.thorClient.transactions.sendRawTransaction(raw);
        return txId;
    }

    /**
     * Signs and sends a transaction to the network.
     * If the transaction is delegated it must be fully signed by both the sender and the gas payer.
     * If the transaction is not delegated it will be signed by the account.
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
        if (transactionRequest.isDelegated && !transactionRequest.isSigned) {
            throw new UnsupportedOperationError(
                `${FQP}WalletClient.sendTransaction(request: PrepareTransactionRequestRequest | TransactionRequest): Promise<Hex>`,
                'transaction request is delegated but not fully signed'
            );
        }
        if (!transactionRequest.isSigned) {
            const raw = await this.signTransaction(transactionRequest);
            return await this.sendRawTransaction(raw);
        }
        return await this.sendRawTransaction(transactionRequest.encoded);
    }

    /**
     * Signs a transaction request.
     * If sender is provided, signs as gas payer.
     * If sender is not provided, signs as origin.
     *
     * @param {TransactionRequest | Hex} transactionRequest - The transaction to sign.
     * @param {Address} [sender] - The sender address (only for sponsored transactions).
     * @returns {Promise<Hex>} The RLP-encoded signed transaction.
     * @throws {UnsupportedOperationError} If no account is configured.
     */
    // eslint-disable-next-line require-await
    public async signTransaction(
        transactionRequest: TransactionRequest | Hex,
        sender?: Address
    ): Promise<Hex> {
        let tx: TransactionRequest;
        if (transactionRequest instanceof Hex) {
            tx = TransactionRequest.decode(transactionRequest);
        } else {
            tx = transactionRequest;
        }
        const func = (): Hex => {
            if (this.account !== null) {
                if (sender !== undefined) {
                    return this.account.signAsGasPayer(sender, tx);
                }
                return this.account.sign(tx);
            }
            throw new UnsupportedOperationError(
                `${FQP}WalletClient.signTransaction(transactionRequest: TransactionRequest): Promise<Hex>`,
                'account is not set'
            );
        };
        return Promise.resolve(func());
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
    blockRef: Hex;
    chainTag: number;
    dependsOn?: Hex;
    expiration: number;
    gas: Hex | number;
    gasPriceCoef: number;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce: bigint;
    delegated: boolean;
}

/**
 * Configuration object for the WalletClient.
 */
interface WalletClientConfig extends PublicClientConfig {
    account?: PrivateKeyAccount;
}

export {
    createWalletClient,
    WalletClient,
    type PrepareTransactionRequestRequest,
    type WalletClientConfig
};
