import { bytesToHex } from '@noble/curves/abstract/utils';
import { secp256k1 } from '@noble/curves/secp256k1';
import { Address, Hex, Transaction } from '@vechain/sdk-core';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import {
    type AvailableVeChainProviders,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataParameter } from 'abitype';
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

        const transactionHash =
            Transaction.of(populatedTransaction).getTransactionHash().bytes;

        // Sign the transaction hash
        const signature = await this.kmsVeChainProvider.sign(transactionHash);

        if (signature === undefined) {
            // TODO: throw error
            return '';
        }

        const hexSignature = bytesToHex(signature);
        const decodedSignature = secp256k1.Signature.fromDER(hexSignature);
        // TODO: add recovery bit
        decodedSignature.addRecoveryBit(0);

        return Hex.of(
            Transaction.of(
                populatedTransaction,
                decodedSignature.toCompactRawBytes()
            ).encoded
        ).toString();
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
