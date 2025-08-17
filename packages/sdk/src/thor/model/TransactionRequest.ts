import { type Clause } from '@thor';
import { type Hex } from '@vcdm';
import { type TransactionRequestJSON } from '@thor/json';

class TransactionRequest {
    public readonly blockRef: Hex; // RLP 2
    public readonly chainTag: number; // RLP 1
    public readonly clauses: Clause[]; // RLP 4
    public readonly dependsOn: Hex | null; // RLP 7
    public readonly expiration: number; // RLP 3
    public readonly gas: bigint; // RLP 6
    public readonly gasPriceCoef: bigint; // RLP 5
    public readonly nonce: number; // RLP 8

    // eslint-disable-next-line sonarjs/sonar-max-params
    public constructor(
        blockRef: Hex,
        chainTag: number,
        clauses: Clause[],
        expiration: number,
        gas: bigint,
        gasPriceCoef: bigint,
        nonce: number,
        dependsOn: Hex | null
    ) {
        this.blockRef = blockRef;
        this.chainTag = chainTag;
        this.clauses = clauses;
        this.dependsOn = dependsOn;
        this.expiration = expiration;
        this.gas = gas;
        this.gasPriceCoef = gasPriceCoef;
        this.nonce = nonce;
    }

    toJSON(): TransactionRequestJSON {
        return {
            blockRef: this.blockRef.toString(),
            chainTag: this.chainTag,
            clauses: this.clauses.map((clause) => clause.toJSON()),
            dependsOn:
                this.dependsOn !== null ? this.dependsOn.toString() : null,
            expiration: this.expiration,
            gas: this.gas,
            gasPriceCoef: this.gasPriceCoef,
            nonce: this.nonce
        };
    }

    public isDelegated(): boolean {
        return false;
    }

    public isSigned(): boolean {
        return false;
    }
}

export { TransactionRequest };
