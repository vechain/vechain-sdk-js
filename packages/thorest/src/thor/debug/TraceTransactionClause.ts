import { type HttpClient, type HttpPath } from '@http';
import {
    PostDebugTracerRequest,
    type PostDebugTracerRequestJSON
} from '@thor/debug';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';
import { IllegalArgumentError } from '@vechain/sdk-core';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/thorest/src/thor/debug/TraceTransactionClause.ts!';

/**
 * [Trace a transaction clause](http://localhost:8669/doc/stoplight-ui/#/paths/debug-tracers/post)
 */
class TraceTransactionClause
    implements ThorRequest<TraceTransactionClause, unknown>
{
    /**
     * Represents the HTTP path configuration for the debug tracers endpoint.
     */
    protected static readonly PATH: HttpPath = { path: '/debug/tracers' };

    /**
     * Represents a request object for initiating a debug trace of a specific post.
     */
    protected readonly request: PostDebugTracerRequest;

    /**
     * Protected constructor for initializing an instance of the class.
     *
     * @param {PostDebugTracerRequest} request - The request object containing data for the tracer.
     */
    protected constructor(request: PostDebugTracerRequest) {
        this.request = request;
    }

    /**
     * Sends a request using the given HttpClient and handles the response.
     *
     * @param {HttpClient} httpClient - The HTTP client instance used to perform the POST request.
     * @return {Promise<ThorResponse<TraceTransactionClause, unknown>>} A promise that resolves to a ThorResponse object
     * containing the debug data.
     * @throw If the response status is not OK.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<TraceTransactionClause, unknown>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<TraceTransactionClause, unknown>>`;
        const response = await httpClient.post(
            TraceTransactionClause.PATH,
            { query: '' },
            this.request.toJSON()
        );
        if (response.ok) {
            const json: unknown = await response.json();
            return {
                request: this,
                response: json
            };
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
     * Creates and returns an instance of `TraceTransactionClause` using the provided `PostDebugTracerRequestJSON`.
     *
     * @param {PostDebugTracerRequestJSON} request - The JSON object representing the debug tracer request.
     * @return {TraceTransactionClause} A new instance of `TraceTransactionClause` created with the given request.
     * @throws {IllegalArgumentError} If the request is invalid or an error occurs during instantiation.
     */
    static of(request: PostDebugTracerRequestJSON): TraceTransactionClause {
        try {
            return new TraceTransactionClause(
                new PostDebugTracerRequest(request)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(request: PostDebugTracerRequestJSON): TraceTransactionClause`,
                'Invalid request',
                {
                    request
                },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { TraceTransactionClause };
