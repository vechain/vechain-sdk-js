import { type SignTransactionOptions, type ThorClient } from '../../../thor-client';
import { type AvailableVeChainProviders, type TransactionRequestInput } from '../types';
import { VeChainAbstractSigner } from '../vechain-abstract-signer/vechain-abstract-signer';
/**
 * Basic VeChain signer with the private key.
 * This signer can be initialized using a private key.
 */
declare class VeChainPrivateKeySigner extends VeChainAbstractSigner {
    private readonly privateKey;
    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(privateKey: Uint8Array, provider?: AvailableVeChainProviders);
    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    connect(provider: AvailableVeChainProviders): this;
    /**
     * Get the address checksum of the Signer.
     *
     * @returns the address checksum of the signer
     */
    getAddress(): Promise<string>;
    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties with eth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    signTransaction(transactionToSign: TransactionRequestInput): Promise<string>;
    /**
     * Sends a transaction to the blockchain.
     *
     * @param {TransactionRequestInput} transactionToSend - The transaction object to be sent.
     * This includes all the necessary details such as `to`, `value`, `data`, `gas`, etc.
     * Note: `gasLimit` is deprecated and will be removed in a future release. Use `gas` instead.
     * @return {Promise<string>} A promise that resolves to the transaction hash as a string
     * once the transaction is successfully sent.
     * @throws {JSONRPCInvalidParams} Throws an error if the provider is not attached
     * to the signer, indicating the signer's inability to send the transaction.
     */
    sendTransaction(transactionToSend: TransactionRequestInput): Promise<string>;
    /**
     * Signs a payload.
     *
     * @param {Uint8Array} payload - The payload to be signed as a byte array
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    signPayload(payload: Uint8Array): Promise<string>;
    /**
     * Signs a transaction internal method
     *
     * @param transaction - The transaction to sign
     * @param gasPayer - The gasPayer to use
     * @param thorClient - The ThorClient instance
     * @returns The fully signed transaction
     * @throws {InvalidSecp256k1PrivateKey, InvalidDataType}
     */
    _signFlow(transaction: TransactionRequestInput, gasPayer: SignTransactionOptions | null, thorClient: ThorClient): Promise<string>;
    /**
     * Signs a transaction where the gas fee is paid by a gasPayer.
     *
     * @param unsignedTransactionBody - The unsigned transaction body to sign.
     * @param originPrivateKey - The private key of the origin account.
     * @param thorClient - The ThorClient instance.
     * @param gasPayerOptions - Optional parameters for the request. Includes the `gasPayerServiceUrl` and `gasPayerPrivateKey` fields.
     *                  Only one of the following options can be specified: `gasPayerServiceUrl`, `gasPayerPrivateKey`.
     * @returns A promise that resolves to the signed transaction.
     * @throws {NotDelegatedTransaction}
     */
    private _signWithGasPayer;
}
export { VeChainPrivateKeySigner };
//# sourceMappingURL=vechain-private-key-signer.d.ts.map