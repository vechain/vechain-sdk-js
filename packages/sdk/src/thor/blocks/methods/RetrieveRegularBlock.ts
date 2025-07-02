import {
    RegularBlockResponse,
    type RegularBlockResponseJSON,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor';
import { type HttpClient, type HttpPath } from '@http';
import { type Revision } from '@vcdm';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/blocks/RetrieveRegularBlock.ts!';

/**
 * [Retrieve a regular block](http://localhost:8669/doc/stoplight-ui/#/paths/blocks-revision/get)
 *
 * Retrieve information about a block identified by its revision.
 * If the provided revision is not found, the response will be `null`.
 */
class RetrieveRegularBlock
    implements ThorRequest<RetrieveRegularBlock, RegularBlockResponse | null>
{
    /**
     * Represents the HTTP path for this specific API endpoint.
     */
    protected readonly path: HttpPath;

    /**
     * Constructs an instance of the class with the specified HTTP path.
     *
     * @param {HttpPath} path - The HTTP path to initialize the instance with.
     */
    protected constructor(path: HttpPath) {
        this.path = path;
    }

    /**
     * Asynchronously fetches and processes a block response using the provided HTTP client.
     *
     * @param {HttpClient} httpClient - An HTTP client used to perform the request.
     * @return {Promise<ThorResponse<RetrieveRegularBlock, RegularBlockResponse | null>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveRegularBlock, RegularBlockResponse | null>
    > {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveRegularBlock, RegularBlockResponse | null>>`;
        const response = await httpClient.get(this.path, {
            query: '?raw=false'
        });
        if (response.ok) {
            const json =
                (await response.json()) as RegularBlockResponseJSON | null;
            try {
                return {
                    request: this,
                    response:
                        json === null ? null : new RegularBlockResponse(json)
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
     * Creates an instance of RetrieveRegularBlock using the provided revision.
     *
     * @param {Revision} revision - The revision object used to generate the block's path.
     * @return {RetrieveRegularBlock} A new instance of RetrieveRegularBlock with the specified path.
     */
    static of(revision: Revision): RetrieveRegularBlock {
        return new RetrieveRegularBlock({ path: `/blocks/${revision}` });
    }
}

export { RetrieveRegularBlock };
