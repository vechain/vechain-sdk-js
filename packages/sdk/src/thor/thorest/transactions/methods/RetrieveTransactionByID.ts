import { type Hex, HexUInt32 } from '@common/vcdm';
import { type HttpClient } from '@common/http';
import {
    RetrieveTransactionPath,
    RetrieveTransactionQuery
} from '@thor/thorest/transactions/methods';
import {
    GetTxResponse,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type GetTxResponseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/transactions/methods/RetrieveTransactionByID.ts!';

/**
 * [Retrieve a transaction by ID](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get)
 *
 * This request to Thor endpoint allows you to retrieve a transaction identified by its ID.
 */
class RetrieveTransactionByID
    implements ThorRequest<RetrieveTransactionByID, GetTxResponse | null>
{
    /**
     * Represents the HTTP path configuration for a specific API endpoint.
     */
    protected readonly path: RetrieveTransactionPath;

    /**
     * Represents the HTTP query configuration for a specific API endpoint.
     */
    protected readonly query: RetrieveTransactionQuery;

    /**
     * Constructs an instance of the class with the specified path and query parameters.
     *
     * @param {RetrieveTransactionPath} path - The object containing the path parameters required to retrieve the transaction by ID.
     * @param {RetrieveTransactionQuery} query - The object containing the query parameters for retrieving transaction details.
     * @return {void}
     */
    protected constructor(
        path: RetrieveTransactionPath,
        query: RetrieveTransactionQuery
    ) {
        this.path = path;
        this.query = query;
    }

    /**
     * Sends a request to retrieve transaction information using the provided HttpClient.
     *
     * @param {HttpClient} httpClient - The HTTP client used to send the request.
     * @return {Promise<ThorResponse<RetrieveTransactionByID, GetTxResponse | null>>}
     * A promise that resolves to a ThorResponse object containing the transaction details or null if unavailable.
     * @throws {ThorError} Throws a ThorError in case of an invalid or unsuccessful response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveTransactionByID, GetTxResponse | null>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveTransactionByID, GetTxResponse|null>>`;
        const response = await httpClient.get(this.path, this.query);
        if (response.ok) {
            const json = (await response.json()) as GetTxResponseJSON | null;
            try {
                return {
                    request: this,
                    response: json === null ? null : new GetTxResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    error instanceof Error ? error.message : 'Bad response.',
                    {
                        url: response.url,
                        body: json
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
     * Creates an instance of RetrieveTransactionByID with the specified transaction ID.
     *
     * @param {Hex} txId - The transaction ID to retrieve the transaction details for.
     * @return {RetrieveTransactionByID} A new instance of RetrieveTransactionByID configured with the specified transaction ID.
     * @throws {IllegalArgumentError} If a `txId` value is provided.
     */
    static of(txId: Hex): RetrieveTransactionByID {
        try {
            return new RetrieveTransactionByID(
                new RetrieveTransactionPath(HexUInt32.of(txId)),
                new RetrieveTransactionQuery(undefined, false)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(txId: Hex): RetrieveTransactionByID`,
                'Invalid transaction ID.',
                {
                    txId
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Sets the head block identifier for the transaction retrieval.
     *
     * @param {Hex} [head] - The block identifier representing the head block to retrieve the transaction from. Optional.
     * @return {RetrieveTransactionByID} A new instance of RetrieveTransactionByID with the specified head block identifier.
     * Best-block is assumed if omitted.
     * @throws {ThorError} If an invalid `head` value is provided.
     */
    withHead(head?: Hex): RetrieveTransactionByID {
        try {
            return new RetrieveTransactionByID(
                this.path,
                new RetrieveTransactionQuery(
                    head === undefined ? undefined : HexUInt32.of(head),
                    this.query.pending
                )
            );
        } catch (error) {
            throw new ThorError(
                `${FQP}withHead(head?: Hex): RetrieveTransactionByID`,
                'Invalid head value.',
                {
                    head
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Updates the pending status of the RetrieveTransactionByID query.
     *
     * @param {boolean} [pending=true] - A boolean value indicating whether to mark the transaction as pending.
     * @return {RetrieveTransactionByID} A new instance of RetrieveTransactionByID with the updated pending status.
     * @throws {ThorError} If an invalid pending value is provided or an error occurs during instantiation.
     */
    withPending(pending: boolean = true): RetrieveTransactionByID {
        try {
            return new RetrieveTransactionByID(
                this.path,
                new RetrieveTransactionQuery(this.query.head, pending)
            );
        } catch (error) {
            throw new ThorError(
                `${FQP}withPending(pending: boolean): RetrieveTransactionByID`,
                'Invalid pending value.',
                {
                    pending
                },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { RetrieveTransactionByID };
