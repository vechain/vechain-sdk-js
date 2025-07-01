import { type HttpClient, type HttpPath, type HttpQuery } from '@http';
import {
    PostDebugTracerCallRequest,
    type PostDebugTracerCallRequestJSON
} from '@thor/debug';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';
import {
    type HexUInt32,
    IllegalArgumentError,
    Revision
} from '@vechain/sdk-core';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/debug/TraceCall.ts';

/**
 * [Trace a call](http://localhost:8669/doc/stoplight-ui/#/paths/debug-tracers-call/post)
 */
class TraceCall implements ThorRequest<TraceCall, unknown> {
    /**
     * Represents the HTTP path configuration for the debug tracer call endpoint.
     */
    protected static readonly PATH: HttpPath = { path: '/debug/tracers/call' };

    /**
     * Represents the HTTP query configuration for a specific API endpoint.
     */
    protected readonly query: Query;

    /**
     * Represents a request for logging or tracing debug information within a system.
     */
    protected readonly request: PostDebugTracerCallRequest;

    /**
     * Constructs an instance of the class with the given request.
     *
     * @param {Query} query - The query part of the path to the end point.
     * @param {PostDebugTracerCallRequest} request - The request parameter used to initialize the instance
     * is the body of the POST http call.
     */
    protected constructor(query: Query, request: PostDebugTracerCallRequest) {
        this.query = query;
        this.request = request;
    }

    /**
     * Sends a POST request using the provided HttpClient and processes the response.
     *
     * @param httpClient The HttpClient instance used to send the HTTP request.
     * @return A Promise that resolves to a ThorResponse containing the request and parsed response on success, or with undefined data on error.
     * @throw If the response status is not OK.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<TraceCall, unknown>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<TraceCall, undefined>>`;
        const response = await httpClient.post(
            TraceCall.PATH,
            this.query,
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
     * Creates an instance of TraceCall from a given PostDebugTracerCallRequestJSON.
     *
     * @param {PostDebugTracerCallRequestJSON} request - The JSON representation of a PostDebugTracerCallRequest.
     * @return {TraceCall} A new instance of TraceCall initialized with the provided request.
     * @throws {IllegalArgumentError} If the request is invalid or an error occurs during initialization.
     */
    static of(request: PostDebugTracerCallRequestJSON): TraceCall {
        try {
            return new TraceCall(
                new Query(Revision.BEST),
                new PostDebugTracerCallRequest(request)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(request: PostDebugTracerCallRequestJSON): TraceCall`,
                'Invalid request',
                {
                    request
                },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Creates a new instance of `TraceCall` with the specified revision.
     *
     * @param {HexUInt32 | Revision} revision - The revision to associate with the `TraceCall`. Can either be a hexadecimal unsigned 32-bit integer or a `Revision` object.
     * @return {TraceCall} A new `TraceCall` instance initialized with the provided revision and the existing request.
     */
    withRevison(revision: HexUInt32 | Revision): TraceCall {
        return new TraceCall(new Query(revision), this.request);
    }
}

/**
 * Class representing a Query that implements the HttpQuery interface.
 * This class constructs a query string based on a given revision.
 */
class Query implements HttpQuery {
    /**
     * Represents a revision identifier that can be either a hex-encoded unsigned 32-bit integer
     * or a `Revision` object. This type is used for tracking or specifying a version or state
     * of an item within a version control or similar system.
     */
    readonly revision: HexUInt32 | Revision;

    /**
     * Initializes a new instance of the class with the specified revision.
     *
     * @param {HexUInt32 | Revision} revision - The revision value to be set. Can either be a HexUInt32 or a Revision object.
     */
    constructor(revision: HexUInt32 | Revision) {
        this.revision = revision;
    }

    /**
     * Constructs and returns a query string based on the current revision.
     *
     * @return {string} The query string formatted with the revision value.
     */
    get query(): string {
        return `?revision=${this.revision.toString()}`;
    }
}

export { TraceCall };
