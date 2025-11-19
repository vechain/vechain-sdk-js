import { type HttpClient, type HttpPath, type HttpQuery } from '@common/http';
import { GetAccountResponse } from '@thor/thorest';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor/thorest';
import { Address, type AddressLike, type Revision } from '@common/vcdm';
import { type GetAccountResponseJSON } from '../json';
import { handleHttpError } from '@thor/thorest/utils';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/accounts/methods/RetrieveAccountDetails.ts!';

/**
 * [Retrieve account details](http://localhost:8669/doc/stoplight-ui/#/paths/accounts-address/get)
 *
 * Retrieve the details of an account identified by its address.
 */
class RetrieveAccountDetails
    implements ThorRequest<RetrieveAccountDetails, GetAccountResponse>
{
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    private readonly path: RetrieveAccountDetailsPath;

    /**
     * Represents the HTTP query for this specific API endpoint.
     */
    private readonly query: RetrieveAccountDetailsQuery;

    /**
     * Constructs an instance of the class with the specified HTTP path.
     *
     * @param {HttpPath} path - The HTTP path to initialize the instance with.
     * @param {RetrieveAccountDetailsQuery} query - The HTTP query to initialize the instance with.
     */
    protected constructor(
        path: RetrieveAccountDetailsPath,
        query: RetrieveAccountDetailsQuery
    ) {
        this.path = path;
        this.query = query;
    }

    /**
     * Asynchronously fetches and processes a block response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveAccountDetails, GetAccountResponse>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveAccountDetails, GetAccountResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveAccountDetails, GetAccountResponse>>`;
        try {
            const response = await httpClient.get(this.path, this.query);
            const json = (await response.json()) as GetAccountResponseJSON;
            try {
                return {
                    request: this,
                    response: new GetAccountResponse(json)
                };
            } catch (error) {
                throw new ThorError(
                    fqp,
                    error instanceof Error ? error.message : 'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        } catch (error) {
            throw handleHttpError(fqp, error);
        }
    }

    /**
     * Creates an instance of RetrieveAccountDetails using the provided address and revision.
     *
     * @param {Address} [address] - The address used to generate the account details' path.
     * @param {Revision} [revision] - The revision to be set. If not provided, no revision query parameter will be added.
     * @return {RetrieveAccountDetails} A new instance of RetrieveAccountDetails with the specified path and query.
     */
    static of(
        address: AddressLike,
        revision?: Revision
    ): RetrieveAccountDetails {
        const normalizedAddress = Address.of(address);
        return new RetrieveAccountDetails(
            new RetrieveAccountDetailsPath(normalizedAddress),
            new RetrieveAccountDetailsQuery(revision)
        );
    }
}

/**
 * Retrieve Account Details Path
 *
 * Represents a path for retrieving account details.
 */
class RetrieveAccountDetailsPath implements HttpPath {
    readonly address: Address;

    constructor(address: Address) {
        this.address = address;
    }

    get path(): string {
        return `/accounts/${this.address}`;
    }
}

/**
 * Retrieve Account Details Query
 *
 * Represents a query for retrieving account details with optional revision parameter.
 */
class RetrieveAccountDetailsQuery implements HttpQuery {
    /**
     * Represents the revision of the query.
     */
    private readonly revision?: Revision;

    /**
     * Constructs an instance of the class with an optional revision.
     *
     * @param {Revision} [revision] - The revision to be set. If not provided, no revision query parameter will be added.
     */
    constructor(revision?: Revision) {
        this.revision = revision;
    }

    /**
     * Returns the query string for the revision.
     *
     * @returns {string} The query string for the revision, or empty string if no revision is set.
     */
    get query(): string {
        return this.revision != null ? `?revision=${this.revision}` : '';
    }
}

export {
    RetrieveAccountDetails,
    RetrieveAccountDetailsPath,
    RetrieveAccountDetailsQuery
};
