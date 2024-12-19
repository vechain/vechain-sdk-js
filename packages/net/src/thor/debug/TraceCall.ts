import { type ThorRequest } from '../ThorRequest';
import { type HttpClient, type HttpPath } from '../../http';
import {
    PostDebugTracerCallRequest,
    type PostDebugTracerCallRequestJSON
} from './PostDebugTracerCallRequest';
import { type ThorResponse } from '../ThorResponse';

class TraceCall implements ThorRequest<TraceCall, undefined> {
    static readonly PATH: HttpPath = { path: '/debug/tracers/call' };

    readonly request: PostDebugTracerCallRequest;

    constructor(request: PostDebugTracerCallRequest) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<TraceCall, undefined>> {
        const response = await httpClient.post(
            TraceCall.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody: unknown = await response.json();
        return {
            request: this,
            response: responseBody as undefined
        };
    }

    static of(request: PostDebugTracerCallRequestJSON): TraceCall {
        return new TraceCall(new PostDebugTracerCallRequest(request));
    }
}

export { TraceCall };
