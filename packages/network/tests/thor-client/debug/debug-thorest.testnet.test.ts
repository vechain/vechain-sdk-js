import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { testNetwork } from '../../fixture';
import { ThorClient } from '../../../src';

/**
 * ThorClient class tests
 *
 * @NOTE: This test suite run on testnet network because it contains read only tests.
 *
 * @group integration/clients/thor-client/debug
 */
describe('ThorClient - Debug Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
    });

    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * traceTransactionClause tests
     */
    describe('traceTransactionClause', () => {
        /**
         * traceTransactionClause - correct cases
         */
        test('traceTransactionClause', async () => {
            const traces = await thorClient.debug.traceTransactionClause({
                blockID:
                    '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
                transaction: 0,
                clauseIndex: 0
            });
            console.log(traces);
        });
    });
});
