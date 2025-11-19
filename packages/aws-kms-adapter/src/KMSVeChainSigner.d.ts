import { type AvailableVeChainProviders, type TransactionRequestInput, VeChainAbstractSigner } from '@vechain/sdk-network';
declare class KMSVeChainSigner extends VeChainAbstractSigner {
    private readonly kmsVeChainProvider?;
    private readonly kmsVeChainGasPayerProvider?;
    private readonly kmsVeChainGasPayerServiceUrl?;
    constructor(provider?: AvailableVeChainProviders, gasPayer?: {
        provider?: AvailableVeChainProviders;
        url?: string;
    });
    /**
     * Connects the signer to a provider.
     * @param provider The provider to connect to.
     * @returns {this} The signer instance.
     * @override VeChainAbstractSigner.connect
     **/
    connect(provider: AvailableVeChainProviders): this;
    /**
     * Decodes the public key from the DER-encoded public key.
     * @param {Uint8Array} encodedPublicKey DER-encoded public key
     * @returns {Uint8Array} The decoded public key.
     */
    private decodePublicKey;
    /**
     * Gets the DER-encoded public key from KMS and decodes it.
     * @param {KMSVeChainProvider} kmsProvider (Optional) The provider to get the public key from.
     * @returns {Uint8Array} The decoded public key.
     */
    private getDecodedPublicKey;
    /**
     * It returns the address associated with the signer.
     * @param {boolean} fromGasPayerProvider (Optional) If true, the provider will be the gasPayer.
     * @returns The address associated with the signer.
     */
    getAddress(fromGasPayerProvider?: boolean | undefined): Promise<string>;
    /**
     * It builds a VeChain signature from a bytes' payload.
     * @param {Uint8Array} payload to sign.
     * @param {KMSVeChainProvider} kmsProvider The provider to sign the payload.
     * @returns {Uint8Array} The signature following the VeChain format.
     * @throws JSONRPCInvalidParams if `kmsProvider` is undefined.
     */
    private buildVeChainSignatureFromPayload;
    /**
     * Returns the recovery bit of a signature.
     * @param {SignatureType} decodedSignatureWithoutRecoveryBit Signature with the R and S components only.
     * @param {Uint8Array} transactionHash Raw transaction hash.
     * @param {KMSVeChainProvider} kmsProvider The provider to sign the payload.
     * @returns {number} The V component of the signature (either 0 or 1).
     */
    private getRecoveryBit;
    /**
     * Processes a transaction by signing its hash with the origin key and, if delegation is available,
     * appends a gas payer's signature to the original signature.
     *
     * @param {Transaction} transaction - The transaction to be processed, provides the transaction hash and necessary details.
     * @return {Promise<Uint8Array>} A Promise that resolves to a byte array containing the combined origin and gas payer signatures,
     * or just the origin signature if no gas payer provider or service URL is available.
     * @throws JSONRPCInvalidParams if {@link this.provider} is undefined.
     */
    private concatSignatureIfDelegation;
    /**
     * It signs a transaction.
     * @param transactionToSign Transaction body to sign in plain format.
     * @returns {string} The signed transaction in hexadecimal format.
     * @throws JSONRPCInvalidParams if {@link this.provider} is undefined.
     */
    signTransaction(transactionToSign: TransactionRequestInput): Promise<string>;
    /**
     * Submits a signed transaction to the network.
     * @param transactionToSend Transaction to be signed and sent to the network.
     * @returns {string} The transaction ID.
     */
    sendTransaction(transactionToSend: TransactionRequestInput): Promise<string>;
    /**
     * Signs a bytes payload returning the VeChain signature in hexadecimal format.
     * @param {Uint8Array} payload in bytes to sign.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    signPayload(payload: Uint8Array): Promise<string>;
}
export { KMSVeChainSigner };
//# sourceMappingURL=KMSVeChainSigner.d.ts.map