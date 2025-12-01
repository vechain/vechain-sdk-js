import { describe, expect } from '@jest/globals';
import { QueryVETTransferEvents, TransferLogsResponse } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { type TransferLogFilter } from '@thor/thor-client/model/logs/TransferLogFilter';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group solo
 */
describe('QueryVETTransferEvents SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('ok <- askTo - not empty', async () => {
        const filter: TransferLogFilter = {
            range: {
                unit: 'block',
                from: 0,
                to: 100
            },
            order: 'desc'
        };
        const request = QueryVETTransferEvents.of(filter);
        const actual = (await request.askTo(httpClient)).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toBeGreaterThan(0);
    });

    test('ok <- askTo - empty', async () => {
        const filter: TransferLogFilter = {
            range: {
                unit: 'block',
                from: 0,
                to: 0
            }
        };
        const request = QueryVETTransferEvents.of(filter);
        const actual = (await request.askTo(httpClient)).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toBe(0);
    });
});
