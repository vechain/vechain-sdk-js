import { type ThorRequest } from '../ThorRequest';
import { type HttpClient, type HttpPath } from '../../http';
import {
    PostDebugTracerCallRequest,
    type PostDebugTracerCallRequestJSON
} from './PostDebugTracerCallRequest';
import { type ThorResponse } from '../ThorResponse';

class TraceACall implements ThorRequest<TraceACall, undefined> {
    static readonly PATH: HttpPath = { path: '/debug/tracers/call' };

    readonly request: PostDebugTracerCallRequest;

    constructor(request: PostDebugTracerCallRequest) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<TraceACall, undefined>> {
        const R = this.request.toJSON();
        console.log(R);
        const response = await httpClient.post(
            TraceACall.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody: unknown = await response.json();
        return {
            request: this,
            response: responseBody as undefined
        };
    }

    static of(request: PostDebugTracerCallRequestJSON): TraceACall {
        return new TraceACall(new PostDebugTracerCallRequest(request));
    }
}

export { TraceACall };
