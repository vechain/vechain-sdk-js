import { type TxWithReceiptJSON, type BlockJSON } from '@thor/json';

/**
 * [ExpandedBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 */
interface ExpandedBlockResponseJSON extends BlockJSON {
    readonly isTrunk: boolean; // boolean
    readonly isFinalized: boolean; // boolean
    readonly transactions: TxWithReceiptJSON[]; // Receipt[]
}

export { type ExpandedBlockResponseJSON };
