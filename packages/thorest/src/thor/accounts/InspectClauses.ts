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

/**
 Inspect the clauses of a contract identified by its address.
 
 API endpoint: `POST /accounts/*`
 */
/// Documentation: http://localhost:8669/doc/stoplight-ui/#/paths/accounts-*/post/
class InspectClauses
    implements ThorRequest<InspectClauses, ExecuteCodesResponse>
{
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    static readonly PATH: HttpPath = { path: '/accounts/*' };

    /**
     * Represents the HTTP query for this specific API endpoint.
     */
    private readonly query: InspectClauseQuery;

    /**
     * Represents the HTTP request for this specific API endpoint.
     */
    private readonly request: ExecuteCodesRequest;

    /**
     * Constructs an instance of the class with the specified HTTP path and request.
     */
    constructor(query: InspectClauseQuery, request: ExecuteCodesRequest) {
        this.query = query;
        this.request = request;
    }

    /**
     * Asynchronously fetches and processes a block response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
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

    /**
     * Creates an instance of InspectClauses using the provided request.
     *
     * @param {ExecuteCodesRequestJSON} request - The request to initialize the instance with.
     * @return {InspectClauses} A new instance of InspectClauses with the specified request.
     */
    static of(request: ExecuteCodesRequestJSON): InspectClauses {
        return new InspectClauses(
            new InspectClauseQuery(Revision.BEST),
            new ExecuteCodesRequest(request)
        );
    }

    /**
     * Creates an instance of InspectClauses using the provided revision.
     *
     * @param {Revision} revision - The revision to initialize the instance with.
     * @return {InspectClauses} A new instance of InspectClauses with the specified revision.
     */
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
