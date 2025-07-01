import { type HttpClient, type HttpPath, type HttpQuery } from '@http';
import { type Address } from '@vechain/sdk-core';
import {
    ThorError,
    type ThorRequest,
    type ThorResponse,
    TransactionsIDs,
    type TransactionsIDsJSON
} from '@thor';

/**
 * Full-Qualified-Path
 */
const FQP =
    'packages/core/src/thor/node/RetrieveTransactionsFromTransactionPool.ts!';

/**
 * [Retrieve transactions from transactions pool](http://localhost:8669/doc/stoplight-ui/#/paths/node-txpool/get)
 */
class RetrieveTransactionsFromTransactionPool
    implements
        ThorRequest<RetrieveTransactionsFromTransactionPool, TransactionsIDs>
{
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
     * Sends a request using the provided HTTP client to retrieve transactions from the transaction pool.
     *
     * @param {HttpClient} httpClient - An HTTP client instance used to send the request.
     * @return {Promise<ThorResponse<RetrieveTransactionsFromTransactionPool, TransactionsIDs>>} A promise that resolves to a ThorResponse containing the retrieved transactions data or a related error.
     * @throws ThorError if the request fails or returns an error response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveTransactionsFromTransactionPool, TransactionsIDs>
    > {
        const fqp = `${FQP}ask(httpClient: HttpClient): ThorResponse<RetrieveTransactionsFromTransactionPool, TransactionsIDs>`;
        const response = await httpClient.get(
            RetrieveTransactionsFromTransactionPool.PATH,
            this.query
        );
        if (response.ok) {
            try {
                const json = (await response.json()) as TransactionsIDsJSON;
                return {
                    request: this,
                    response: new TransactionsIDs(json)
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
     * Creates an instance of RetrieveTransactionsFromTransactionPool using the specified origin.
     *
     * @param {Address} [origin] - The origin address to initialize the query with. This parameter is optional.
     * @return {RetrieveTransactionsFromTransactionPool} A new instance of RetrieveTransactionsFromTransactionPool initialized with the provided query.
     */
    static of(origin?: Address): RetrieveTransactionsFromTransactionPool {
        return new RetrieveTransactionsFromTransactionPool(new Query(origin));
    }
}

/**
 * Represents a Query object that implements the HttpQuery interface.
 * It is used to construct and retrieve query strings based on the provided origin.
 */
class Query implements HttpQuery {
    /**
     * Represents the origin address associated with a specific entity or transaction.
     * This variable is optional and may not always have a defined value.
     */
    protected readonly origin?: Address;

    /**
     * Initializes a new instance of the class with an optional origin address.
     *
     * @param {Address} [origin] - The address to set as the origin. If not provided, the origin will remain undefined.
     */
    constructor(origin?: Address) {
        this.origin = origin;
    }

    /**
     * Constructs a query string based on the internal properties of the instance.
     * The query includes a fixed parameter `expanded=false` and optionally an `origin` parameter
     * if the `origin` property is defined.
     *
     * @return {string} The constructed query string.
     */
    get query(): string {
        const origin =
            this.origin !== undefined ? `&origin=${this.origin}` : '';
        return `?expanded=false${origin}`;
    }
}

export { RetrieveTransactionsFromTransactionPool };
