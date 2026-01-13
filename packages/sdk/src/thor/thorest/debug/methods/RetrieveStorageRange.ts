import type { HttpClient, HttpPath } from '@common/http';
import { StorageRange, StorageRangeOption } from '@thor/thorest/debug';
import {
    type StorageRangeJSON,
    type StorageRangeOptionJSON
} from '@thor/thorest/json';
import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { InvalidThorestRequestError } from '@common/errors';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * [Retrieve storage range](http://localhost:8669/doc/stoplight-ui/#/paths/debug-storage-range/post)
 */
class RetrieveStorageRange implements ThorRequest<
    RetrieveStorageRange,
    StorageRange
> {
    /**
     * Represents an HTTP path configuration for a specific endpoint.
     */
    protected static readonly PATH: HttpPath = { path: '/debug/storage-range' };

    /**
     * Represents the options for specifying a range of storage slots to query.
     *
     * This object allows the user to define a range by providing start and end slots,
     * which can be used to query for keys and values within the designated range in storage.
     */
    protected readonly request: StorageRangeOption;

    /**
     * Protected constructor for initializing a StorageRangeOption request.
     *
     * @param {StorageRangeOption} request - The storage range option to be set.
     */
    protected constructor(request: StorageRangeOption) {
        this.request = request;
    }

    /**
     * Sends a request to the specified HTTP client to retrieve storage range data.
     * If the request is successful and the response is valid, it returns a ThorResponse containing the request and the response data.
     * In case of an error, throws a ThorError providing detailed context about the failure.
     *
     * @param {HttpClient} httpClient - The HTTP client instance used to make the request.
     * @return {Promise<ThorResponse<RetrieveStorageRange, StorageRange>>} - A promise that resolves with a ThorResponse containing the request and response data.
     * @throws {InvalidThorestResponseError} - If the request fails or the response is invalid.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveStorageRange, StorageRange>> {
        const fqp = `RetrieveStorageRange.askTo`;
        // http request - this will throw HttpError if the request fails
        const response = await httpClient.post(
            RetrieveStorageRange.PATH,
            { query: '' },
            this.request.toJSON()
        );
        // parse the not nullable response - this will throw InvalidThorestResponseError if the response cannot be parsed
        const storageRange = await parseResponseHandler<
            StorageRange,
            StorageRangeJSON
        >(fqp, response, StorageRange, false);
        // return a thor response
        return {
            request: this,
            response: storageRange
        };
    }

    /**
     * Creates an instance of RetrieveStorageRange from the given StorageRangeOptionJSON.
     *
     * @param {StorageRangeOptionJSON} request - The storage range option configuration in JSON format.
     * @return {RetrieveStorageRange} A new instance of RetrieveStorageRange initialized with the given storage range options.
     * @throws {InvalidThorestRequestError} If the request can't be parsed.
     */
    static of(request: StorageRangeOptionJSON): RetrieveStorageRange {
        try {
            return new RetrieveStorageRange(new StorageRangeOption(request));
        } catch (error) {
            throw new InvalidThorestRequestError(
                `RetrieveStorageRange.of`,
                'Invalid request',
                {
                    request
                },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { RetrieveStorageRange };
