import { bytesToHex, concatBytes } from '@noble/curves/abstract/utils';
import { type SignatureType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Address, Hex, Keccak256, Transaction, Txt } from '@vechain/sdk-core';
import { JSONRPCInvalidParams, SignerMethodError } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    DelegationHandler,
    RPC_METHODS,
    SignTransactionOptions,
    ThorClient,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataParameter } from 'abitype';
import { BitString, ObjectIdentifier, Sequence, verifySchema } from 'asn1js';
import { hashTypedData, recoverPublicKey, toHex } from 'viem';
import { KMSVeChainProvider } from './KMSVeChainProvider';

class KMSVeChainSigner extends VeChainAbstractSigner {
    private readonly kmsVeChainProvider?: KMSVeChainProvider;

    public constructor(provider?: AvailableVeChainProviders) {
        super(provider);
        if (this.provider !== undefined) {
            if (!(this.provider instanceof KMSVeChainProvider)) {
                throw new JSONRPCInvalidParams(
                    'KMSVeChainSigner.constructor',
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
        try {
            return new KMSVeChainSigner(provider) as this;
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.connect',
                'The signer could not be connected to the provider.',
                { provider },
                error
            );
        }
    }

    /**
     * Decodes the public key from the DER-encoded public key.
     * @param {Uint8Array} encodedPublicKey DER-encoded public key
     * @returns {Uint8Array} The decoded public key.
     */
    private decodePublicKey(encodedPublicKey: Uint8Array): Uint8Array {
        const schema = new Sequence({
            value: [
                new Sequence({ value: [new ObjectIdentifier()] }),
                new BitString({ name: 'objectIdentifier' })
            ]
        });
        const parsed = verifySchema(encodedPublicKey, schema);
        if (!parsed.verified) {
            throw new SignerMethodError(
                'KMSVeChainSigner.decodePublicKey',
                `Failed to parse the encoded public key: ${parsed.result.error}`,
                { parsed }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const objectIdentifier: ArrayBuffer =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            parsed.result.objectIdentifier.valueBlock.valueHex;

        return new Uint8Array(objectIdentifier);
    }

    /**
     * Gets the DER-encoded public key from KMS and decodes it.
     * @returns {Uint8Array} The decoded public key.
     */
    private async getDecodedPublicKey(getPublicKey: () => Promise<Uint8Array>): Promise<Uint8Array> {
        const publicKey = await getPublicKey();
        return this.decodePublicKey(publicKey);
    }

    /**
     * It returns the address associated with the signer.
     * @returns The address associated with the signer.
     */
    public async getAddress(): Promise<string> {
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.getDecodedPublicKey',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                {}
            );
        }
        try {
            const publicKeyDecoded = await this.getDecodedPublicKey(this.kmsVeChainProvider.getOriginPublicKey);
            return Address.ofPublicKey(publicKeyDecoded).toString();
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.getAddress',
                'The address could not be retrieved.',
                {},
                error
            );
        }
    }

    /**
     * It builds a VeChain signature from a bytes payload.
     * @param {Uint8Array} payload to sign.
     * @returns {Uint8Array} The signature following the VeChain format.
     */
    private async buildVeChainSignatureFromPayload(
        payload: Uint8Array,
        sign: (message: Uint8Array) => Promise<Uint8Array>
    ): Promise<Uint8Array> {
        if (this.kmsVeChainProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.buildVeChainSignatureFromPayload',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { payload }
            );
        }

        // Sign the transaction hash
        const signature = await sign(payload);

        // Build the VeChain signature using the r, s and v components
        const hexSignature = bytesToHex(signature);
        const decodedSignatureWithoutRecoveryBit =
            secp256k1.Signature.fromDER(hexSignature).normalizeS();

        const recoveryBit = await this.getRecoveryBit(
            decodedSignatureWithoutRecoveryBit,
            payload
        );

        const decodedSignature = concatBytes(
            decodedSignatureWithoutRecoveryBit.toCompactRawBytes(),
            new Uint8Array([recoveryBit])
        );

        return decodedSignature;
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
        const publicKey = await this.getDecodedPublicKey();
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

        throw new SignerMethodError(
            'KMSVeChainSigner.getRecoveryBit',
            'The recovery bit could not be found.',
            { decodedSignatureWithoutRecoveryBit, transactionHash }
        );
    }

    private async signWithDelegator(
        transactionHash: Uint8Array,
        originPrivateKey: Uint8Array,
        thorClient: ThorClient,
        delegatorOptions?: SignTransactionOptions
    ): Promise<string> {
        // Address of the origin account
        const originAddress = await this.getAddress();

        const unsignedTx = Transaction.of(unsignedTransactionBody);

        // Sign transaction with origin private key and delegator private key
        if (delegatorOptions?.delegatorPrivateKey !== undefined)
            return Hex.of(
                Transaction.of(unsignedTransactionBody).signWithDelegator(
                    originPrivateKey,
                    HexUInt.of(delegatorOptions?.delegatorPrivateKey).bytes
                ).encoded
            ).toString();

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await DelegationHandler(
            delegatorOptions
        ).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = Secp256k1.sign(
            unsignedTx.getTransactionHash().bytes,
            originPrivateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = new Uint8Array(
            originSignature.length + delegatorSignature.length
        );
        signature.set(originSignature);
        signature.set(delegatorSignature, originSignature.length);

        // Return new signed transaction
        return Hex.of(
            Transaction.of(unsignedTx.body, signature).encoded
        ).toString();
    }

    /**
     * It signs a transaction.
     * @param transactionToSign Transaction body to sign in plain format.
     * @returns {string} The signed transaction in hexadecimal format.
     */
    public async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        try {
            // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
            const populatedTransaction =
                await this.populateTransaction(transactionToSign);

            // Get the transaction hash
            const transactionHash =
                Transaction.of(populatedTransaction).getTransactionHash().bytes;

            if (this.kmsVeChainProvider?.delegator !== undefined) {
                const delegatorParameter =
                    this.kmsVeChainProvider.delegator.keyId !== undefined
                        ? {
                              delegatorPrivateKey:
                                  this.kmsVeChainProvider.delegator.keyId
                          }
                        : {
                              delegatorUrl: this.kmsVeChainProvider.delegator
                                  .url as string
                          };

                return await this.signWithDelegator(
            }

            const veChainSignature =
                await this.buildVeChainSignatureFromPayload(transactionHash);

            return Hex.of(
                Transaction.of(populatedTransaction, veChainSignature).encoded
            ).toString();
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.signTransaction',
                'The transaction could not be signed.',
                { transactionToSign },
                error
            );
        }
    }

    /**
     * Submits a signed transaction to the network.
     * @param transactionToSend Transaction to by signed and sent to the network.
     * @returns {string} The transaction ID.
     */
    public async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        try {
            // Sign the transaction
            const signedTransaction =
                await this.signTransaction(transactionToSend);

            // Send the signed transaction (the provider will always exist if it gets to this point)
            return (await this.kmsVeChainProvider?.request({
                method: RPC_METHODS.eth_sendRawTransaction,
                params: [signedTransaction]
            })) as string;
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.sendTransaction',
                'The transaction could not be sent.',
                { transactionToSend },
                error
            );
        }
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
        try {
            const payload =
                typeof message === 'string' ? Txt.of(message).bytes : message;
            const payloadHashed = Keccak256.of(
                concatBytes(
                    this.MESSAGE_PREFIX,
                    Txt.of(payload.length).bytes,
                    payload
                )
            ).bytes;
            return await this.signPayload(payloadHashed);
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.signMessage',
                'The message could not be signed.',
                { message },
                error
            );
        }
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
        try {
            const payload = Hex.of(
                hashTypedData({ domain, types, primaryType, message })
            ).bytes;
            return await this.signPayload(payload);
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.signTypedData',
                'The typed data could not be signed.',
                { domain, types, primaryType, message },
                error
            );
        }
    }
}

export { KMSVeChainSigner };
