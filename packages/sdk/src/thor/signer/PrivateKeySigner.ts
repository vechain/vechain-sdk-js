import { Address, Blake2b256 } from '@vcdm';
import { InvalidPrivateKeyError } from '@errors';
import { RLPCodecTransactionRequest } from './RLPCodecTransactionRequest';
import { Secp256k1 } from '@secp256k1';
import { type Signer } from './Signer';
import { SignedTransactionRequest, type TransactionRequest } from '@thor';

const FQP = 'packages/sdk/src/signer/PrivateKeySigner.ts!';

class PrivateKeySigner implements Signer {
    private privateKey: Uint8Array | null = null;

    public readonly address: Address;

    constructor(privateKey: Uint8Array) {
        // Defensive copies to avoid external mutation.
        this.privateKey = new Uint8Array(privateKey);
        this.address = Address.ofPrivateKey(privateKey);
    }

    public sign(
        transactionRequest: TransactionRequest
    ): SignedTransactionRequest {
        if (this.privateKey !== null) {
            const messageHash = Blake2b256.of(
                RLPCodecTransactionRequest.encode(transactionRequest)
            ).bytes;
            const signature = Secp256k1.sign(messageHash, this.privateKey);
            return new SignedTransactionRequest(
                transactionRequest.blockRef,
                transactionRequest.chainTag,
                transactionRequest.clauses,
                transactionRequest.expiration,
                transactionRequest.gas,
                transactionRequest.gasPriceCoef,
                transactionRequest.nonce,
                transactionRequest.dependsOn,
                this.address,
                signature,
                signature
            );
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): SignedTransactionRequest`,
            'void private key'
        );
    }

    void(): void {
        if (this.privateKey !== null) {
            this.privateKey.fill(0);
        }
        this.privateKey = null;
    }
}

export { PrivateKeySigner };
