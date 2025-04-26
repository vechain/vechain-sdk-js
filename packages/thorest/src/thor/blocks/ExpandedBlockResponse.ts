import { Block } from './Block';
import { Receipt, type ReceiptJSON } from '../transactions';
import { type ExpandedBlockResponseJSON } from './ExpandedBlockResponseJSON';
import { IllegalArgumentError } from '@vechain/sdk-core';

const FQP = 'packages/thorest/src/thor/blocks/ExpandedBlockResponse.ts!';

/**
 * [ExpandedBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse).
 */
class ExpandedBlockResponse extends Block {
    /**
     * Whether the block is trunk (true) or not (false).
     */
    readonly isTrunk: boolean;

    /**
     * Whether the block has been finalized (true) or not (false).
     */
    readonly isFinalized: boolean;

    /**
     * All included transactions, expanded to include their receipts.
     */
    readonly transactions: Receipt[];

    /**
     * Initializes an instance of the class using the provided JSON object.
     *
     * @param {ExpandedBlockResponseJSON} json - The JSON object used to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object is invalid or if an error occurs during parsing.
     */
    constructor(json: ExpandedBlockResponseJSON) {
        try {
            super(json);
            this.isTrunk = json.isTrunk;
            this.isFinalized = json.isFinalized;
            this.transactions = json.transactions.map(
                (transaction: ReceiptJSON): Receipt => new Receipt(transaction)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ExpandedBlockResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { ExpandedBlockResponse };
