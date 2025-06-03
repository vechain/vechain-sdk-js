import { type BlockJSON, type XReceiptJSON } from '@thor';

/**
 * [ExpandedBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 */
interface ExpandedBlockResponseJSON extends BlockJSON {
    readonly isTrunk: boolean; // boolean
    readonly isFinalized: boolean; // boolean
    readonly transactions: XReceiptJSON[]; // Receipt[]
}

export { type ExpandedBlockResponseJSON };
