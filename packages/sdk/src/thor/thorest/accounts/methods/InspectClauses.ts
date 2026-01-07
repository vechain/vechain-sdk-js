import { type HttpClient, type HttpPath, type HttpQuery } from '@common/http';
import {
    ExecuteCodesResponse,
    type ExecuteCodesRequest,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { Revision } from '@common/vcdm';
import { type ExecuteCodesResponseJSON } from '@thor/thorest/accounts/json';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * Inspect the clauses of a contract identified by its address.
 *
 * Thorest API endpoint: `POST /accounts/*`
 */
class InspectClauses implements ThorRequest<
    InspectClauses,
    ExecuteCodesResponse
> {
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    private static readonly PATH: HttpPath = { path: '/accounts/*' };

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
    protected constructor(
        query: InspectClauseQuery,
        request: ExecuteCodesRequest
    ) {
        this.query = query;
        this.request = request;
    }

    /**
     * Fetches and processes a execute codes response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>>}
     * Returns a promise that resolves to a ThorResponse containing the requested execute codes response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<InspectClauses, ExecuteCodesResponse>> {
        const fqp = 'InspectClauses.askTo';
        // do http post request - this will throw an error if the request fails
        const response = await httpClient.post(
            InspectClauses.PATH,
            this.query,
            this.request.toJSON()
        );
        // parse the response - this will throw an error if the response cannot be parsed
        const executeCodesResponse = await parseResponseHandler<
            ExecuteCodesResponse,
            ExecuteCodesResponseJSON
        >(fqp, response, ExecuteCodesResponse);
        // return a thor response
        return {
            request: this,
            response: executeCodesResponse
        };
    }

    /**
     * Creates an instance of InspectClauses using the provided request.
     *
     * @param {ExecuteCodesRequest} request - The request to initialize the instance with.
     * @return {InspectClauses} A new instance of InspectClauses with the specified request.
     */
    static of(request: ExecuteCodesRequest): InspectClauses {
        return new InspectClauses(
            new InspectClauseQuery(Revision.BEST),
            request
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

/**
 * Inspect Clause Query
 *
 * Represents a query for inspecting clauses.
 */
class InspectClauseQuery implements HttpQuery {
    /**
     * Represents the revision of the query.
     */
    private readonly revision: Revision;

    /**
     * Constructs an instance of the class with the specified revision.
     */
    constructor(revision: Revision) {
        this.revision = revision;
    }

    /**
     * Returns the query string for the revision.
     *
     * @returns {string} The query string for the revision.
     */
    get query(): string {
        return `?revision=${this.revision}`;
    }
}

export { InspectClauses };
