import { Clause, type ClauseJSON } from './Clause';
import { TxMeta, type TxMetaJSON } from './TxMeta';
import { Address, BlockId, VTHO } from '@vechain/sdk-core';

import { Nonce } from '../../../../core/src/vcdm/Nonce';
import { TxId } from '../../../../core/src/vcdm/BlockId';
import { UInt } from '../../../../core/src/vcdm/UInt';

class GetTxResponse {
    readonly id: TxId;
    readonly origin: Address;
    readonly delegator?: Address;
    readonly size: UInt;
    readonly chainTag: UInt;
    readonly blockRef: BlockId;
    readonly expiration: UInt;
    readonly clauses: Clause[];
    readonly gasPriceCoef: UInt;
    readonly gas: VTHO;
    readonly dependsOn?: TxId;
    readonly nonce: Nonce;
    readonly meta: TxMeta;

    constructor(json: GetTxResponseJSON) {
        this.id = TxId.of(json.id);
        this.origin = Address.of(json.origin);
        this.delegator =
            json.delegator !== undefined
                ? Address.of(json.delegator)
                : undefined;
        this.size = UInt.of(json.size);
        this.chainTag = UInt.of(json.chainTag);
        this.blockRef = BlockId.of(json.blockRef);
        this.expiration = UInt.of(json.expiration);
        this.clauses = json.clauses.map((clauseJSON: ClauseJSON) => {
            return new Clause(clauseJSON);
        });
        this.gasPriceCoef = UInt.of(json.gasPriceCoef);
        this.gas = VTHO.of(json.gas);
        this.dependsOn =
            json.dependsOn !== undefined ? TxId.of(json.dependsOn) : undefined;
        this.nonce = Nonce.of(json.nonce);
        this.meta = new TxMeta(json.meta);
    }

    toJSON(): GetTxResponseJSON {
        return {
            id: this.id.toString(),
            origin: this.origin.toString(),
            delegator: this.delegator?.toString(),
            size: this.size.valueOf(),
            chainTag: this.chainTag.valueOf(),
            blockRef: this.blockRef.toString(),
            expiration: this.expiration.valueOf(),
            clauses: this.clauses.map((clause) => clause.toJSON()),
            gasPriceCoef: this.gasPriceCoef.valueOf(),
            gas: Number(this.gas.wei),
            dependsOn: this.dependsOn?.toString(),
            nonce: this.nonce.toString(),
            meta: this.meta.toJSON()
        } satisfies GetTxResponseJSON;
    }
}

interface GetTxResponseJSON {
    id: string;
    origin: string;
    delegator?: string;
    size: number;
    chainTag: number;
    blockRef: string;
    expiration: number;
    clauses: ClauseJSON[];
    gasPriceCoef: number;
    gas: number;
    dependsOn?: string;
    nonce: string;
    meta: TxMetaJSON;
}

export { GetTxResponse, type GetTxResponseJSON };
