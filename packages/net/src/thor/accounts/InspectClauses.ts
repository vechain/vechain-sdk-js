import {
    ExecuteCodeResponse,
    type ExecuteCodeResponseJSON,
    type ExecuteCodesResponse,
    type ExecuteCodesResponseJSON
} from './ExecuteCodesResponse';
import { type ThorRequest } from '../ThorRequest';
import { type HttpClient, type HttpPath } from '../../http';
import { type ThorResponse } from '../ThorResponse';
import {
    ExecuteCodesRequest,
    type ExecuteCodesRequestJSON
} from './ExecuteCodesRequest';

class InspectClauses
    implements ThorRequest<InspectClauses, ExecuteCodesResponse>
{
    static readonly PATH: HttpPath = { path: '/accounts/*' };

    readonly request: ExecuteCodesRequest;

    constructor(request: ExecuteCodesRequest) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>> {
        const response = await httpClient.post(
            InspectClauses.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody =
            (await response.json()) as ExecuteCodesResponseJSON;
        return {
            request: this,
            response: responseBody.map(
                (json: ExecuteCodeResponseJSON): ExecuteCodeResponse =>
                    new ExecuteCodeResponse(json)
            )
        };
    }

    static of(request: ExecuteCodesRequestJSON): InspectClauses {
        return new InspectClauses(new ExecuteCodesRequest(request));
    }
}

// class InspectClauseQuery implements HttpQuery {
//     readonly revision: Revision;
//
//     constructor(revision: Revision) {
//         this.revision = revision;
//     }
//
//     get query(): string {
//         return `\`?${this.revision}`;
//     }
// }

export { InspectClauses };
