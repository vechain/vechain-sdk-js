import { TransactionRequest } from './TransactionRequest';
import type { Address, Hex } from '@vcdm';
import { type Clause } from '@thor';
import { type SignedTransactionRequestJSON } from '@thor/json';

class SignedTransactionRequest extends TransactionRequest {
    public readonly origin: Address;
    public readonly originSignature: Uint8Array;
    public readonly signature: Uint8Array;

    // eslint-disable-next-line sonarjs/sonar-max-params
    public constructor(
        blockRef: Hex,
        chainTag: number,
        clauses: Clause[],
        expiration: number,
        gas: bigint,
        gasPriceCoef: bigint,
        nonce: number,
        dependsOn: Hex | null,
        origin: Address,
        originSignature: Uint8Array,
        signature: Uint8Array
    ) {
        super(
            blockRef,
            chainTag,
            clauses,
            expiration,
            gas,
            gasPriceCoef,
            nonce,
            dependsOn
        );
        this.origin = origin;
        // Defensive copies to avoid external mutation.
        this.originSignature = new Uint8Array(originSignature);
        this.signature = new Uint8Array(signature);
    }

    public isSigned(): boolean {
        return true;
    }

    public toJSON(): SignedTransactionRequestJSON {
        return {
            ...super.toJSON(),
            origin: this.origin.toString(),
            senderSignature: this.originSignature,
            signature: this.signature
        };
    }
}

export { SignedTransactionRequest };
