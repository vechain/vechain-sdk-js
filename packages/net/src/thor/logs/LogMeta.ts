import { Address, BlockId } from '@vechain/sdk-core';
import { TxId, UInt } from '../../../../core/src/vcdm';

class LogMeta {
    readonly blockID: BlockId;
    readonly blockNumber: UInt;
    readonly blockTimestamp: UInt;
    readonly txID: TxId;
    readonly txOrigin: Address;
    readonly clauseIndex: UInt;

    constructor(json: LogMetaJSON) {
        this.blockID = BlockId.of(json.blockID);
        this.blockNumber = UInt.of(json.blockNumber);
        this.blockTimestamp = UInt.of(json.blockTimestamp);
        this.txID = TxId.of(json.txID);
        this.txOrigin = Address.of(json.txOrigin);
        this.clauseIndex = UInt.of(json.clauseIndex);
    }

    toJSON(): LogMetaJSON {
        return {
            blockID: this.blockID.toString(),
            blockNumber: this.blockNumber.valueOf(),
            blockTimestamp: this.blockTimestamp.valueOf(),
            txID: this.txID.toString(),
            txOrigin: this.txOrigin.toString(),
            clauseIndex: this.clauseIndex.valueOf()
        } satisfies LogMetaJSON;
    }
}

interface LogMetaJSON {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
    txID: string;
    txOrigin: string;
    clauseIndex: number;
}

export { LogMeta, type LogMetaJSON };
