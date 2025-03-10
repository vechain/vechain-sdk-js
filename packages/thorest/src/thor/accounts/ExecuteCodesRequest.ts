import { Clause, type ClauseJSON } from '../transactions';
import { Address, BlockRef, Gas, UInt, Units, VTHO } from '@vechain/sdk-core';

class ExecuteCodesRequest {
    readonly provedWork?: string;
    readonly gasPayer?: Address;
    readonly expiration?: UInt;
    readonly blockRef?: BlockRef;
    readonly clauses?: Clause[];
    readonly gas?: Gas;
    readonly gasPrice?: VTHO;
    readonly caller?: Address;

    constructor(json: ExecuteCodesRequestJSON) {
        this.provedWork = json.provedWork;
        this.gasPayer =
            json.gasPayer === undefined ? undefined : Address.of(json.gasPayer);
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
                      (clauseJSON: ClauseJSON): Clause => new Clause(clauseJSON)
                  );
        this.gas = json.gas === undefined ? undefined : Gas.of(json.gas);
        this.gasPrice =
            json.gasPrice === undefined
                ? undefined
                : VTHO.of(json.gasPrice, Units.wei);
        this.caller =
            json.caller === undefined ? undefined : Address.of(json.caller);
    }

    toJSON(): ExecuteCodesRequestJSON {
        return {
            provedWork: this.provedWork,
            gasPayer: this.gasPayer?.toString(),
            expiration: this.expiration?.valueOf(),
            blockRef: this.blockRef?.toString(),
            clauses: this.clauses?.map((clause: Clause) => clause.toJSON()),
            gas: this.gas === undefined ? undefined : this.gas.valueOf(),
            gasPrice:
                this.gasPrice === undefined
                    ? undefined
                    : this.gasPrice.wei.toString(),
            caller: this.caller?.toString()
        } satisfies ExecuteCodesRequestJSON;
    }
}

class ExecuteCodesRequestJSON {
    provedWork?: string;
    gasPayer?: string;
    expiration?: number;
    blockRef?: string;
    clauses?: ClauseJSON[];
    gas?: number;
    gasPrice?: string;
    caller?: string;
}

export { ExecuteCodesRequest, type ExecuteCodesRequestJSON };
