import { type Hex, HexUInt32 } from '@common/vcdm';
import { type HttpClient } from '@common/http';
import { RetrieveTransactionQuery } from './RetrieveTransactionQuery';
import { RetrieveTransactionPath } from './RetrieveTransactionPath';
import {
    GetRawTxResponse,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type GetRawTxResponseJSON } from '@thor/thorest/json';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';
import { InvalidThorestRequestError } from '@common/errors';

/**
 * [Retrieve a transaction by ID](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get).
 *
 * This request to Thor endpoint allows you to retrieve a transaction in its raw hexadecimal form, identified by its ID.
 */
class RetrieveRawTransactionByID implements ThorRequest<
    RetrieveRawTransactionByID,
    GetRawTxResponse | null
> {
    /**
     * Represents the HTTP path configuration for a specific API endpoint.
     */
    readonly path: RetrieveTransactionPath;

    /**
     * Represents the HTTP query configuration for a specific API endpoint.
     */
    readonly query: Query;

    /**
     * Constructs a new instance of the class.
     *
     * @param {RetrieveTransactionPath} path - The path object used to retrieve the transaction.
     * @param {Query} query - The query parameters associated with the transaction retrieval.
     * @return {void} Does not return a value.
     */
    constructor(path: RetrieveTransactionPath, query: Query) {
        this.path = path;
        this.query = query;
    }

    /**
     * Sends a request to retrieve a raw transaction by its ID using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client used to send the request.
     * @return {Promise<ThorResponse<RetrieveRawTransactionByID, GetRawTxResponse | null>>}
     * A promise that resolves with the ThorResponse object containing the requested raw transaction, or null if the response is not valid.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveRawTransactionByID, GetRawTxResponse | null>
    > {
        const fqp = 'RetrieveRawTransactionByID.askTo';
        // do http get request - this will throw an error if the request fails
        const response = await httpClient.get(this.path, this.query);

        // parse the nullable response - this will throw an error if the response cannot be parsed
        const rawTxResponse = await parseResponseHandler<
            GetRawTxResponse,
            GetRawTxResponseJSON
        >(fqp, response, GetRawTxResponse);

        // return the response
        return {
            request: this,
            response: rawTxResponse
        };
    }

    /**
     * Creates an instance of RetrieveRawTransactionByID using the provided transaction ID.
     *
     * @param {Hex} txId - The hexadecimal transaction ID used to retrieve the raw transaction.
     * @return {RetrieveRawTransactionByID} An instance of RetrieveRawTransactionByID created using the given transaction ID.
     * @throws {InvalidThorestRequestError} If the transaction ID is invalid or an error occurs during processing.
     */
    static of(txId: Hex): RetrieveRawTransactionByID {
        try {
            return new RetrieveRawTransactionByID(
                new RetrieveTransactionPath(HexUInt32.of(txId)),
                new Query(undefined, false)
            );
        } catch (error) {
            throw new InvalidThorestRequestError(
                `RetrieveRawTransactionByID.of`,
                'Invalid transaction ID.',
                {
                    txId
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Updates the query with a specific head value and returns a new instance of RetrieveRawTransactionByID.
     *
     * @param {Hex} [head] - The head value to use for querying. Optional.
     * @return {RetrieveRawTransactionByID} - A new instance of RetrieveRawTransactionByID with the updated query.
     * @throws {InvalidThorestRequestError} - Throws an error if the `head` value is invalid.
     */
    withHead(head?: Hex): RetrieveRawTransactionByID {
        try {
            return new RetrieveRawTransactionByID(
                this.path,
                new Query(head, this.query.pending)
            );
        } catch (error) {
            throw new InvalidThorestRequestError(
                `RetrieveRawTransactionByID.withHead`,
                'Invalid head value.',
                {
                    head
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     *
     * Configures the current transaction query to include or exclude unconfirmed transactions (pending status).
     *
     * @param {boolean} [pending=true] - A boolean value indicating whether to include unconfirmed transactions. Defaults to true.
     * @return {RetrieveRawTransactionByID} An instance of RetrieveRawTransactionByID with the updated query configuration.
     */
    withPending(pending: boolean = true): RetrieveRawTransactionByID {
        return new RetrieveRawTransactionByID(
            this.path,
            new Query(this.query.head, pending)
        );
    }
}

/**
 * The Query class extends the RetrieveTransactionQuery class to construct
 * a query string for fetching transactions based on specific parameters.
 */
class Query extends RetrieveTransactionQuery {
    get query(): string {
        const head = this.head === undefined ? '' : `${this.head}&`;
        return `?${head}pending=${this.pending}&raw=true`;
    }
}

export { RetrieveRawTransactionByID };
