import { Clause, type ClauseJSON } from './Clause';
import { TxMeta, type TxMetaJSON } from './TxMeta';
import {
    Address,
    BlockId,
    Nonce,
    TxId,
    UInt,
    Units,
    VTHO
} from '@vechain/sdk-core';

class GetTxResponse {
    readonly id: TxId;
    readonly origin: Address;
    readonly delegator: Address | null;
    readonly size: UInt;
    readonly chainTag: UInt;
    readonly blockRef: BlockId;
    readonly expiration: UInt;
    readonly clauses: Clause[];
    readonly gasPriceCoef: UInt;
    readonly gas: VTHO;
    readonly dependsOn?: TxId | null;
    readonly nonce: Nonce;
    readonly meta: TxMeta;

    constructor(json: GetTxResponseJSON) {
        this.id = TxId.of(json.id);
        this.origin = Address.of(json.origin);
        this.delegator =
            json.delegator !== null ? Address.of(json.delegator) : null;
        this.size = UInt.of(json.size);
        this.chainTag = UInt.of(json.chainTag);
        this.blockRef = BlockId.of(json.blockRef);
        this.expiration = UInt.of(json.expiration);
        this.clauses = json.clauses.map((clauseJSON: ClauseJSON) => {
            return new Clause(clauseJSON);
        });
        this.gasPriceCoef = UInt.of(json.gasPriceCoef);
        // Each unit of gas is equal to 10^-5 VTHO (= 10^13 wei)
        this.gas = VTHO.of(json.gas * Math.pow(10, 13), Units.wei);
        this.dependsOn =
            json.dependsOn !== undefined && json.dependsOn !== null
                ? TxId.of(json.dependsOn)
                : undefined;
        this.nonce = Nonce.of(json.nonce);
        this.meta = new TxMeta(json.meta);
    }

    toJSON(): GetTxResponseJSON {
        return {
            id: this.id.toString(),
            origin: this.origin.toString(),
            delegator:
                this.delegator != null ? this.delegator.toString() : null,
            size: this.size.valueOf(),
            chainTag: this.chainTag.valueOf(),
            blockRef: this.blockRef.toString(),
            expiration: this.expiration.valueOf(),
            clauses: this.clauses?.map((clause) => clause.toJSON()),
            gasPriceCoef: this.gasPriceCoef.valueOf(),
            // We convert back to gas units
            gas: parseInt((this.gas.n * Math.pow(10, 5)).toString()),
            dependsOn:
                this.dependsOn !== undefined && this.dependsOn !== null
                    ? this.dependsOn.toString()
                    : undefined,
            nonce: this.nonce.toString(),
            meta: this.meta.toJSON()
        } satisfies GetTxResponseJSON;
    }
}

interface GetTxResponseJSON {
    id: string;
    origin: string;
    delegator: string | null; // The end point at https://mainnet.vechain.org/doc/stoplight-ui/#/schemas/GetTxResponse specifically returns `null`.
    size: number;
    chainTag: number;
    blockRef: string;
    expiration: number;
    clauses: ClauseJSON[];
    gasPriceCoef: number;
    gas: number;
    dependsOn?: string | null;
    nonce: string;
    meta: TxMetaJSON;
}

export { GetTxResponse, type GetTxResponseJSON };
