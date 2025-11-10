import { describe, expect } from '@jest/globals';
import {
    EventLogFilterRequest,
    EventLogsResponse,
    FilterOptionsRequest,
    FilterRangeRequest,
    QuerySmartContractEvents
} from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { FilterRangeUnits } from '@thor/thor-client/model/logs/FilterRangeUnits';
import { LogSort } from '@thor/thor-client/model/logs/LogSort';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group solo
 */
describe('QuerySmartContractEvents SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('ok <- askTo - not empty', async () => {
        const filter = new EventLogFilterRequest(
            new FilterRangeRequest(FilterRangeUnits.block, 0, 100),
            undefined,
            undefined,
            LogSort.asc
        );
        const request = new QuerySmartContractEvents(filter);
        const actual = (await request.askTo(httpClient)).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.length).toBeGreaterThan(0);
    });

    test('ok <- askTo - empty', async () => {
        const filter = new EventLogFilterRequest(
            new FilterRangeRequest(FilterRangeUnits.block, 0, 0),
            new FilterOptionsRequest(0, 100, true),
            undefined,
            undefined
        );
        const request = new QuerySmartContractEvents(filter);
        const actual = (await request.askTo(httpClient)).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.length).toEqual(0);
    });
});
