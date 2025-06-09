import { describe, expect } from '@jest/globals';
import {
    type EventLogFilterRequestJSON,
    EventLogsResponse,
    QuerySmartContractEvents,
    ThorNetworks
} from '@thor';
import { FetchHttpClient } from '@http';

/**
 * group integration/logsyarn stop-thor-solo
 */
describe('QuerySmartContractEvents SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

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
