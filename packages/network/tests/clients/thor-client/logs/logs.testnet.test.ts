import { describe, expect, test } from '@jest/globals';
import { thorestClient } from '../../../fixture';
import {
    argFilterEventLogs,
    argFilterTransferLogs,
    expectedFilterEventLogs,
    expectedFilterTransferLogs
} from './fixture';
import { ThorClient } from '../../../../src';

/**
 * ThorestClient class tests
 *
 * @group integration/clients/thorest-client/logs
 */
describe('ThorestClient - Logs', () => {
    const thorClient = new ThorClient(thorestClient);
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
