import { FetchHttpClient } from '@http';
import {
    GetFeesPriorityResponse,
    SuggestPriorityFee,
    ThorNetworks
} from '@thor';
import { expect } from '@jest/globals';

/**
 * @group integration/fees
 */
describe('SuggestPriorityFee SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('ok <- ask', async () => {
        const actual = (await SuggestPriorityFee.of().askTo(httpClient))
            .response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesPriorityResponse);
    });
});
