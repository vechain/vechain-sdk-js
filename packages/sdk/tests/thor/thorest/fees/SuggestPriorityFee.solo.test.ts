import { FetchHttpClient } from '@common/http';
import {
    GetFeesPriorityResponse,
    SuggestPriorityFee,
    ThorNetworks
} from '@thor/thorest';
import { expect } from '@jest/globals';

/**
 * @group solo/thor/fees
 */
describe('SuggestPriorityFee SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('ok <- ask', async () => {
        const actual = (await SuggestPriorityFee.of().askTo(httpClient))
            .response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesPriorityResponse);
    });
});
