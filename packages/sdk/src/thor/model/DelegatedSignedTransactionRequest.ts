import { type Clause } from '@thor';
import { type Address, type Hex } from '@vcdm';
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
        isDelegated: boolean,
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
            isDelegated,
            origin,
            originSignature,
            signature
        );
        this.gasPayer = gasPayer;
        this.gasPayerSignature = gasPayerSignature;
    }
}

export { DelegatedSignedTransactionRequest };
