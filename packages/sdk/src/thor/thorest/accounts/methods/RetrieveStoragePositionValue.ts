import { HttpQuery, type HttpClient, type HttpPath } from '@common/http';
import { Revision, type Address, type Hex } from '@common/vcdm';
import { GetStorageResponse } from '@thor/thorest';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor/thorest';
import { type GetStorageResponseJSON } from '@thor/thorest/json';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/accounts/RetrieveStoragePositionValue.ts!';

/**
 * [Retrieve a storage position value](http://localhost:8669/doc/stoplight-ui/#/paths/accounts-address--storage--key/get)
 *
 * Retrieve the value of a storage position identified by its address and key.
 */
class RetrieveStoragePositionValue
    implements ThorRequest<RetrieveStoragePositionValue, GetStorageResponse>
{
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    private readonly path: RetrieveStoragePositionValuePath;

    /**
     * Represents the HTTP query for this specific API endpoint.
     */
    private readonly query: RetrieveStoragePositionValueQuery;

    /**
     * Constructs an instance of the class with the specified HTTP path.
     *
     * @param {HttpPath} path - The HTTP path to initialize the instance with.
     */
    protected constructor(
        path: RetrieveStoragePositionValuePath,
        query: RetrieveStoragePositionValueQuery
    ) {
        this.path = path;
        this.query = query;
    }

    /**
     * Asynchronously fetches and processes a block response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>>`;
        const response = await httpClient.get(this.path, this.query);
        if (response.ok) {
            const json = (await response.json()) as GetStorageResponseJSON;
            try {
                console.log(`${FQP} json: ${JSON.stringify(json)}`);
                return {
                    request: this,
                    response: new GetStorageResponse(json)
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
        console.log(
            `${FQP} response: ${response.status}: path: ${this.path.path}: query: ${this.query.query}`
        );
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
     * Creates an instance of RetrieveStoragePositionValue using the provided address and key.
     *
     * @param {Address} address - The address used to generate the storage position value's path.
     * @param {Hex} key - The key used to generate the storage position value's path.
     * @return {RetrieveStoragePositionValue} A new instance of RetrieveStoragePositionValue with the specified path.
     */
    static of(
        address: Address,
        key: Hex,
        revision?: Revision
    ): RetrieveStoragePositionValue {
        return new RetrieveStoragePositionValue(
            new RetrieveStoragePositionValuePath(address, key),
            new RetrieveStoragePositionValueQuery(revision)
        );
    }
}

/**
 * Retrieve Storage Position Value Path
 *
 * Represents the path for retrieving the value of a storage position.
 */
class RetrieveStoragePositionValuePath implements HttpPath {
    /**
     * Represents the address of the storage position.
     */
    readonly address: Address;

    /**
     * Represents the key of the storage position.
     */
    readonly key: Hex;

    /**
     * Constructs an instance of the class with the specified address and key.
     *
     * @param {Address} address - The address used to generate the storage position value's path.
     * @param {Hex} key - The key used to generate the storage position value's path.
     */
    constructor(address: Address, key: Hex) {
        this.address = address;
        this.key = key;
    }

    /**
     * Returns the path for retrieving the value of a storage position.
     *
     * @returns {string} The path for retrieving the value of a storage position.
     */
    get path(): string {
        return `/accounts/${this.address}/storage/${this.key}`;
    }
}

/**
 * Retrieve Storage Position Value Query
 *
 * Represents a query for retrieving storage position value with optional revision parameter.
 */
class RetrieveStoragePositionValueQuery implements HttpQuery {
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
    RetrieveStoragePositionValue,
    RetrieveStoragePositionValuePath,
    RetrieveStoragePositionValueQuery
};
