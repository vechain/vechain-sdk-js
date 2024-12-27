import {
    ExecuteCodesResponse,
    type ExecuteCodesResponseJSON
} from './ExecuteCodesResponse';
import { type ThorRequest } from '../ThorRequest';
import { type HttpClient, type HttpPath, type HttpQuery } from '../../http';
import { type ThorResponse } from '../ThorResponse';
import {
    ExecuteCodesRequest,
    type ExecuteCodesRequestJSON
} from './ExecuteCodesRequest';
import { Revision } from '@vechain/sdk-core';

class InspectClauses
    implements ThorRequest<InspectClauses, ExecuteCodesResponse>
{
    static readonly PATH: HttpPath = { path: '/accounts/*' };

    readonly query: InspectClauseQuery;

    readonly request: ExecuteCodesRequest;

    constructor(query: InspectClauseQuery, request: ExecuteCodesRequest) {
        this.query = query;
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>> {
        const response = await httpClient.post(
            InspectClauses.PATH,
            this.query,
            this.request.toJSON()
        );
        const responseBody =
            (await response.json()) as ExecuteCodesResponseJSON;
        return {
            request: this,
            response: new ExecuteCodesResponse(responseBody)
        };
    }

    withRevision(revision: Revision = Revision.BEST): InspectClauses {
        return new InspectClauses(
            new InspectClauseQuery(revision),
            this.request
        );
    }

    static of(request: ExecuteCodesRequestJSON): InspectClauses {
        return new InspectClauses(
            new InspectClauseQuery(Revision.BEST),
            new ExecuteCodesRequest(request)
        );
    }
}

class InspectClauseQuery implements HttpQuery {
    readonly revision: Revision;

    constructor(revision: Revision) {
        this.revision = revision;
    }

    get query(): string {
        return `?revision=${this.revision}`;
    }
}

export { InspectClauses };
