import { type Clause } from '@thor';
import { type Address, type Hex } from '@vcdm';
import { type DelegatedSignedTransactionRequestJSON } from '@thor/json';
import { SignedTransactionRequest } from './SignedTransactionRequest';

class DelegatedSignedTransactionRequest extends SignedTransactionRequest {
    public readonly gasPayer: Address;
    public readonly gasPayerSignature: Uint8Array;

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
        gasPayer: Address,
        gasPayerSignature: Uint8Array,
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
            dependsOn,
            origin,
            originSignature,
            signature
        );
        this.gasPayer = gasPayer;
        this.gasPayerSignature = gasPayerSignature;
    }

    public isDelegated(): boolean {
        return true;
    }

    public toJSON(): DelegatedSignedTransactionRequestJSON {
        return {
            ...super.toJSON(),
            gasPayer: this.gasPayer.toString(),
            gasPayerSignature: this.gasPayerSignature
        };
    }
}

export { DelegatedSignedTransactionRequest };
