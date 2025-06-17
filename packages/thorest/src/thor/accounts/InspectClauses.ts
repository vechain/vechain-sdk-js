import { type HttpClient, type HttpPath, type HttpQuery } from '@http';
import { ExecuteCodesResponse, ExecuteCodesRequest } from '@thor/accounts';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';
import { Revision } from '@vechain/sdk-core';
import { ExecuteCodesResponseJSON } from './ExecuteCodesResponseJSON';
import { ExecuteCodesRequestJSON } from './ExecuteCodesRequestJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/accounts/InspectClauses.ts!';

class InspectClauses
    implements ThorRequest<InspectClauses, ExecuteCodesResponse>
{
    static readonly PATH: HttpPath = { path: '/accounts/*' };

    private readonly query: InspectClauseQuery;

    private readonly request: ExecuteCodesRequest;

    constructor(query: InspectClauseQuery, request: ExecuteCodesRequest) {
        this.query = query;
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>>`;
        const response = await httpClient.post(
            InspectClauses.PATH,
            this.query,
            this.request.toJSON()
        );
        if (response.ok) {
            const json = (await response.json()) as ExecuteCodesResponseJSON;
            try {
                return {
                    request: this,
                    response: new ExecuteCodesResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        }
        throw new ThorError(
            fqp,
            'Bad response.',
            {
                url: response.url
            },
            undefined,
            response.status
        );
    }

    static of(request: ExecuteCodesRequestJSON): InspectClauses {
        return new InspectClauses(
            new InspectClauseQuery(Revision.BEST),
            new ExecuteCodesRequest(request)
        );
    }

    withRevision(revision: Revision = Revision.BEST): InspectClauses {
        return new InspectClauses(
            new InspectClauseQuery(revision),
            this.request
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
