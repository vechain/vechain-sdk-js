import { describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';

const TIMEOUT = 5000;

/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 */
describe('DebugModule testnet tests', () => {
    const thorClient = ThorClient.at(TESTNET_URL);

    describe('traceTransactionClause method tests', () => {
        test('ok <- transaction 1', async () => {}, TIMEOUT);
        test('ok <- transaction 1', async () => {}, TIMEOUT);
        test('ok <- transaction 2', async () => {}, TIMEOUT);
        test('ok <- transaction 2', async () => {}, TIMEOUT);
    });
});
