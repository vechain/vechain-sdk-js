import { Address, BlockId, TxId, UInt } from '@vechain/sdk-core';

class LogMeta {
    readonly blockID: BlockId;
    readonly blockNumber: UInt;
    readonly blockTimestamp: UInt;
    readonly txID: TxId;
    readonly txOrigin: Address;
    readonly clauseIndex: UInt;
    readonly txIndex: UInt;
    readonly logIndex: UInt;

    constructor(json: LogMetaJSON) {
        this.blockID = BlockId.of(json.blockID);
        this.blockNumber = UInt.of(Number(json.blockNumber));
        this.blockTimestamp = UInt.of(Number(json.blockTimestamp));
        this.txID = TxId.of(json.txID);
        this.txOrigin = Address.of(json.txOrigin);
        this.clauseIndex = UInt.of(Number(json.clauseIndex));
        this.txIndex = UInt.of(Number(json.txIndex));
        this.logIndex = UInt.of(Number(json.logIndex));
    }

    toJSON(): LogMetaJSON {
        return {
            blockID: this.blockID.toString(),
            blockNumber: this.blockNumber.valueOf(),
            blockTimestamp: this.blockTimestamp.valueOf(),
            txID: this.txID.toString(),
            txOrigin: this.txOrigin.toString(),
            clauseIndex: this.clauseIndex.valueOf(),
            txIndex: this.txIndex.valueOf(),
            logIndex: this.logIndex.valueOf()
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
    txIndex: number;
    logIndex: number;
}

export { LogMeta, type LogMetaJSON };
