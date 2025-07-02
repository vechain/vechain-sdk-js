import { type Hex, HexUInt32, IllegalArgumentError } from '@vcdm';
import { type TransactionsIDsJSON } from '@thor';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/node/TransactionsIDs.ts!';

/**
 * [TransactionsIDs](http://localhost:8669/doc/stoplight-ui/#/schemas/TransactionsIDs)
 */
class TransactionsIDs extends Array<Hex> {
    /**
     * Constructs a new instance of the TransactionsIDs class.
     *
     * @param {TransactionsIDsJSON} json - The JSON object containing transaction IDs to initialize the instance.
     * @throws {IllegalArgumentError} If the provided JSON fails to parse into the required structure.
     */
    constructor(json: TransactionsIDsJSON) {
        super();
        try {
            return Object.setPrototypeOf(json ?? [], (txId: string): Hex => {
                return HexUInt32.of(txId);
            }) as TransactionsIDs;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransactionsIDsJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of transaction IDs into a JSON-compatible format.
     *
     * @return {TransactionsIDsJSON} An array of transaction IDs represented as strings in a JSON-compatible format.
     */
    toJSON(): TransactionsIDsJSON {
        return this.map((txId: HexUInt32): string =>
            txId.toString()
        ) satisfies TransactionsIDsJSON;
    }
}

export { TransactionsIDs };
