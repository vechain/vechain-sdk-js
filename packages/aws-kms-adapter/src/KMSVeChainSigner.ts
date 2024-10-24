import { bytesToHex, concatBytes } from '@noble/curves/abstract/utils';
import { type SignatureType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import {
    Address,
    Hex,
    Keccak256,
    Transaction,
    Txt,
    vechain_sdk_core_ethers
} from '@vechain/sdk-core';
import { JSONRPCInvalidParams, SignerMethodError } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    DelegationHandler,
    RPC_METHODS,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { BitString, ObjectIdentifier, Sequence, verifySchema } from 'asn1js';
import { recoverPublicKey, toHex } from 'viem';
import { KMSVeChainProvider } from './KMSVeChainProvider';

class KMSVeChainSigner extends VeChainAbstractSigner {
    private readonly kmsVeChainProvider?: KMSVeChainProvider;
    private readonly kmsVeChainDelegatorProvider?: KMSVeChainProvider;
    private readonly kmsVeChainDelegatorUrl?: string;

    public constructor(
        provider?: AvailableVeChainProviders,
        delegator?: {
            provider?: AvailableVeChainProviders;
            url?: string;
        }
    ) {
        // Origin provider
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

        // Delegator provider, if any
        if (delegator !== undefined) {
            if (
                delegator.provider !== undefined &&
                delegator.provider instanceof KMSVeChainProvider
            ) {
                this.kmsVeChainDelegatorProvider = delegator.provider;
            } else if (delegator.url !== undefined) {
                this.kmsVeChainDelegatorUrl = delegator.url;
            } else {
                throw new JSONRPCInvalidParams(
                    'KMSVeChainSigner.constructor',
                    'The delegator object is not well formed, either provider or url should be provided.',
                    { delegator }
                );
            }
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
     * @param {KMSVeChainProvider} kmsProvider (Optional) The provider to get the public key from.
     * @returns {Uint8Array} The decoded public key.
     */
    private async getDecodedPublicKey(
        kmsProvider: KMSVeChainProvider | undefined = this.kmsVeChainProvider
    ): Promise<Uint8Array> {
        if (kmsProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.getDecodedPublicKey',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                {}
            );
        }
        const publicKey = await kmsProvider.getPublicKey();
        return this.decodePublicKey(publicKey);
    }

    /**
     * It returns the address associated with the signer.
     * @param {boolean} fromDelegatorProvider (Optional) If true, the provider will be the delegator.
     * @returns The address associated with the signer.
     */
    public async getAddress(
        fromDelegatorProvider: boolean | undefined = false
    ): Promise<string> {
        try {
            const kmsProvider = fromDelegatorProvider
                ? this.kmsVeChainDelegatorProvider
                : this.kmsVeChainProvider;
            const publicKeyDecoded =
                await this.getDecodedPublicKey(kmsProvider);
            return Address.ofPublicKey(publicKeyDecoded).toString();
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.getAddress',
                'The address could not be retrieved.',
                { fromDelegatorProvider },
                error
            );
        }
    }

    /**
     * It builds a VeChain signature from a bytes payload.
     * @param {Uint8Array} payload to sign.
     * @param {KMSVeChainProvider} kmsProvider The provider to sign the payload.
     * @returns {Uint8Array} The signature following the VeChain format.
     */
    private async buildVeChainSignatureFromPayload(
        payload: Uint8Array,
        kmsProvider: KMSVeChainProvider | undefined = this.kmsVeChainProvider
    ): Promise<Uint8Array> {
        if (kmsProvider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.buildVeChainSignatureFromPayload',
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { payload }
            );
        }

        // Sign the transaction hash
        const signature = await kmsProvider.sign(payload);

        // Build the VeChain signature using the r, s and v components
        const hexSignature = bytesToHex(signature);
        const decodedSignatureWithoutRecoveryBit =
            secp256k1.Signature.fromDER(hexSignature).normalizeS();

        const recoveryBit = await this.getRecoveryBit(
            decodedSignatureWithoutRecoveryBit,
            payload,
            kmsProvider
        );

        const decodedSignature = concatBytes(
            decodedSignatureWithoutRecoveryBit.toCompactRawBytes(),
            new Uint8Array([recoveryBit])
        );

        return decodedSignature;
    }

    /**
     * Returns the recovery bit of a signature.
     * @param {SignatureType} decodedSignatureWithoutRecoveryBit Signature with the R and S components only.
     * @param {Uint8Array} transactionHash Raw transaction hash.
     * @param {KMSVeChainProvider} kmsProvider The provider to sign the payload.
     * @returns {number} The V component of the signature (either 0 or 1).
     */
    private async getRecoveryBit(
        decodedSignatureWithoutRecoveryBit: SignatureType,
        transactionHash: Uint8Array,
        kmsProvider: KMSVeChainProvider
    ): Promise<number> {
        const publicKey = await this.getDecodedPublicKey(kmsProvider);
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

    /**
     * Concat the origin signature to the delegator signature if the delegator is set.
     * @param {Transaction} transaction Transaction to sign.
     * @returns Both signatures concatenated if the delegator is set, the origin signature otherwise.
     */
    private async concatSignatureIfDelegation(
        transaction: Transaction
    ): Promise<Uint8Array> {
        // Get the transaction hash
        const transactionHash = transaction.getTransactionHash().bytes;

        // Sign the transaction hash using origin key
        const originSignature =
            await this.buildVeChainSignatureFromPayload(transactionHash);

        // We try first in case there is a delegator provider
        if (this.kmsVeChainDelegatorProvider !== undefined) {
            const publicKeyDecoded = await this.getDecodedPublicKey();
            const originAddress = Address.ofPublicKey(publicKeyDecoded);
            const delegatedHash =
                transaction.getTransactionHash(originAddress).bytes;
            const delegatorSignature =
                await this.buildVeChainSignatureFromPayload(
                    delegatedHash,
                    this.kmsVeChainDelegatorProvider
                );
            return concatBytes(originSignature, delegatorSignature);
        } else if (
            // If not, we try with the delegator URL
            this.kmsVeChainDelegatorUrl !== undefined &&
            this.provider !== undefined
        ) {
            const originAddress = await this.getAddress();
            const delegatorSignature = await DelegationHandler({
                delegatorUrl: this.kmsVeChainDelegatorUrl
            }).getDelegationSignatureUsingUrl(
                transaction,
                originAddress,
                this.provider.thorClient.httpClient
            );

            return concatBytes(originSignature, delegatorSignature);
        }

        return originSignature;
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
            const transactionBody =
                await this.populateTransaction(transactionToSign);

            // Get the transaction object
            const transaction = Transaction.of(transactionBody);

            // Sign the transaction hash using delegation if needed
            const signature =
                await this.concatSignatureIfDelegation(transaction);

            return Hex.of(
                Transaction.of(transactionBody, signature).encoded
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
     * @param {vechain_sdk_core_ethers.TypedDataDomain} domain to hash as typed data.
     * @param {Record<string, vechain_sdk_core_ethers.TypedDataField[]>} types to hash as typed data.
     * @param {Record<string, unknown>} value to hash as typed data.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    public async signTypedData(
        domain: vechain_sdk_core_ethers.TypedDataDomain,
        types: Record<string, vechain_sdk_core_ethers.TypedDataField[]>,
        value: Record<string, unknown>
    ): Promise<string> {
        try {
            const payload = Hex.of(
                vechain_sdk_core_ethers.TypedDataEncoder.hash(
                    domain,
                    types,
                    value
                )
            ).bytes;

            return await this.signPayload(payload);
        } catch (error) {
            throw new SignerMethodError(
                'KMSVeChainSigner.signTypedData',
                'The typed data could not be signed.',
                { domain, types, value },
                error
            );
        }
    }
}

export { KMSVeChainSigner };
