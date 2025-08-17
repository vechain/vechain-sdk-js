import { Blake2b256 } from '@vcdm';
import { InvalidPrivateKeyError } from '@errors';
import { RLPCodecTransactionRequest } from './RLPCodecTransactionRequest';
import { Secp256k1 } from '@secp256k1';
import { type Signer } from './Signer';
import { type TransactionRequest } from '@thor';

const FQP = 'packages/sdk/src/signer/PrivateKeySigner.ts!';

class PrivateKeySigner implements Signer {
    private privateKey: Uint8Array | null = null;

    constructor(privateKey: Uint8Array) {
        // Defensive copies to avoid external mutation.
        this.privateKey = new Uint8Array(privateKey);
    }

    sign(transactionRequest: TransactionRequest): Uint8Array {
        if (this.privateKey !== null) {
            const messageHash = Blake2b256.of(
                RLPCodecTransactionRequest.encode(transactionRequest)
            ).bytes;
            return Secp256k1.sign(messageHash, this.privateKey);
        }
        throw new InvalidPrivateKeyError(
            `${FQP}PrivateKeySigner.sign(transactionRequest: TransactionRequest): Uint8Array`,
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
