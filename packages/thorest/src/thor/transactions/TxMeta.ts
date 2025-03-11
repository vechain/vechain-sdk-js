import { BlockId, UInt } from '@vechain/sdk-core';

class TxMeta {
    readonly blockID: BlockId;
    readonly blockNumber: UInt;
    readonly blockTimestamp: UInt;

    constructor(json: TxMetaJSON) {
        this.blockID = BlockId.of(json.blockID);
        this.blockNumber = UInt.of(json.blockNumber);
        this.blockTimestamp = UInt.of(json.blockTimestamp);
    }

    toJSON(): TxMetaJSON {
        return {
            blockID: this.blockID.toString(),
            blockNumber: this.blockNumber.valueOf(),
            blockTimestamp: this.blockTimestamp.valueOf()
        } satisfies TxMetaJSON;
    }
}

interface TxMetaJSON {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
}

export { TxMeta, type TxMetaJSON };
