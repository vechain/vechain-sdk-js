import { type ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type TxWithReceipt } from '@thor/thorest/transactions/model';
import { BaseBlock } from './BaseBlock';

class ExpandedBlock extends BaseBlock {
    readonly transactions: TxWithReceipt[];

    private constructor(response: ExpandedBlockResponse) {
        super(BaseBlock.snapshotFromResponse(response));
        this.transactions = response.transactions;
    }

    public static fromResponse(
        response: ExpandedBlockResponse | null
    ): ExpandedBlock | null {
        return response === null ? null : new ExpandedBlock(response);
    }
}

export { ExpandedBlock };
