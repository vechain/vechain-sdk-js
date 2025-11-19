"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMSVeChainSigner = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const secp256k1_1 = require("@noble/curves/secp256k1");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_network_1 = require("@vechain/sdk-network");
const asn1js_1 = require("asn1js");
const viem_1 = require("viem");
const KMSVeChainProvider_1 = require("./KMSVeChainProvider");
class KMSVeChainSigner extends sdk_network_1.VeChainAbstractSigner {
    kmsVeChainProvider;
    kmsVeChainGasPayerProvider;
    kmsVeChainGasPayerServiceUrl;
    constructor(provider, gasPayer) {
        // Origin provider
        super(provider);
        if (this.provider !== undefined) {
            if (!(this.provider instanceof KMSVeChainProvider_1.KMSVeChainProvider)) {
                throw new sdk_errors_1.JSONRPCInvalidParams('KMSVeChainSigner.constructor', 'The provider must be an instance of KMSVeChainProvider.', { provider });
            }
            this.kmsVeChainProvider = this.provider;
        }
        // Gas-payer provider, if any
        if (gasPayer !== undefined) {
            if (gasPayer.provider !== undefined &&
                gasPayer.provider instanceof KMSVeChainProvider_1.KMSVeChainProvider) {
                this.kmsVeChainGasPayerProvider = gasPayer.provider;
            }
            else if (gasPayer.url !== undefined) {
                this.kmsVeChainGasPayerServiceUrl = gasPayer.url;
            }
            else {
                throw new sdk_errors_1.JSONRPCInvalidParams('KMSVeChainSigner.constructor', 'The gasPayer object is not well formed, either provider or url should be provided.', { gasPayer });
            }
        }
    }
    /**
     * Connects the signer to a provider.
     * @param provider The provider to connect to.
     * @returns {this} The signer instance.
     * @override VeChainAbstractSigner.connect
     **/
    connect(provider) {
        try {
            return new KMSVeChainSigner(provider);
        }
        catch (error) {
            throw new sdk_errors_1.SignerMethodError('KMSVeChainSigner.connect', 'The signer could not be connected to the provider.', { provider }, error);
        }
    }
    /**
     * Decodes the public key from the DER-encoded public key.
     * @param {Uint8Array} encodedPublicKey DER-encoded public key
     * @returns {Uint8Array} The decoded public key.
     */
    decodePublicKey(encodedPublicKey) {
        const schema = new asn1js_1.Sequence({
            value: [
                new asn1js_1.Sequence({ value: [new asn1js_1.ObjectIdentifier()] }),
                new asn1js_1.BitString({ name: 'objectIdentifier' })
            ]
        });
        const parsed = (0, asn1js_1.verifySchema)(encodedPublicKey, schema);
        if (!parsed.verified) {
            throw new sdk_errors_1.SignerMethodError('KMSVeChainSigner.decodePublicKey', `Failed to parse the encoded public key: ${parsed.result.error}`, { parsed });
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const objectIdentifier = 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        parsed.result.objectIdentifier.valueBlock.valueHex;
        return new Uint8Array(objectIdentifier);
    }
    /**
     * Gets the DER-encoded public key from KMS and decodes it.
     * @param {KMSVeChainProvider} kmsProvider (Optional) The provider to get the public key from.
     * @returns {Uint8Array} The decoded public key.
     */
    async getDecodedPublicKey(kmsProvider = this.kmsVeChainProvider) {
        if (kmsProvider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('KMSVeChainSigner.getDecodedPublicKey', 'Thor provider is not found into the signer. Please attach a Provider to your signer instance.', {});
        }
        const publicKey = await kmsProvider.getPublicKey();
        return this.decodePublicKey(publicKey);
    }
    /**
     * It returns the address associated with the signer.
     * @param {boolean} fromGasPayerProvider (Optional) If true, the provider will be the gasPayer.
     * @returns The address associated with the signer.
     */
    async getAddress(fromGasPayerProvider = false) {
        try {
            const kmsProvider = fromGasPayerProvider
                ? this.kmsVeChainGasPayerProvider
                : this.kmsVeChainProvider;
            const publicKeyDecoded = await this.getDecodedPublicKey(kmsProvider);
            return sdk_core_1.Address.ofPublicKey(publicKeyDecoded).toString();
        }
        catch (error) {
            throw new sdk_errors_1.SignerMethodError('KMSVeChainSigner.getAddress', 'The address could not be retrieved.', { fromGasPayerProvider }, error);
        }
    }
    /**
     * It builds a VeChain signature from a bytes' payload.
     * @param {Uint8Array} payload to sign.
     * @param {KMSVeChainProvider} kmsProvider The provider to sign the payload.
     * @returns {Uint8Array} The signature following the VeChain format.
     * @throws JSONRPCInvalidParams if `kmsProvider` is undefined.
     */
    async buildVeChainSignatureFromPayload(payload, kmsProvider = this.kmsVeChainProvider) {
        if (kmsProvider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('KMSVeChainSigner.buildVeChainSignatureFromPayload', 'Thor provider is not found into the signer. Please attach a Provider to your signer instance.', { payload });
        }
        // Sign the transaction hash
        const signature = await kmsProvider.sign(payload);
        // Build the VeChain signature using the r, s and v components
        const hexSignature = (0, utils_1.bytesToHex)(signature);
        const decodedSignatureWithoutRecoveryBit = secp256k1_1.secp256k1.Signature.fromDER(hexSignature).normalizeS();
        const recoveryBit = await this.getRecoveryBit(decodedSignatureWithoutRecoveryBit, payload, kmsProvider);
        return (0, utils_1.concatBytes)(decodedSignatureWithoutRecoveryBit.toCompactRawBytes(), new Uint8Array([recoveryBit]));
    }
    /**
     * Returns the recovery bit of a signature.
     * @param {SignatureType} decodedSignatureWithoutRecoveryBit Signature with the R and S components only.
     * @param {Uint8Array} transactionHash Raw transaction hash.
     * @param {KMSVeChainProvider} kmsProvider The provider to sign the payload.
     * @returns {number} The V component of the signature (either 0 or 1).
     */
    async getRecoveryBit(decodedSignatureWithoutRecoveryBit, transactionHash, kmsProvider) {
        const publicKey = await this.getDecodedPublicKey(kmsProvider);
        const publicKeyHex = (0, viem_1.toHex)(publicKey);
        for (let i = 0n; i < 2n; i++) {
            const publicKeyRecovered = await (0, viem_1.recoverPublicKey)({
                hash: transactionHash,
                signature: {
                    r: (0, viem_1.toHex)(decodedSignatureWithoutRecoveryBit.r),
                    s: (0, viem_1.toHex)(decodedSignatureWithoutRecoveryBit.s),
                    v: i
                }
            });
            if (publicKeyRecovered === publicKeyHex) {
                return Number(i);
            }
        }
        throw new sdk_errors_1.SignerMethodError('KMSVeChainSigner.getRecoveryBit', 'The recovery bit could not be found.', { decodedSignatureWithoutRecoveryBit, transactionHash });
    }
    /**
     * Processes a transaction by signing its hash with the origin key and, if delegation is available,
     * appends a gas payer's signature to the original signature.
     *
     * @param {Transaction} transaction - The transaction to be processed, provides the transaction hash and necessary details.
     * @return {Promise<Uint8Array>} A Promise that resolves to a byte array containing the combined origin and gas payer signatures,
     * or just the origin signature if no gas payer provider or service URL is available.
     * @throws JSONRPCInvalidParams if {@link this.provider} is undefined.
     */
    async concatSignatureIfDelegation(transaction) {
        // Get the transaction hash
        const transactionHash = transaction.getTransactionHash().bytes;
        // Sign the transaction hash using origin key
        const originSignature = await this.buildVeChainSignatureFromPayload(transactionHash);
        // We try first in case there is a gasPayer provider
        if (this.kmsVeChainGasPayerProvider !== undefined) {
            const publicKeyDecoded = await this.getDecodedPublicKey();
            const originAddress = sdk_core_1.Address.ofPublicKey(publicKeyDecoded);
            const delegatedHash = transaction.getTransactionHash(originAddress).bytes;
            const gasPayerSignature = await this.buildVeChainSignatureFromPayload(delegatedHash, this.kmsVeChainGasPayerProvider);
            return (0, utils_1.concatBytes)(originSignature, gasPayerSignature);
        }
        else if (
        // If not, we try with the gasPayer URL
        this.kmsVeChainGasPayerServiceUrl !== undefined) {
            const originAddress = await this.getAddress();
            const gasPayerSignature = await (0, sdk_network_1.DelegationHandler)({
                gasPayerServiceUrl: this.kmsVeChainGasPayerServiceUrl
            }).getDelegationSignatureUsingUrl(transaction, originAddress, 
            // Calling `buildVeChainSignatureFromPayload(transactionHash)` above throws error is `this.provider` is undefined.
            // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
            this.provider.thorClient.httpClient // Never undefined.
            );
            return (0, utils_1.concatBytes)(originSignature, gasPayerSignature);
        }
        return originSignature;
    }
    /**
     * It signs a transaction.
     * @param transactionToSign Transaction body to sign in plain format.
     * @returns {string} The signed transaction in hexadecimal format.
     * @throws JSONRPCInvalidParams if {@link this.provider} is undefined.
     */
    async signTransaction(transactionToSign) {
        try {
            // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
            const transactionBody = await this.populateTransaction(transactionToSign);
            // Get the transaction object
            const transaction = sdk_core_1.Transaction.of(transactionBody);
            // Sign the transaction hash using delegation if needed
            const signature = await this.concatSignatureIfDelegation(transaction);
            return sdk_core_1.Hex.of(sdk_core_1.Transaction.of(transactionBody, signature).encoded).toString();
        }
        catch (error) {
            throw new sdk_errors_1.SignerMethodError('KMSVeChainSigner.signTransaction', 'The transaction could not be signed.', { transactionToSign }, error);
        }
    }
    /**
     * Submits a signed transaction to the network.
     * @param transactionToSend Transaction to be signed and sent to the network.
     * @returns {string} The transaction ID.
     */
    async sendTransaction(transactionToSend) {
        try {
            // Sign the transaction
            const signedTransaction = await this.signTransaction(transactionToSend);
            // Send the signed transaction (the provider will always exist if it gets to this point)
            return (await this.kmsVeChainProvider?.request({
                method: sdk_network_1.RPC_METHODS.eth_sendRawTransaction,
                params: [signedTransaction]
            }));
        }
        catch (error) {
            throw new sdk_errors_1.SignerMethodError('KMSVeChainSigner.sendTransaction', 'The transaction could not be sent.', { transactionToSend }, error);
        }
    }
    /**
     * Signs a bytes payload returning the VeChain signature in hexadecimal format.
     * @param {Uint8Array} payload in bytes to sign.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    async signPayload(payload) {
        const veChainSignature = await this.buildVeChainSignatureFromPayload(payload);
        // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
        veChainSignature[veChainSignature.length - 1] += 27;
        return sdk_core_1.Hex.of(veChainSignature).toString();
    }
}
exports.KMSVeChainSigner = KMSVeChainSigner;
