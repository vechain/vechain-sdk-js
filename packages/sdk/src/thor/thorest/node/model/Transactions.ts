import { Tx } from '@thor/model';
import { type TxJSON } from '@/json';
import { type TransactionsJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/node/Transactions.ts!';

/**
 * [TransactionsIDs](http://localhost:8669/doc/stoplight-ui/#/schemas/TransactionsIDs)
 */
class Transactions extends Array<Tx> {
    /**
     * Initializes a new instance of the class with the provided TransactionsJSON.
     *
     * @param {TransactionsJSON} json The JSON object representing transactions to parse into a Transactions instance.
     * @throws {IllegalArgumentError} If the provided JSON cannot be properly parsed.
     */
    constructor(json: TransactionsJSON) {
        try {
            super();
            return Object.setPrototypeOf(
                json ?? [],
                (txJSON: TxJSON): Tx => new Tx(txJSON)
            ) as Transactions;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransactionsJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current list of transactions into a JSON-compatible format.
     *
     * @return {TransactionsJSON} An object representation of the transactions where each transaction is serialized as JSON.
     */
    toJSON(): TransactionsJSON {
        return this.map(
            (tx: Tx): TxJSON => tx.toJSON()
        ) satisfies TransactionsJSON;
    }
}

export { Transactions };
