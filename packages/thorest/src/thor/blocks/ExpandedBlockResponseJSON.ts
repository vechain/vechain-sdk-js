import { type TxWithReceiptJSON } from '@thor';
import { type BlockJSON } from '@thor/blocks/BlockJSON';

/**
 * [ExpandedBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 */
interface ExpandedBlockResponseJSON extends BlockJSON {
    readonly isTrunk: boolean; // boolean
    readonly isFinalized: boolean; // boolean
    readonly transactions: TxWithReceiptJSON[]; // Receipt[]
}

export { type ExpandedBlockResponseJSON };
