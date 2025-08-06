import { Clause } from '@thor';
import { IllegalArgumentError } from '@errors';
import { type ClauseJSON } from '@thor/json';
import { type TransactionRequestJSON } from '@thor/json/TransactionRequestJSON';
import { type Hex, HexUInt, HexUInt32 } from '@vcdm';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/model/TransactionRequest.ts!';

class TransactionRequest {
    readonly blockRef: Hex;
    readonly chatTag: number;
    readonly clauses: Clause[];
    readonly dependsOn: Hex | null;
    readonly features: number | null;
    readonly expiration: number;
    readonly gas: bigint;
    readonly gasPrice: bigint;
    readonly gasPriceCoef: bigint;
    readonly nonce: number;
    readonly reserved: Uint8Array[] | null;

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
                HexUInt.of(HexUInt.of(json.blockRef).digits.slice(0, 16)),
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
