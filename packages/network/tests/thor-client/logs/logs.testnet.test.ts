import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    argFilterEventLogs,
    argFilterTransferLogs,
    expectedFilterEventLogs,
    expectedFilterTransferLogs
} from './fixture';
import { ThorClient } from '../../../src';
import { testnetUrl } from '../../fixture';

/**
 * ThorClient class tests
 *
 * @group integration/clients/thor-client/logs
 */
describe('ThorClient - Logs Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * filterEventLogs tests
     */
    test('filterEventLogs', async () => {
        const eventLogs =
            await thorClient.logs.filterRawEventLogs(argFilterEventLogs);
        expect(eventLogs).toStrictEqual(expectedFilterEventLogs);
    }, 3000);

    /**
     * filterTransferLogs tests
     */
    test('filterTransferLogs', async () => {
        const transferLogs = await thorClient.logs.filterTransferLogs(
            argFilterTransferLogs
        );
        //
        expect(transferLogs).toStrictEqual(expectedFilterTransferLogs);
    }, 3000);
});
