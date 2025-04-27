import { Block } from './Block';
import { IllegalArgumentError } from '@vechain/sdk-core';
import { _Receipt } from './_Receipt';
import { type ExpandedBlockResponseJSON } from './ExpandedBlockResponseJSON';
import { type _ReceiptJSON } from './_ReceiptJSON';

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
    readonly transactions: _Receipt[];

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
                (transaction: _ReceiptJSON): _Receipt =>
                    new _Receipt(transaction)
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

    /**
     * Converts the current instance of the class into a JSON representation.
     *
     * @return {ExpandedBlockResponseJSON} A JSON object containing the serialized representation of the current instance, including properties such as `isTrunk`, `isFinalized`, and a list of `transactions` as JSON objects.
     */
    toJSON(): ExpandedBlockResponseJSON {
        return {
            ...super.toJSON(),
            isTrunk: this.isTrunk,
            isFinalized: this.isFinalized,
            transactions: this.transactions.map(
                (transaction: _Receipt): _ReceiptJSON => transaction.toJSON()
            )
        };
    }
}

export { ExpandedBlockResponse };
