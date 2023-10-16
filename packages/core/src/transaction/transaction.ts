import { type TransactionBody } from './types';

/**
 * Transaction class
 */
class Transaction {
    /**
     * Transaction body
     */
    body: TransactionBody;

    /**
     * Constructor with parameters.
     *
     * @param body - Transaction body
     */
    constructor(body: TransactionBody) {
        this.body = body;
    }
}

export { Transaction };
