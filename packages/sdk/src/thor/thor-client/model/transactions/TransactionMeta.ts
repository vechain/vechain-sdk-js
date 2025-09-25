import { type Hex } from '@common/vcdm';
import { type TxMetaResponse } from '@thor/thorest/transactions/model';

class TransactionMeta {
    /**
     * The block identifier in which the transaction was included.
     */
    readonly blockID: Hex;

    /**
     * The block number (height) of the block in which the transaction was included.
     */
    readonly blockNumber: number;

    /**
     * The UNIX timestamp of the block in which the transaction was included.
     */
    readonly blockTimestamp: number;

    /**
     * Creates a new TransactionMeta instance.
     * @param data - The TxMetaResponse to create the TransactionMeta from.
     */
    constructor(data: TxMetaResponse) {
        this.blockID = data.blockID;
        this.blockNumber = data.blockNumber;
        this.blockTimestamp = data.blockTimestamp;
    }
}

export { TransactionMeta };
