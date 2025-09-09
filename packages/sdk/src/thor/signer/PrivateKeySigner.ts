import { Address, Blake2b256 } from '@vcdm';
import { InvalidPrivateKeyError } from '@errors';
import { RLPCodecTransactionRequest } from './RLPCodecTransactionRequest';
import { Secp256k1 } from '@secp256k1';
import { type Signer } from './Signer';
import {
    SignedTransactionRequest,
    SponsoredTransactionRequest,
    type TransactionRequest
} from '@thor';
import * as nc_utils from '@noble/curves/abstract/utils';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/signer/PrivateKeySigner.ts!';

class PrivateKeySigner implements Signer {
    private privateKey: Uint8Array | null = null;

    public readonly address: Address;

    constructor(privateKey: Uint8Array) {
        if (Secp256k1.isValidPrivateKey(privateKey)) {
            // Defensive copies to avoid external mutation.
            this.privateKey = new Uint8Array(privateKey);
            this.address = Address.ofPrivateKey(privateKey);
        } else {
            throw new InvalidPrivateKeyError(
                `${FQP}PrivateKeySigner.constructor(privateKey: Uint8Array)`,
                'invalid private key'
            );
        }
    }

    private signTransactionRequest(
        transactionRequest: TransactionRequest
    ): SignedTransactionRequest {
        if (this.privateKey !== null) {
            const hash = Blake2b256.of(
                RLPCodecTransactionRequest.encodeTransactionRequest(
                    transactionRequest
                )
            ).bytes;
            const signature = Secp256k1.sign(hash, this.privateKey);
            return new SignedTransactionRequest({
                blockRef: transactionRequest.blockRef,
                chainTag: transactionRequest.chainTag,
                clauses: transactionRequest.clauses,
                dependsOn: transactionRequest.dependsOn,
                expiration: transactionRequest.expiration,
                gas: transactionRequest.gas,
                gasPriceCoef: transactionRequest.gasPriceCoef,
                nonce: transactionRequest.nonce,
                isSponsored: transactionRequest.isSponsored,
                maxFeePerGas: transactionRequest.maxFeePerGas,
                maxPriorityFeePerGas: transactionRequest.maxPriorityFeePerGas,
                origin: this.address,
                originSignature: signature,
                signature
            });
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): SignedTransactionRequest`,
            'void private key'
        );
    }

    private sponsorTransactionRequest(
        signedTransactionRequest: SignedTransactionRequest
    ): SponsoredTransactionRequest {
        if (this.privateKey !== null) {
            if (signedTransactionRequest.isSponsored) {
                const hash = Blake2b256.of(
                    nc_utils.concatBytes(
                        Blake2b256.of(
                            RLPCodecTransactionRequest.encodeTransactionRequest(
                                signedTransactionRequest
                            )
                        ).bytes,
                        signedTransactionRequest.origin.bytes
                    )
                ).bytes;
                const gasPayerSignature = Secp256k1.sign(hash, this.privateKey);
                return new SponsoredTransactionRequest({
                    blockRef: signedTransactionRequest.blockRef,
                    chainTag: signedTransactionRequest.chainTag,
                    clauses: signedTransactionRequest.clauses,
                    dependsOn: signedTransactionRequest.dependsOn,
                    expiration: signedTransactionRequest.expiration,
                    gas: signedTransactionRequest.gas,
                    gasPriceCoef: signedTransactionRequest.gasPriceCoef,
                    nonce: signedTransactionRequest.nonce,
                    isSponsored: true,
                    maxFeePerGas: signedTransactionRequest.maxFeePerGas,
                    maxPriorityFeePerGas: signedTransactionRequest.maxPriorityFeePerGas,
                    origin: signedTransactionRequest.origin,
                    originSignature: signedTransactionRequest.originSignature,
                    gasPayer: this.address,
                    gasPayerSignature,
                    signature: nc_utils.concatBytes(
                        signedTransactionRequest.originSignature,
                        gasPayerSignature
                    )
                });
            }
            throw new InvalidPrivateKeyError(
                `${FQP}PrivateKeySigner.sign(signedTransactionRequest: SignedTransactionRequest): DelegatedSignedTransactionRequest`,
                'void private key'
            );
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(signedTransactionRequest: SignedTransactionRequest): DelegatedSignedTransactionRequest`,
            'void private key'
        );
    }

    public sign(
        transactionRequest: TransactionRequest | SignedTransactionRequest
    ): SignedTransactionRequest | SponsoredTransactionRequest {
        if (transactionRequest instanceof SignedTransactionRequest) {
            return this.sponsorTransactionRequest(transactionRequest);
        }
        return this.signTransactionRequest(transactionRequest);
    }

    void(): void {
        if (this.privateKey !== null) {
            this.privateKey.fill(0);
        }
        this.privateKey = null;
    }
}

export { PrivateKeySigner };
