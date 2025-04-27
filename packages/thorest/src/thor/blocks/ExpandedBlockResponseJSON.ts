import { type BlockJSON } from './BlockJSON';
import { type _ReceiptJSON } from './_ReceiptJSON';

/**
 * [ExpandedBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 */
interface ExpandedBlockResponseJSON extends BlockJSON {
    readonly isTrunk: boolean; // boolean
    readonly isFinalized: boolean; // boolean
    readonly transactions: _ReceiptJSON[]; // Receipt[]
}

export { type ExpandedBlockResponseJSON };
