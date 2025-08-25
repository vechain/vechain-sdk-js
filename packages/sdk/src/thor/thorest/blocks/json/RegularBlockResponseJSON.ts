import { type BlockJSON } from '@thor/thorest/json';

/**
 * [RegularBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/RegularBlockResponse)
 */
interface RegularBlockResponseJSON extends BlockJSON {
    isTrunk: boolean;
    isFinalized: boolean;
    transactions: string[]; // hex hash
}

export { type RegularBlockResponseJSON };
