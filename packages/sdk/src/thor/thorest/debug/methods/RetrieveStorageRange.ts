import type { HttpClient, HttpPath } from '@common/http';
import { StorageRange, StorageRangeOption } from '@thor/thorest/debug';
import {
    type StorageRangeJSON,
    type StorageRangeOptionJSON
} from '@thor/thorest/json';
import { ThorError, type ThorRequest, type ThorResponse } from '@thor/thorest';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/debug/RetrieveStorageRange.ts';

/**
 * [Retrieve storage range](http://localhost:8669/doc/stoplight-ui/#/paths/debug-storage-range/post)
 */
class RetrieveStorageRange
    implements ThorRequest<RetrieveStorageRange, StorageRange>
{
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
     * @throws {ThorError} - If the request fails or the response is invalid.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveStorageRange, StorageRange>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveStorageRange, StorageRange>>`;
        const response = await httpClient.post(
            RetrieveStorageRange.PATH,
            { query: '' },
            this.request.toJSON()
        );
        if (response.ok) {
            const json = (await response.json()) as StorageRangeJSON;
            try {
                return {
                    request: this,
                    response: new StorageRange(json)
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
        } else {
            throw new ThorError(
                fqp,
                await response.text(),
                {
                    url: response.url
                },
                undefined,
                response.status
            );
        }
    }

    /**
     * Creates an instance of RetrieveStorageRange from the given StorageRangeOptionJSON.
     *
     * @param {StorageRangeOptionJSON} request - The storage range option configuration in JSON format.
     * @return {RetrieveStorageRange} A new instance of RetrieveStorageRange initialized with the given storage range options.
     * @throws {IllegalArgumentError} If the request can't be parsed.
     */
    static of(request: StorageRangeOptionJSON): RetrieveStorageRange {
        try {
            return new RetrieveStorageRange(new StorageRangeOption(request));
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(request: StorageRangeOptionJSON): RetrieveStorageRange`,
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
