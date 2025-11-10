import { FetchHttpClient, Hex } from '@common';
import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils/const/network';
import { getConfigData } from '@vechain/sdk-solo-setup';

/**
 * TransactionsModule-GetTransaction tests for solo network
 * @group solo
 */
describe('TransactionsModule-GetTransaction', () => {
    test('should get a transaction', async () => {
        const config = getConfigData();
        const txID = Hex.of(config.SEED_TEST_TOKEN_TX_ID);
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const txDetails = await thorClient.transactions.getTransaction(txID, {
            pending: false,
            head: undefined
        });
        expect(txDetails).toBeDefined();
        expect(txDetails?.id.compareTo(txID)).toBe(0);
    });
});
