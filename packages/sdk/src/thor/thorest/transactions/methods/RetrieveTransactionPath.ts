import { type HexUInt32 } from '@common/vcdm';
import { type HttpPath } from '@common/http';

/**
 * Represents an HTTP path for retrieving a transaction by its ID.
 * Implements the HttpPath interface to construct the appropriate URI.
 */
class RetrieveTransactionPath implements HttpPath {
    /**
     * Represents a transaction identifier in the form of a 32-bit unsigned integer, encoded as a hexadecimal string.
     */
    protected readonly txId: HexUInt32;

    /**
     * Constructs an instance of the class with the given transaction ID.
     */
    constructor(txId: HexUInt32) {
        this.txId = txId;
    }

    /**
     * Retrieves the API path for the current transaction based on its transaction ID.
     *
     * @return {string} The API endpoint path for the transaction.
     */
    get path(): string {
        return `/transactions/${this.txId}`;
    }
}

export { RetrieveTransactionPath };
