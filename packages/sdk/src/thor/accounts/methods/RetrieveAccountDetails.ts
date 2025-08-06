import { type HttpClient, type HttpPath } from '@http';
import { GetAccountResponse } from '@thor/accounts';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor';
import { type Revision, type Address } from '@vcdm';
import { type GetAccountResponseJSON } from '../json';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/accounts/RetrieveAccountDetails.ts!';

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
     * Constructs an instance of the class with the specified HTTP path.
     *
     * @param {HttpPath} path - The HTTP path to initialize the instance with.
     */
    protected constructor(path: RetrieveAccountDetailsPath) {
        this.path = path;
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
        const response = await httpClient.get(this.path, { query: '' });
        if (response.ok) {
            const json = (await response.json()) as GetAccountResponseJSON;
            try {
                return {
                    request: this,
                    response: new GetAccountResponse(json)
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

    static of(address: Address, revision?: Revision): RetrieveAccountDetails {
        return new RetrieveAccountDetails(
            new RetrieveAccountDetailsPath(address, revision)
        );
    }
}

class RetrieveAccountDetailsPath implements HttpPath {
    readonly address: Address;
    readonly revision?: Revision;

    constructor(address: Address, revision?: Revision) {
        this.address = address;
        this.revision = revision;
    }

    get path(): string {
        if (this.revision == null) {
            return `/accounts/${this.address}`;
        }
        return `/accounts/${this.address}?revision=${this.revision}`;
    }
}

export { RetrieveAccountDetails, RetrieveAccountDetailsPath };
