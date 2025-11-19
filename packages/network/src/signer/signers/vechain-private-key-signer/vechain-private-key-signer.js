"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeChainPrivateKeySigner = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const rpc_methods_1 = require("../../../provider/utils/const/rpc-mapper/rpc-methods");
const thor_client_1 = require("../../../thor-client");
const vechain_abstract_signer_1 = require("../vechain-abstract-signer/vechain-abstract-signer");
/**
 * Basic VeChain signer with the private key.
 * This signer can be initialized using a private key.
 */
class VeChainPrivateKeySigner extends vechain_abstract_signer_1.VeChainAbstractSigner {
    privateKey;
    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(privateKey, provider) {
        // Assert if the transaction can be signed
        if (!sdk_core_1.Secp256k1.isValidPrivateKey(privateKey)) {
            throw new sdk_errors_1.InvalidSecp256k1PrivateKey(`VeChainPrivateKeySigner.constructor()`, "Invalid private key used to sign initialize the signer. Ensure it's a valid Secp256k1 private key.", undefined);
        }
        // Call the parent constructor
        super(provider);
        this.privateKey = privateKey;
    }
    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    connect(provider) {
        return new VeChainPrivateKeySigner(this.privateKey, provider);
    }
    /**
     * Get the address checksum of the Signer.
     *
     * @returns the address checksum of the signer
     */
    async getAddress() {
        return sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(await Promise.resolve(sdk_core_1.Address.ofPrivateKey(this.privateKey).toString())));
    }
    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties with eth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    async signTransaction(transactionToSign) {
        // Check the provider (needed to sign the transaction)
        if (this.provider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('VeChainPrivateKeySigner.signTransaction()', 'Thor provider is not found into the signer. Please attach a Provider to your signer instance.', { transactionToSign });
        }
        let gasPayer = (0, thor_client_1.DelegationHandler)(await this.provider.wallet?.getGasPayer()).gasPayerOrNull();
        // Override the gasPayer if the transaction has a delegation URL
        if (transactionToSign.delegationUrl !== undefined) {
            gasPayer = {
                gasPayerServiceUrl: transactionToSign.delegationUrl
            };
        }
        // Sign the transaction
        return await this._signFlow(transactionToSign, gasPayer, this.provider.thorClient);
    }
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
    async sendTransaction(transactionToSend) {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.provider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('VeChainPrivateKeySigner.sendTransaction()', 'Thor provider is not found into the signer. Please attach a Provider to your signer instance.', { transactionToSend });
        }
        const provider = this.provider;
        // 2 - Sign the transaction
        const signedTransaction = await this.signTransaction(transactionToSend);
        // 3 - Send the signed transaction
        return (await provider.request({
            method: rpc_methods_1.RPC_METHODS.eth_sendRawTransaction,
            params: [signedTransaction]
        }));
    }
    /**
     * Signs a payload.
     *
     * @param {Uint8Array} payload - The payload to be signed as a byte array
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    async signPayload(payload) {
        const sign = sdk_core_1.Secp256k1.sign(payload, new Uint8Array(this.privateKey));
        // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
        sign[sign.length - 1] += 27;
        return await Promise.resolve(sdk_core_1.Hex.of(sign).toString());
    }
    /**
     * Signs a transaction internal method
     *
     * @param transaction - The transaction to sign
     * @param gasPayer - The gasPayer to use
     * @param thorClient - The ThorClient instance
     * @returns The fully signed transaction
     * @throws {InvalidSecp256k1PrivateKey, InvalidDataType}
     */
    async _signFlow(transaction, gasPayer, thorClient) {
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateTransaction(transaction);
        // Sign the transaction
        return gasPayer !== null
            ? await this._signWithGasPayer(populatedTransaction, this.privateKey, thorClient, gasPayer)
            : sdk_core_1.Hex.of(sdk_core_1.Transaction.of(populatedTransaction).sign(this.privateKey)
                .encoded).toString();
    }
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
    async _signWithGasPayer(unsignedTransactionBody, originPrivateKey, thorClient, gasPayerOptions) {
        // Address of the origin account
        const originAddress = sdk_core_1.Address.ofPrivateKey(originPrivateKey).toString();
        const unsignedTx = sdk_core_1.Transaction.of(unsignedTransactionBody);
        // Sign transaction with origin private key and gasPayer private key
        if (gasPayerOptions?.gasPayerPrivateKey !== undefined) {
            // Validate the gas payer private key before using it
            if (!sdk_core_1.HexUInt.isValid(gasPayerOptions.gasPayerPrivateKey)) {
                throw new sdk_errors_1.InvalidDataType('VeChainPrivateKeySigner._signWithGasPayer', 'Invalid gas payer private key. Ensure it is a valid hexadecimal string.', { gasPayerPrivateKey: gasPayerOptions.gasPayerPrivateKey });
            }
            return sdk_core_1.Hex.of(sdk_core_1.Transaction.of(unsignedTransactionBody).signAsSenderAndGasPayer(originPrivateKey, sdk_core_1.HexUInt.of(gasPayerOptions.gasPayerPrivateKey).bytes).encoded).toString();
        }
        // Otherwise, get the signature of the gasPayer from the gasPayer endpoint
        const gasPayerSignature = await (0, thor_client_1.DelegationHandler)(gasPayerOptions).getDelegationSignatureUsingUrl(unsignedTx, originAddress, thorClient.httpClient);
        // Sign transaction with origin private key
        const originSignature = sdk_core_1.Secp256k1.sign(unsignedTx.getTransactionHash().bytes, originPrivateKey);
        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = new Uint8Array(originSignature.length + gasPayerSignature.length);
        signature.set(originSignature);
        signature.set(gasPayerSignature, originSignature.length);
        // Return new signed transaction
        return sdk_core_1.Hex.of(sdk_core_1.Transaction.of(unsignedTx.body, signature).encoded).toString();
    }
}
exports.VeChainPrivateKeySigner = VeChainPrivateKeySigner;
