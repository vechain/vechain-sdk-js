import { describe, expect } from '@jest/globals';
import { QueryVETTransferEvents, TransferLogsResponse } from '@thor';
import { FetchHttpClient } from '@http';
import { TransferLogFilter } from '@thor/thor-client/model/logs/TransferLogFilter';
import { FilterRange } from '@thor/thor-client/model/logs/FilterRange';
import { FilterOptions } from '@thor/thor-client/model/logs/FilterOptions';
import { FilterRangeUnits } from '@thor/thor-client/model/logs/FilterRangeUnits';
import { LogSort } from '@thor/thor-client/model/logs/LogSort';
import { ThorNetworks } from '@thor/utils/ThorNetworks';

/**
 * @group solo
 */
describe('QueryVETTransferEvents SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('ok <- askTo - not empty', async () => {
        const filter = new TransferLogFilter(
            new FilterRange(FilterRangeUnits.block, 0, 100),
            null,
            null,
            LogSort.desc
        );
        const request = QueryVETTransferEvents.of(filter);
        const actual = (await request.askTo(httpClient)).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toBeGreaterThan(0);
    });

    test('ok <- askTo - empty', async () => {
        const filter = new TransferLogFilter(
            new FilterRange(FilterRangeUnits.block, 0, 0),
            null,
            null,
            null
        );
        const request = QueryVETTransferEvents.of(filter);
        const actual = (await request.askTo(httpClient)).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toBe(0);
    });
});
