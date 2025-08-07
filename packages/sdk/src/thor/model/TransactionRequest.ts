import { Clause } from '@thor';
import { IllegalArgumentError } from '@errors';
import { type ClauseJSON } from '@thor/json';
import { type TransactionRequestJSON } from '@thor/json/TransactionRequestJSON';
import { BlockRef, type Hex, HexUInt32 } from '@vcdm';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/model/TransactionRequest.ts!';

class TransactionRequest {
    readonly blockRef: Hex; // RLP 2
    readonly chatTag: number; // RLP 1
    readonly clauses: Clause[]; // RLP 4
    readonly dependsOn: Hex | null; // RLP 7
    readonly features: number | null; // RLP 9.1
    readonly expiration: number; // RLP 3
    readonly gas: bigint; // RLP 6
    readonly gasPrice: bigint;
    readonly gasPriceCoef: bigint; // RLP 5
    readonly nonce: number; // RLP 8
    readonly reserved: Uint8Array[] | null; // RLP 9.2

    // eslint-disable-next-line sonarjs/sonar-max-params
    constructor(
        blockRef: Hex,
        chatTag: number,
        clauses: Clause[],
        dependsOn: Hex | null,
        features: number | null,
        expiration: number,
        gas: bigint,
        gasPrice: bigint,
        gasPriceCoef: bigint,
        nonce: number,
        reserved: Uint8Array[] | null
    ) {
        this.blockRef = blockRef;
        this.chatTag = chatTag;
        this.clauses = clauses;
        this.dependsOn = dependsOn;
        this.features = features;
        this.expiration = expiration;
        this.gas = gas;
        this.gasPrice = gasPrice;
        this.gasPriceCoef = gasPriceCoef;
        this.nonce = nonce;
        this.reserved = reserved;
    }

    static of(json: TransactionRequestJSON): TransactionRequest {
        try {
            return new TransactionRequest(
                BlockRef.of(json.blockRef),
                json.chatTag,
                json.clauses.map(
                    (clause: ClauseJSON): Clause => new Clause(clause)
                ),
                json.dependsOn === null || json.dependsOn === undefined
                    ? null
                    : HexUInt32.of(json.dependsOn),
                json.features ?? null,
                json.expiration,
                json.gas,
                json.gasPrice,
                json.gasPriceCoef,
                json.nonce,
                json.reserved ?? null
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(json: TransactionRequestJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    public isDelegated(): boolean {
        return false;
    }

    public isSigned(): boolean {
        return false;
    }
}

export { TransactionRequest };
