import { type HttpQuery, type HttpClient, type HttpPath } from '@common/http';
import { type Revision, type Address, type Hex } from '@common/vcdm';
import { GetStorageResponse } from '@thor/thorest';
import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { type GetStorageResponseJSON } from '@thor/thorest/json';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * [Retrieve a storage position value](http://localhost:8669/doc/stoplight-ui/#/paths/accounts-address--storage--key/get)
 *
 * Retrieve the value of a storage position identified by its address and key.
 */
class RetrieveStoragePositionValue implements ThorRequest<
    RetrieveStoragePositionValue,
    GetStorageResponse
> {
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
     * Fetches and processes a get storage response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>>}
     * Returns a promise that resolves to a ThorResponse containing the requested get storage response.
     * @throws {InvalidThorestResponse} if the response cannot be parsed
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveStoragePositionValue, GetStorageResponse>> {
        const fqp = 'RetrieveStoragePositionValue.askTo';
        // do http get request - this will throw an error if the request fails
        const response = await httpClient.get(this.path, this.query);
        // parse the response - this will throw an error if the response cannot be parsed
        const getStorageResponse = await parseResponseHandler<
            GetStorageResponse,
            GetStorageResponseJSON
        >(fqp, response, GetStorageResponse);
        // return a thor response
        return {
            request: this,
            response: getStorageResponse
        };
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
