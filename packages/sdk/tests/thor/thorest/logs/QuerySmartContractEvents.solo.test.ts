import { describe, expect } from '@jest/globals';
import {
    EventLogsResponse,
    QuerySmartContractEvents,
    ThorNetworks
} from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { type EventLogFilterRequestJSON } from '@thor/thorest/json';

/**
 * group integration/logs
 */
describe('QuerySmartContractEvents SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('ok <- askTo - not empty', async () => {
        const request: EventLogFilterRequestJSON = {
            range: {
                unit: 'block',
                from: 0,
                to: 100
            },
            options: {
                offset: 0,
                limit: 100,
                includeIndexes: true
            },
            order: 'asc'
        } satisfies EventLogFilterRequestJSON;
        const actual = (
            await QuerySmartContractEvents.of(request).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.length).toBeGreaterThan(0);
    });

    test('ok <- askTo - empty', async () => {
        const request: EventLogFilterRequestJSON = {
            range: {
                unit: 'block',
                from: 0,
                to: 0
            },
            options: {}
        } satisfies EventLogFilterRequestJSON;
        const actual = (
            await QuerySmartContractEvents.of(request).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.length).toEqual(0);
    });
});
