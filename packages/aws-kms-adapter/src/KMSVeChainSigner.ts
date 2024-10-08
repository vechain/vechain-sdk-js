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

    private async buildVeChainSignatureFromPayload(
        payload: Uint8Array
    ): Promise<Uint8Array> {
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

    public async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        if (this.provider === undefined) {
            throw new JSONRPCInvalidParams(
                'KMSVeChainSigner.sendTransaction()',
                -32602,
                'Thor provider is not found into the signer. Please attach a Provider to your signer instance.',
                { transactionToSend }
            );
        }

        const provider = this.provider;

        // 2 - Sign the transaction
        const signedTransaction = await this.signTransaction(transactionToSend);

        // 3 - Send the signed transaction
        return (await provider.request({
            method: RPC_METHODS.eth_sendRawTransaction,
            params: [signedTransaction]
        })) as string;
    }

    public async signMessage(message: string | Uint8Array): Promise<string> {
        const payload =
            typeof message === 'string' ? Txt.of(message).bytes : message;
        const veChainSignature =
            await this.buildVeChainSignatureFromPayload(payload);
        // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
        veChainSignature[veChainSignature.length - 1] += 27;
        return Hex.of(veChainSignature).toString();
    }

    public async signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        primaryType: string,
        message: Record<string, unknown>
    ): Promise<string> {
        const payload = Hex.of(
            hashTypedData({ domain, types, primaryType, message })
        ).bytes;
        const veChainSignature =
            await this.buildVeChainSignatureFromPayload(payload);
        // SCP256K1 encodes the recovery flag in the last byte. EIP-191 adds 27 to it.
        veChainSignature[veChainSignature.length - 1] += 27;
        return Hex.of(veChainSignature).toString();
    }
}

export { KMSVeChainSigner };
