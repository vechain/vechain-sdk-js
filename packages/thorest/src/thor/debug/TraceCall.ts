import { type HttpClient, type HttpPath } from '@http';
import {
    PostDebugTracerCallRequest,
    type PostDebugTracerCallRequestJSON
} from '@thor/debug';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/thorest/src/thor/debug/TraceCall.ts';

/**
 * [Trace a call](http://localhost:8669/doc/stoplight-ui/#/paths/debug-tracers-call/post)
 */
class TraceCall implements ThorRequest<TraceCall, unknown> {
    /**
     * Represents the HTTP path configuration for the debug tracer call endpoint.
     */
    protected static readonly PATH: HttpPath = { path: '/debug/tracers/call' };

    /**
     * Represents a request for logging or tracing debug information within a system.
     */
    protected readonly request: PostDebugTracerCallRequest;

    /**
     * Constructs an instance of the class with the given request.
     *
     * @param {PostDebugTracerCallRequest} request - The request parameter used to initialize the instance.
     */
    protected constructor(request: PostDebugTracerCallRequest) {
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
            { query: '' },
            this.request.toJSON()
        );
        if (!response.ok) {
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
     * @throws {ThorError} If the request is invalid or an error occurs during initialization.
     */
    static of(request: PostDebugTracerCallRequestJSON): TraceCall {
        try {
            return new TraceCall(new PostDebugTracerCallRequest(request));
        } catch (error) {
            throw new ThorError(
                `${FQP}of(request: PostDebugTracerCallRequestJSON): TraceCall`,
                'Invalid request',
                {
                    request
                },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { TraceCall };
