import { FetchHttpClient, Hex } from '@common';
import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/thorest/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';

/**
 * TransactionsModule-GetRawTransaction tests for solo network
 * @group solo
 */
describe('TransactionsModule-GetRawTransaction', () => {
    test('should get a raw transaction', async () => {
        const config = getConfigData();
        const txID = Hex.of(config.SEED_TEST_TOKEN_TX_ID);
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const txDetails = await thorClient.transactions.getRawTransaction(
            txID,
            {
                pending: false,
                head: undefined
            }
        );
        expect(txDetails).toBeDefined();
        expect(txDetails?.raw).toBeDefined();
        expect(txDetails?.meta.blockNumber).toBeDefined();
        expect(txDetails?.meta.blockTimestamp).toBeDefined();
        expect(txDetails?.meta.blockID).toBeDefined();
    });
});
