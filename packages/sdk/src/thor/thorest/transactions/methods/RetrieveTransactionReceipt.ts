import { type Hex, HexUInt32 } from '@common/vcdm';
import { type HttpClient, type HttpPath, type HttpQuery } from '@common/http';
import { handleHttpError } from '@thor/thorest/utils';
import {
    GetTxReceiptResponse,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type GetTxReceiptResponseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/transactions/methods/RetrieveTransactionByID.ts!';

/**
 * [Retrieve transaction receipt](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id--receipt/get)
 *
 * This request to Thor endpoint allows you to retrieve the receipt of a transaction identified by its ID.
 * If the transaction is not found, the response will be `null`.
 */
class RetrieveTransactionReceipt implements ThorRequest<
    RetrieveTransactionReceipt,
    GetTxReceiptResponse | null
> {
    /**
     * Represents the HTTP path configuration for a specific API endpoint.
     */
    protected readonly path: Path;

    /**
     * Represents the HTTP query configuration for a specific API endpoint.
     */
    protected readonly query: Query;

    /**
     * Constructs a new instance of the class with the specified path and query parameters.
     *
     * @param {Path} path - The object containing path parameters required for the operation.
     * @param {Query} query - The object containing query parameters required for the operation.
     */
    protected constructor(path: Path, query: Query) {
        this.path = path;
        this.query = query;
    }

    /**
     * Asynchronously fetches and processes a transaction receiptusing the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveRawBlock, GetTxReceiptResponse>>}
     * Returns a promise that resolves to a ThorResponse containing the requested transaction receipt.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveTransactionReceipt, GetTxReceiptResponse | null>
    > {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveTransactionReceipt, GetTxReceiptResponse|null>>`;
        try {
            const response = await httpClient.get(this.path, this.query);
            let raw: string | undefined;
            try {
                raw = await response.text();
                const json = JSON.parse(raw) as GetTxReceiptResponseJSON | null;
                return {
                    request: this,
                    response:
                        json === null ? null : new GetTxReceiptResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    error instanceof Error ? error.message : 'Bad response.',
                    {
                        url: response.url,
                        // include raw payload to aid debugging (may be non‑JSON)
                        body: typeof raw !== 'undefined' ? raw : undefined
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        } catch (error) {
            throw handleHttpError(fqp, error);
        }
    }

    /**
     * Creates a new instance of RetrieveTransactionReceipt using the provided transaction ID.
     *
     * @param {Hex} txId - The transaction ID used to retrieve the transaction receipt.
     * @return {RetrieveTransactionReceipt} A new instance of RetrieveTransactionReceipt initialized with the given transaction ID.
     * @throws {IllegalArgumentError} If the `txId` expression is not a valid transaction identifier.
     */
    static of(txId: Hex): RetrieveTransactionReceipt {
        try {
            return new RetrieveTransactionReceipt(
                new Path(HexUInt32.of(txId)),
                new Query(undefined)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(txId: Hex): RetrieveTransactionReceipt`,
                'Invalid transaction ID.',
                {
                    txId
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Sets the ID of the `head` block parameter for the `RetrieveTransactionReceipt`.
     *
     * @param {Hex} [head] - An optional hexadecimal value representing the ID of the head block. Best-block is assumed if omitted.
     * @return {RetrieveTransactionReceipt} A new instance of `RetrieveTransactionReceipt` configured with the specified ID of the head block.
     * @throws {ThorError} If an invalid `head` value is provided.
     */
    withHead(head?: Hex): RetrieveTransactionReceipt {
        try {
            return new RetrieveTransactionReceipt(
                this.path,
                new Query(head === undefined ? undefined : HexUInt32.of(head))
            );
        } catch (error) {
            throw new ThorError(
                `${FQP}withHead(head?: Hex): RetrieveTransactionReceipt`,
                'Invalid head value.',
                {
                    head
                },
                error instanceof Error ? error : undefined
            );
        }
    }
}

/**
 * Represents a path to retrieve the transaction receipt for a given transaction ID.
 * Implements the `HttpPath` interface to provide a structured URL path.
 * This class is immutable and ensures the transaction ID is passed during instantiation.
 */
class Path implements HttpPath {
    /**
     * Represents a transaction identifier.
     */
    readonly txId: HexUInt32;

    /**
     * Constructs an instance of the class with the specified transaction ID.
     *
     * @param {HexUInt32} txId - The transaction ID as a hexadecimal unsigned 32-bit integer.
     */
    constructor(txId: HexUInt32) {
        this.txId = txId;
    }

    /**
     * Retrieves the API path for the transaction receipt based on the transaction ID.
     *
     * @return {string} The path to the transaction receipt endpoint.
     */
    get path(): string {
        return `/transactions/${this.txId}/receipt`;
    }
}

/**
 * Represents a query for retrieving a transaction receipt specifying the id of the block head.
 */
class Query implements HttpQuery {
    /**
     * Represents the id of the block head.
     */
    readonly head?: HexUInt32;

    /**
     * Constructs an instance of the class.
     *
     * @param {HexUInt32} [head] - An optional hexadecimal unsigned 32-bit integer identifying the ID of the head block.
     * The best block is assumed if omitted.
     */
    constructor(head?: HexUInt32) {
        this.head = head;
    }

    /**
     * Retrieves the current query string. Returns an empty string if the head is undefined,
     * otherwise returns the head concatenated with an ampersand.
     *
     * @return {string} The constructed query string or an empty string if the head is undefined.
     */
    get query(): string {
        return this.head === undefined ? '' : `${this.head}&`;
    }
}

export { RetrieveTransactionReceipt };
