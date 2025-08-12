import {
    ExpandedBlockResponse,
    ThorError,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type ExpandedBlockResponseJSON } from '@thor/thorest/json';
import { type HttpClient, type HttpPath } from '@common/http';
import { type Revision } from '@common/vcdm';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/blocks/RetrieveExpandedBlock.ts!';

/**
 * [Retrieve an expanded block](http://localhost:8669/doc/stoplight-ui/#/paths/blocks-revision/get)
 *
 * Retrieve information about a block identified by its revision.
 * If the provided revision is not found, the response will be `null`.
 */
class RetrieveExpandedBlock
    implements ThorRequest<RetrieveExpandedBlock, ExpandedBlockResponse | null>
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
     * @return {Promise<ThorResponse<RetrieveExpandedBlock, RegularBlockResponse | null>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveExpandedBlock, ExpandedBlockResponse | null>
    > {
        const fqp = `${FQP}askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveExpandedBlock, ExpandedBlockResponse>>`;
        const response = await httpClient.get(this.path, {
            query: '?expanded=true&raw=false'
        });
        if (response.ok) {
            const json =
                (await response.json()) as ExpandedBlockResponseJSON | null;
            try {
                return {
                    request: this,
                    response:
                        json === null ? null : new ExpandedBlockResponse(json)
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
     * Creates an instance of RetrieveExpandedBlock using the provided revision.
     *
     * @param {Revision} revision - The revision object used to generate the block's path.
     * @return {RetrieveExpandedBlock} A new instance of RetrieveExpandedBlock with the specified path.
     */
    static of(revision: Revision): RetrieveExpandedBlock {
        return new RetrieveExpandedBlock({ path: `/blocks/${revision}` });
    }
}

export { RetrieveExpandedBlock };
