import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type ExpandedBlockResponseJSON } from '@thor/thorest/json';
import { type HttpClient, type HttpPath } from '@common/http';
import { type Revision } from '@common/vcdm';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * Retrieve an expanded block
 */
class RetrieveExpandedBlock implements ThorRequest<
    RetrieveExpandedBlock,
    ExpandedBlockResponse | null
> {
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
        const fqp = 'RetrieveExpandedBlock.askTo';
        // do http get request - this will throw an error if the request fails
        const response = await httpClient.get(this.path, {
            query: '?expanded=true&raw=false'
        });
        // parse the nullable response - this will throw an error if the response cannot be parsed
        const expandedBlockResponse = await parseResponseHandler<
            ExpandedBlockResponse,
            ExpandedBlockResponseJSON
        >(fqp, response, ExpandedBlockResponse);
        // return a thor response
        return {
            request: this,
            response: expandedBlockResponse
        };
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
