import { Clause, type ClauseJSON } from '@thor';
import {
    Address,
    BlockRef,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { ExecuteCodesRequestJSON } from './ExecuteCodesRequestJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/ExecuteCodesRequest.ts!';

class ExecuteCodesRequest {
    readonly provedWork?: string;
    readonly gasPayer?: Address;
    readonly expiration?: UInt;
    readonly blockRef?: BlockRef;
    readonly clauses?: Clause[];
    readonly gas?: bigint;
    readonly gasPrice?: bigint;
    readonly caller?: Address;

    constructor(json: ExecuteCodesRequestJSON) {
        try {
            this.provedWork = json.provedWork;
            this.gasPayer =
                json.gasPayer === undefined
                    ? undefined
                    : Address.of(json.gasPayer);
            this.expiration =
                json.expiration === undefined
                    ? undefined
                    : UInt.of(json.expiration);
            this.blockRef =
                json.blockRef === undefined
                    ? undefined
                    : BlockRef.of(json.blockRef);
            this.clauses =
                json.clauses === undefined
                    ? undefined
                    : json.clauses.map(
                          (clauseJSON: ClauseJSON): Clause =>
                              new Clause(clauseJSON)
                      );
            this.gas = json.gas === undefined ? undefined : BigInt(json.gas);
            this.gasPrice = json.gasPrice === undefined ? undefined : BigInt(json.gasPrice);
            this.caller =
                json.caller === undefined ? undefined : Address.of(json.caller);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ExecuteCodesRequestJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    toJSON(): ExecuteCodesRequestJSON {
        return {
            provedWork: this.provedWork,
            gasPayer: this.gasPayer?.toString(),
            expiration: this.expiration?.valueOf(),
            blockRef: this.blockRef?.toString(),
            clauses: this.clauses?.map((clause: Clause) => clause.toJSON()),
            gas: this.gas === undefined ? undefined : Number(this.gas),
            gasPrice: this.gasPrice === undefined ? undefined : this.gasPrice.toString(),
            caller: this.caller?.toString()
        } satisfies ExecuteCodesRequestJSON;
    }
}

export { ExecuteCodesRequest };
