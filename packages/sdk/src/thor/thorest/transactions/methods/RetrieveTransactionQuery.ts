import { type HttpQuery } from '@common/http';
import { type HexUInt32 } from '@common/vcdm';

/**
 * Represents a query to retrieve a transaction by its ID, still pending or not.
 * This class is designed to be used with HTTP queries and conforms to the `HttpQuery` interface.
 */
class RetrieveTransactionQuery implements HttpQuery {
    /**
     * Represents an optional hexadecimal unsigned 32-bit integer variable.
     */
    readonly head?: HexUInt32;

    /**
     * Allows you to indicate whether the response should include transactions that are still pending,
     */
    readonly pending: boolean;

    /**
     * Creates an instance of the class.
     *
     * @param {HexUInt32 | undefined} head - The initial value for the head property, which can be a HexUInt32 value or undefined.
     * @param {boolean} pending - Indicates whether the operation is pending.
     */
    constructor(head: HexUInt32 | undefined, pending: boolean) {
        this.head = head;
        this.pending = pending;
    }

    /**
     * Constructs and retrieves a query string based on the object's state.
     *
     * @return {string} A formatted query string starting with a "?" and
     *         including the head property (if defined), along with
     *         "pending" and "raw=false" parameters.
     */
    get query(): string {
        const head = this.head === undefined ? '' : `${this.head}&`;
        return `?${head}pending=${this.pending}&raw=false`;
    }
}

export { RetrieveTransactionQuery };
