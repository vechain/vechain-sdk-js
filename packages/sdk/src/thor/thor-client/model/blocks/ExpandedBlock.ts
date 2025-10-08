import type { ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import type { TxWithReceipt } from '@thor/thorest/transactions/model';

import { BaseBlock } from './BaseBlock';
import { BlockTransaction } from './transaction/BlockTransaction';

class ExpandedBlock extends BaseBlock {
    readonly transactions: BlockTransaction[];

    private constructor(response: ExpandedBlockResponse) {
        super(BaseBlock.snapshotFromResponse(response));
        this.transactions = response.transactions.map((tx: TxWithReceipt) =>
            BlockTransaction.fromThorest(tx)
        );
    }

    public static fromResponse(
        response: ExpandedBlockResponse | null
    ): ExpandedBlock | null {
        return response === null ? null : new ExpandedBlock(response);
    }
}

export { ExpandedBlock };
