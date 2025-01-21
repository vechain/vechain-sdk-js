import { BlockId } from '@vechain/sdk-core';

import { UInt } from '../../../../core/src/vcdm/UInt';

class TxMeta {
    readonly blockID: BlockId;
    readonly blockNumber: UInt;
    readonly blockTimestamp: bigint;

    constructor(json: TxMetaJSON) {
        this.blockID = BlockId.of(json.blockID);
        this.blockNumber = UInt.of(json.blockNumber);
        this.blockTimestamp = json.blockTimestamp;
    }

    toJSON(): TxMetaJSON {
        return {
            blockID: this.blockID.toString(),
            blockNumber: this.blockNumber.valueOf(),
            blockTimestamp: this.blockTimestamp
        } satisfies TxMetaJSON;
    }
}

interface TxMetaJSON {
    blockID: string;
    blockNumber: number;
    blockTimestamp: bigint;
}

export { TxMeta, type TxMetaJSON };
