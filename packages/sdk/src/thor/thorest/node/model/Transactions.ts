import { Tx } from '@thor/thorest/transactions/model';
import { type TxJSON, type TransactionsJSON } from '@thor/thorest/json';
import { InvalidThorestResponseError } from '@common/errors';

/**
 * [TransactionsIDs](http://localhost:8669/doc/stoplight-ui/#/schemas/TransactionsIDs)
 */
class Transactions extends Array<Tx> {
    /**
     * Initializes a new instance of the class with the provided TransactionsJSON.
     *
     * @param {TransactionsJSON} json The JSON object representing transactions to parse into a Transactions instance.
     * @throws {InvalidThorestResponseError} If the provided JSON cannot be properly parsed.
     */
    constructor(json: TransactionsJSON) {
        try {
            super();
            return Object.setPrototypeOf(
                json ?? [],
                (txJSON: TxJSON): Tx => new Tx(txJSON)
            ) as Transactions;
        } catch (error) {
            throw new InvalidThorestResponseError(
                `Transactions.constructor`,
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
