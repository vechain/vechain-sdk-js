import { describe, expect } from '@jest/globals';
import {
    QueryVETTransferEvents,
    ThorNetworks,
    TransferLogsResponse,
    type TransferLogFilterRequestJSON
} from '@thor';
import { FetchHttpClient } from '@http';

/**
 * group integration/logs
 */
describe('QueryVETTransferEvents SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('ok <- askTo - not empty', async () => {
        const request = {
            range: {
                unit: 'block',
                from: 0,
                to: 100
            },
            options: {
                offset: 0,
                limit: 10,
                includeIndexes: true
            },
            order: 'desc'
        } satisfies TransferLogFilterRequestJSON;
        const actual = (
            await QueryVETTransferEvents.of(request).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toBeGreaterThan(0);
    });

    test('ok <- askTo - empty', async () => {
        const request = {
            range: {
                unit: 'block',
                from: 0,
                to: 0
            }
        } satisfies TransferLogFilterRequestJSON;
        const actual = (
            await QueryVETTransferEvents.of(request).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toBe(0);
    });
});
