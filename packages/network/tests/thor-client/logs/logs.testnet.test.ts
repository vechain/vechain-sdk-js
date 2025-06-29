import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    argFilterEventLogs,
    argFilterTransferLogs,
    expectedFilterEventLogs,
    expectedFilterTransferLogs
} from './fixture';
import { TESTNET_URL, ThorClient } from '../../../src';
import { retryOperation } from '../../test-utils';

/**
 * ThorClient class tests
 *
 * @group integration/clients/thor-client/logs
 */
describe('ThorClient - Logs Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * filterGroupedEventLogs tests
     */
    test('filterEventLogs', async () => {
        const eventLogs = await retryOperation(async () => {
            return await thorClient.logs.filterRawEventLogs(argFilterEventLogs);
        });
        expect(eventLogs).toEqual(expectedFilterEventLogs);
    }, 15000);

    /**
     * filterTransferLogs tests
     */
    test('filterTransferLogs', async () => {
        const transferLogs = await retryOperation(async () => {
            return await thorClient.logs.filterTransferLogs(
                argFilterTransferLogs
            );
        });
        //
        expect(transferLogs).toEqual(expectedFilterTransferLogs);
    }, 15000);
});
