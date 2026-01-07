import {
    RawBlockResponse,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { type RawBlockJSON } from '@thor/thorest/blocks/json/RawBlockJSON';
import { type HttpClient, type HttpPath } from '@common/http';
import { type Revision } from '@common/vcdm';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * Retrieve a raw block
 */
class RetrieveRawBlock implements ThorRequest<
    RetrieveRawBlock,
    RawBlockResponse | null
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
     * @return {Promise<ThorResponse<RetrieveRawBlock, RegularBlockResponse | null>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveRawBlock, RawBlockResponse | null>> {
        const fqp = 'RetrieveRawBlock.askTo';
        // do http get request - this will throw an error if the request fails
        const response = await httpClient.get(this.path, {
            query: '?raw=true'
        });
        // parse the nullable response - this will throw an error if the response cannot be parsed
        const rawBlockResponse = await parseResponseHandler<
            RawBlockResponse,
            RawBlockJSON
        >(fqp, response, RawBlockResponse);
        // return a thor response
        return {
            request: this,
            response: rawBlockResponse
        };
    }

    /**
     * Creates an instance of RetrieveExpandedBlock using the provided revision.
     *
     * @param {Revision} revision - The revision object used to generate the block's path.
     * @return {RetrieveRawBlock} A new instance of RetrieveExpandedBlock with the specified path.
     */
    static of(revision: Revision): RetrieveRawBlock {
        return new RetrieveRawBlock({ path: `/blocks/${revision}` });
    }
}

export { RetrieveRawBlock };
