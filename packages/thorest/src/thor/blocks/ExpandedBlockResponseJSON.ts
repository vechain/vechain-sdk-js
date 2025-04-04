import { type BlockJSON } from './BlockJSON';
import { type ReceiptJSON } from '../transactions';

/**
 * [ExpandedBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 */
interface ExpandedBlockResponseJSON extends BlockJSON {
    readonly isTrunk: boolean; // boolean
    readonly isFinalized: boolean; // boolean
    readonly transactions: ReceiptJSON[]; // Receipt[]
}

export { type ExpandedBlockResponseJSON };
