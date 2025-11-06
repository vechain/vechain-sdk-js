import type { ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import type { TxWithReceipt } from '@thor/thorest/transactions/model';
import { BaseBlock } from './BaseBlock';
import { BlockTransaction } from './BlockTransaction';

/**
 * An expanded block that contains full transaction details.
 */
class ExpandedBlock extends BaseBlock {
    readonly transactions: BlockTransaction[];
    private readonly _response: ExpandedBlockResponse;

    /**
     * Constructs a new instance of the class from the thorest response.
     *
     * @param {ExpandedBlockResponse} response - The thorest response to construct the instance from.
     */
    private constructor(response: ExpandedBlockResponse) {
        super(BaseBlock.snapshotFromResponse(response));
        this.transactions = response.transactions.map((tx: TxWithReceipt) =>
            BlockTransaction.fromThorest(tx)
        );
        this._response = response;
    }

    /**
     * Creates a new instance of the class from the thorest response.
     *
     * @param {ExpandedBlockResponse | null} response - The thorest response to construct the instance from.
     * @returns {ExpandedBlock | null} A new instance of the class.
     */
    public static fromResponse(
        response: ExpandedBlockResponse | null
    ): ExpandedBlock | null {
        return response === null ? null : new ExpandedBlock(response);
    }
}

export { ExpandedBlock };
