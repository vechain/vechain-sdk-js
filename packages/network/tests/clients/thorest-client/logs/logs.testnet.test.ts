import { describe, expect, test } from '@jest/globals';
import { thorClient } from '../../../fixture';
import {
    argFilterEventLogs,
    argFilterTransferLogs,
    expectedFilterEventLogs,
    expectedFilterTransferLogs
} from './fixture';

/**
 * ThorClient class tests
 *
 * @group integration/clients/thorest-client/logs
 */
describe('ThorClient - Logs', () => {
    /**
     * filterEventLogs tests
     */
    test('filterEventLogs', async () => {
        const eventLogs =
            await thorClient.logs.filterEventLogs(argFilterEventLogs);
        expect(eventLogs).toStrictEqual(expectedFilterEventLogs);
    });

    /**
     * filterTransferLogs tests
     */
    test('filterTransferLogs', async () => {
        const transferLogs = await thorClient.logs.filterTransferLogs(
            argFilterTransferLogs
        );
        expect(transferLogs).toStrictEqual(expectedFilterTransferLogs);
    });
});
