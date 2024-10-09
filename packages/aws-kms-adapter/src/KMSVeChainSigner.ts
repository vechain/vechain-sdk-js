import { bytesToHex } from '@noble/curves/abstract/utils';
import { type SignatureType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Address, Hex, Transaction, Txt } from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    RPC_METHODS,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataParameter } from 'abitype';
import { hashTypedData, recoverPublicKey, toHex } from 'viem';
import { KMSVeChainProvider } from './KMSVeChainProvider';

class KMSVeChainSigner extends VeChainAbstractSigner {
    private readonly kmsVeChainProvider?: KMSVeChainProvider;

    public constructor(provider?: AvailableVeChainProviders) {
        super(provider);
        if (this.provider !== undefined) {
            if (!(this.provider instanceof KMSVeChainProvider)) {
                throw new JSONRPCInvalidParams(
                    'KMSVeChainSigner.constructor()',
                    -32602,
                    'The provider must be an instance of KMSVeChainProvider.',
                    { provider }
                );
            }
            this.kmsVeChainProvider = this.provider;
        }
    }

    /**
     * Connects the signer to a provider.
     * @param provider The provider to connect to.
     * @returns {this} The signer instance.
     * @override VeChainAbstractSigner.connect
     **/
    public connect(provider: AvailableVeChainProviders): this {
        return new KMSVeChainSigner(provider) as this;
    }

    /**
     * It returns the address associated with the signer.
     * @returns The address associated with the signer.
     */
    public async getAddress(): Promise<string> {
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.getAddress()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                {}
            );
        }
        const publicKey = await this.kmsVeChainProvider.getPublicKey();
        if (publicKey === undefined) {
            // TODO: throw error
            return '';
        }
        return Address.ofPublicKey(publicKey).toString();
    }

    /**
     * It builds a VeChain signature from a bytes payload.
     * @param {Uint8Array} payload to sign.
     * @returns {Uint8Array} The signature following the VeChain format.
     */
    private async buildVeChainSignatureFromPayload(
        payload: Uint8Array
    ): Promise<Uint8Array> {
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.getRecoveryBit()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { payload }
            );
        }
        // Sign the transaction hash
        const signature = await this.kmsVeChainProvider.sign(payload);

        if (signature === undefined) {
            // TODO: throw error
            return new Uint8Array();
        }

        // Build the VeChain signature using the r, s and v components
        const hexSignature = bytesToHex(signature);
        const decodedSignatureWithoutRecoveryBit =
            secp256k1.Signature.fromDER(hexSignature).normalizeS();

        const recoveryBit = await this.getRecoveryBit(
            decodedSignatureWithoutRecoveryBit,
            payload
        );
        const decodedSignature =
            decodedSignatureWithoutRecoveryBit.addRecoveryBit(recoveryBit);

        return decodedSignature.toCompactRawBytes();
    }

    /**
     * Returns the recovery bit of a signature.
     * @param decodedSignatureWithoutRecoveryBit Signature with the R and S components only.
     * @param transactionHash Raw transaction hash.
     * @returns {number} The V component of the signature (either 0 or 1).
     */
    private async getRecoveryBit(
        decodedSignatureWithoutRecoveryBit: SignatureType,
        transactionHash: Uint8Array
    ): Promise<number> {
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.getRecoveryBit()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { decodedSignatureWithoutRecoveryBit, transactionHash }
            );
        }
        const publicKey = await this.kmsVeChainProvider.getPublicKey();
        if (publicKey === undefined) {
            // TODO: throw error
            return -1;
        }
        const publicKeyHex = toHex(publicKey);

        for (let i = 0n; i < 2n; i++) {
            const publicKeyRecovered = await recoverPublicKey({
                hash: transactionHash,
                signature: {
                    r: toHex(decodedSignatureWithoutRecoveryBit.r),
                    s: toHex(decodedSignatureWithoutRecoveryBit.s),
                    v: i
                }
            });
            if (publicKeyRecovered === publicKeyHex) {
                return Number(i);
            }
        }

        // TODO: throw error
        return -1;
    }

    /**
     * It signs a transaction.
     * @param transactionToSign Transaction body to sign in plain format.
     * @returns {string} The signed transaction in hexadecimal format.
     */
    public async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        // Check the provider (needed to sign the transaction)
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.signTransaction()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSign }
            );
        }
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transactionToSign);

        // Get the transaction hash
        const transactionHash =
            Transaction.of(populatedTransaction).getTransactionHash().bytes;

        const veChainSignature =
            await this.buildVeChainSignatureFromPayload(transactionHash);

        return Hex.of(
            Transaction.of(populatedTransaction, veChainSignature).encoded
        ).toString();
    }

    /**
     * Submits a signed transaction to the network.
     * @param transactionToSend Transaction to by signed and sent to the network.
     * @returns {string} The transaction ID.
     */
    public async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.sendTransaction()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSend }
            );
        }

        // 2 - Sign the transaction
        const signedTransaction = await this.signTransaction(transactionToSend);

        // 3 - Send the signed transaction
        return (await this.kmsVeChainProvider.request({
            method: RPC_METHODS.eth_sendRawTransaction,
            params: [signedTransaction]
        })) as string;
    }

    /**
     * Signs a bytes payload returning the VeChain signature in hexadecimal format.
     * @param {Uint8Array} payload in bytes to sign.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    private async signPayload(payload: Uint8Array): Promise<string> {
        const veChainSignature =
            await this.buildVeChainSignatureFromPayload(payload);
        // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
        veChainSignature[veChainSignature.length - 1] += 27;
        return Hex.of(veChainSignature).toString();
    }

    /**
     * Signs a message returning the VeChain signature in hexadecimal format.
     * @param {string | Uint8Array} message to sign.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    public async signMessage(message: string | Uint8Array): Promise<string> {
        const payload =
            typeof message === 'string' ? Txt.of(message).bytes : message;
        return await this.signPayload(payload);
    }

    /**
     * Signs a typed data returning the VeChain signature in hexadecimal format.
     * @param {TypedDataDomain} domain to hash as typed data.
     * @param {Record<string, TypedDataParameter[]>} types to hash as typed data.
     * @param {string} primaryType to hash as typed data.
     * @param {Record<string, unknown>} message to hash as typed data.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    public async signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        primaryType: string,
        message: Record<string, unknown>
    ): Promise<string> {
        const payload = Hex.of(
            hashTypedData({ domain, types, primaryType, message })
        ).bytes;
        return await this.signPayload(payload);
    }
}

export { KMSVeChainSigner };
