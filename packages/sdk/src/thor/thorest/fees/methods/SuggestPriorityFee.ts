import { type HttpClient, type HttpPath, type HttpQuery } from '@common/http';
import {
    GetFeesPriorityResponse,
    ThorError,
    type GetFeesPriorityResponseJSON,
    type ThorRequest,
    type ThorResponse
} from '@thor/thorest';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/fees/SuggestPriorityFee.ts!';

/**
 * [Suggest a priority fee for a transaction to be included in a block](http://localhost:8669/doc/stoplight-ui/#/paths/fees-priority/get)
 */
class SuggestPriorityFee
    implements ThorRequest<SuggestPriorityFee, GetFeesPriorityResponse>
{
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
     * @throws {ThorError} If there is an error while processing the response or if the response status is not OK.
     */
    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<SuggestPriorityFee, GetFeesPriorityResponse>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient: Promise<ThorResponse<SuggestPriorityFee, GetFeesPriorityResponse>>`;
        const response = await httpClient.get(
            SuggestPriorityFee.PATH,
            SuggestPriorityFee.QUERY
        );
        if (response.ok) {
            const json = (await response.json()) as GetFeesPriorityResponseJSON;
            try {
                return {
                    request: this,
                    response: new GetFeesPriorityResponse(json)
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
     * Creates and returns a new instance of the SuggestPriorityFee class.
     *
     * @return {SuggestPriorityFee} A new instance of SuggestPriorityFee.
     */
    static of(): SuggestPriorityFee {
        return new SuggestPriorityFee();
    }
}

export { SuggestPriorityFee };
