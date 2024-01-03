import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    argFilterEventLogs,
    argFilterTransferLogs,
    expectedFilterEventLogs,
    expectedFilterTransferLogs
} from './fixture';
import { ThorClient } from '../../../src';
import { testNetwork } from '../../fixture';

/**
 * ThorClient class tests
 *
 * @group integration/clients/thor-client/logs
 */
describe('ThorClient - Logs Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
    });

    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * filterEventLogs tests
     */
    test('filterEventLogs', async () => {
        const eventLogs =
            await thorClient.logs.filterEventLogs(argFilterEventLogs);
        expect(eventLogs).toStrictEqual(expectedFilterEventLogs);
    }, 3000);

    /**
     * filterTransferLogs tests
     */
    test('filterTransferLogs', async () => {
        const transferLogs = await thorClient.logs.filterTransferLogs(
            argFilterTransferLogs
        );
        expect(transferLogs).toStrictEqual(expectedFilterTransferLogs);
    }, 3000);
});
