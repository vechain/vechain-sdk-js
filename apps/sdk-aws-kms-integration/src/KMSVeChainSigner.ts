import { bytesToHex } from '@noble/curves/abstract/utils';
import { type SignatureType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import {
    Address,
    Hex,
    Transaction,
    type TransactionBody
} from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataParameter } from 'abitype';
import { recoverPublicKey, toHex } from 'viem';
import { type KMSVeChainProvider } from './KMSVeChainProvider';

class KMSVeChainSigner extends VeChainAbstractSigner {
    private readonly kmsVeChainProvider: KMSVeChainProvider;

    public constructor(provider?: AvailableVeChainProviders) {
        super(provider);
        this.kmsVeChainProvider = this.provider as KMSVeChainProvider;
    }

    public connect(provider: AvailableVeChainProviders): this {
        return new KMSVeChainSigner(provider) as this;
    }

    public async getAddress(): Promise<string> {
        const publicKey = await this.kmsVeChainProvider.getPublicKey();
        if (publicKey === undefined) {
            // TODO: throw error
            return '';
        }
        return Address.ofPublicKey(publicKey).toString();
    }

    private async buildVeChainSignatureFromTx(
        transactionBody: TransactionBody
    ): Promise<string> {
        // Get the transaction hash
        const transactionHash =
            Transaction.of(transactionBody).getTransactionHash().bytes;
        // Sign the transaction hash
        const signature = await this.kmsVeChainProvider.sign(transactionHash);

        if (signature === undefined) {
            // TODO: throw error
            return '';
        }

        // Build the VeChain signature using the r, s and v components
        const hexSignature = bytesToHex(signature);
        const decodedSignatureWithoutRecoveryBit =
            secp256k1.Signature.fromDER(hexSignature).normalizeS();

        const recoveryBit = await this.getRecoveryBit(
            decodedSignatureWithoutRecoveryBit,
            transactionHash
        );
        const decodedSignature =
            decodedSignatureWithoutRecoveryBit.addRecoveryBit(recoveryBit);

        return Hex.of(
            Transaction.of(
                transactionBody,
                decodedSignature.toCompactRawBytes()
            ).encoded
        ).toString();
    }

    private async getRecoveryBit(
        decodedSignatureWithoutRecoveryBit: SignatureType,
        transactionHash: Uint8Array
    ): Promise<number> {
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

    public async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        // Check the provider (needed to sign the transaction)
        if (this.provider === undefined) {
            throw new JSONRPCInvalidParams(
                'VeChainPrivateKeySigner.signTransaction()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSign }
            );
        }
        // Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transactionToSign);

        return await this.buildVeChainSignatureFromTx(populatedTransaction);
    }
    async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async signMessage(message: string | Uint8Array): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        value: Record<string, unknown>
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }
}

export { KMSVeChainSigner };
