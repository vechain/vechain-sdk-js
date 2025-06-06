import { type HttpClient, type HttpPath } from '@http';
import {
    PostDebugTracerRequest,
    type PostDebugTracerRequestJSON
} from '@thor/debug';
import { type ThorRequest, type ThorResponse } from '@thor';

class TraceTransactionClause
    implements ThorRequest<TraceTransactionClause, unknown>
{
    static readonly PATH: HttpPath = { path: '/debug/tracers' };

    readonly request: PostDebugTracerRequest;

    constructor(request: PostDebugTracerRequest) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<TraceTransactionClause, unknown>> {
        const response = await httpClient.post(
            TraceTransactionClause.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody: unknown = await response.json();
        return {
            request: this,
            response: responseBody as undefined
        };
    }

    static of(request: PostDebugTracerRequestJSON): TraceTransactionClause {
        return new TraceTransactionClause(new PostDebugTracerRequest(request));
    }
}

export { TraceTransactionClause };
