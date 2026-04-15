import { type HttpClient, type HttpPath, type HttpQuery } from '@common/http';
import {
    GetFeesPriorityResponse,
    type GetFeesPriorityResponseJSON,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';
import { parseResponseHandler } from '@thor/thorest/utils/ParseResponseHandler';

/**
 * [Suggest a priority fee for a transaction to be included in a block](http://localhost:8669/doc/stoplight-ui/#/paths/fees-priority/get)
 */
class SuggestPriorityFee implements ThorRequest<
    SuggestPriorityFee,
    GetFeesPriorityResponse
> {
    /**
     * Represents the API endpoint or resource path used for priority-fee-related operations.
     */
    protected static readonly PATH: HttpPath = { path: '/fees/priority' };

    /**
     * Represents an HTTP query object.
     */
    protected static readonly QUERY: HttpQuery = { query: '' };

    /**
     * Sends a GET request to retrieve priority fee suggestions.
     *
     * @param {HttpClient} httpClient - The HTTP client used to send the request.
     * @return {Promise<ThorResponse<SuggestPriorityFee, GetFeesPriorityResponse>>}
     * A promise that resolves to a ThorResponse containing the suggested priority fee and its corresponding response.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SuggestPriorityFee, GetFeesPriorityResponse>> {
        const fqp = `SuggestPriorityFee.askTo`;
        // http request - this will throw HttpError if the request fails
        const response = await httpClient.get(
            SuggestPriorityFee.PATH,
            SuggestPriorityFee.QUERY
        );
        // parse the not nullable response - this will throw InvalidThorestResponseError if the response cannot be parsed
        const feesPriority = await parseResponseHandler<
            GetFeesPriorityResponse,
            GetFeesPriorityResponseJSON
        >(fqp, response, GetFeesPriorityResponse, false);
        // return a thor response
        return {
            request: this,
            response: feesPriority
        };
    }

    /**
     * Creates and returns a new instance of the SuggestPriorityFee class.
     *
     * @return {SuggestPriorityFee} A new instance of SuggestPriorityFee.
     */
    static of(): SuggestPriorityFee {
        return new SuggestPriorityFee();
    }
}

export { SuggestPriorityFee };
