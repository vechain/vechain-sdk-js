import type { HttpClient, HttpPath, HttpQuery } from '@common/http';
import type { Address } from '@common/vcdm';
import {
    Transactions,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type TransactionsJSON } from '@thor/thorest/json';

/**
 * Full-Qualified-Path
 */
const FQP =
    'packages/core/src/thor/node/RetrieveExpandedTransactionsFromTransactionPool.ts!';

/**
 * [Retrieve transactions from transactions pool](http://localhost:8669/doc/stoplight-ui/#/paths/node-txpool/get)
 */
class RetrieveExpandedTransactionsFromTransactionPool
    implements
        ThorRequest<
            RetrieveExpandedTransactionsFromTransactionPool,
            Transactions
        >
{
    /**
     * An object representing the HTTP path configuration.
     */
    protected static readonly PATH: HttpPath = {
        path: '/node/txpool'
    };

    /**
     * An object representing the HTTP query part.
     */
    protected readonly query: Query;

    /**
     * A protected constructor for initializing the class with the provided Query object.
     *
     * @param {Query} query - The Query instance used to initialize the class.
     */
    protected constructor(query: Query) {
        this.query = query;
    }

    /**
     * Executes a request using the provided HttpClient to retrieve expanded transactions
     * from the transaction pool and returns a processed response.
     *
     * @param {HttpClient} httpClient - The HTTP client instance used to make the GET request.
     * @return {Promise<ThorResponse<RetrieveExpandedTransactionsFromTransactionPool, Transactions>>}
     * A promise that resolves to a ThorResponse containing the fetched transactions data or rejects with an error.
     * @throws ThorError if the request fails or returns an error response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<
            RetrieveExpandedTransactionsFromTransactionPool,
            Transactions
        >
    > {
        const fqp = `${FQP}ask(httpClient: HttpClient): ThorResponse<RetrieveExpandedTransactionsFromTransactionPool, Transactions>`;
        const response = await httpClient.get(
            RetrieveExpandedTransactionsFromTransactionPool.PATH,
            this.query
        );
        if (response.ok) {
            try {
                const json = (await response.json()) as TransactionsJSON;
                return {
                    request: this,
                    response: new Transactions(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    'Bad response.',
                    {
                        url: response.url,
                        body: await response.text()
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        } else {
            throw new ThorError(
                fqp,
                await response.text(),
                {
                    url: response.url
                },
                undefined,
                response.status
            );
        }
    }

    /**
     * Creates a new instance of RetrieveExpandedTransactionsFromTransactionPool using the provided origin address.
     *
     * @param {Address} [origin] - The optional origin address to initialize the query with.
     * @return {RetrieveExpandedTransactionsFromTransactionPool} A new instance of RetrieveExpandedTransactionsFromTransactionPool.
     */
    static of(
        origin?: Address
    ): RetrieveExpandedTransactionsFromTransactionPool {
        return new RetrieveExpandedTransactionsFromTransactionPool(
            new Query(origin)
        );
    }
}

/**
 * Represents an HTTP query with optional origin parameter.
 * This class constructs a query string based on the provided options.
 *
 * Implements the `HttpQuery` interface.
 */
class Query implements HttpQuery {
    /**
     * Represents the origin address associated with a specific entity or transaction.
     * This variable is optional and may not always have a defined value.
     */
    protected readonly origin?: Address;

    /**
     * Creates an instance of the class with an optional origin.
     *
     * @param {Address} [origin] - The initial address to be set as the origin. If not provided, the origin will be undefined.
     */
    constructor(origin?: Address) {
        this.origin = origin;
    }

    /**
     * Generates a query string with optional parameters.
     * Combines a fixed query parameter `expanded=true` and appends an `origin` parameter if it exists.
     *
     * @return {string} The constructed query string.
     */
    get query(): string {
        const origin = this.origin != null ? `&origin=${this.origin}` : '';
        return `?expanded=true${origin}`;
    }
}

export { RetrieveExpandedTransactionsFromTransactionPool };
