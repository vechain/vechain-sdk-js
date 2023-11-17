import { describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../../fixture';
import {
    argFilterEventLogs,
    argFilterTransferLogs,
    expectedFilterEventLogs,
    expectedFilterTransferLogs
} from './fixture';

/**
 * ThorestClient class tests
 *
 * @group integration/clients/thorest-client/logs
 */
describe('ThorestClient - Logs', () => {
    /**
     * filterEventLogs tests
     */
    test('filterEventLogs', async () => {
        const eventLogs =
            await thorestClient.logs.filterEventLogs(argFilterEventLogs);
        expect(eventLogs).toStrictEqual(expectedFilterEventLogs);
    });

    /**
     * filterTransferLogs tests
     */
    test('filterTransferLogs', async () => {
        const transferLogs = await thorestClient.logs.filterTransferLogs(
            argFilterTransferLogs
        );
        expect(transferLogs).toStrictEqual(expectedFilterTransferLogs);
    });
});
