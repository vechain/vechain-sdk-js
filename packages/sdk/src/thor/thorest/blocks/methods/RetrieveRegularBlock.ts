import { type ThorRequest, type ThorResponse } from '@thor/thorest';
import { RegularBlockResponse } from '@thor/thorest/blocks/response';
import { type RegularBlockResponseJSON } from '@thor/thorest/json';
import { type HttpClient, type HttpPath } from '@common/http';
import { type Revision } from '@common/vcdm';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * Retrieve a regular block
 */
class RetrieveRegularBlock implements ThorRequest<
    RetrieveRegularBlock,
    RegularBlockResponse | null
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
     * @return {Promise<ThorResponse<RetrieveRegularBlock, RegularBlockResponse | null>>}
     * Returns a promise that resolves to a ThorResponse containing the requested block.
     * @throws ThorError if the response is invalid or the request fails.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<
        ThorResponse<RetrieveRegularBlock, RegularBlockResponse | null>
    > {
        const fqp = 'RetrieveRegularBlock.askTo';

        // do http get request - this will throw an error if the request fails
        const response = await httpClient.get(this.path, {
            query: '?raw=false'
        });
        // parse the nullableresponse - this will throw an error if the response cannot be parsed
        const regularBlockResponse = await parseResponseHandler<
            RegularBlockResponse,
            RegularBlockResponseJSON
        >(fqp, response, RegularBlockResponse);
        // return a thor response
        return {
            request: this,
            response: regularBlockResponse
        };
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
