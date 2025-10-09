import { FetchHttpClient } from '@common/http';
import { Hex } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { TransactionReceipt } from '@thor/thor-client/model/transactions';
import { ThorNetworks } from '@thor/thorest/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';

/**
 * @group solo
 */
describe('TransactionReceipt SOLO tests', () => {
    test('ok <- tx receipt for vtho seeding', async () => {
        const soloConfig = getConfigData();
        const soloTxId = Hex.of(soloConfig.SEED_VTHO_TX_ID);
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const receipt =
            await thorClient.transactions.getTransactionReceipt(soloTxId);
        expect(receipt).toBeDefined();
        expect(receipt).not.toBeNull();
        expect(receipt).toBeInstanceOf(TransactionReceipt);
    });
    test('ok <- tx receipt for vet seeding', async () => {
        const soloConfig = getConfigData();
        const soloTxId = Hex.of(soloConfig.SEED_VET_TX_ID);
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const receipt =
            await thorClient.transactions.getTransactionReceipt(soloTxId);
        expect(receipt).toBeDefined();
        expect(receipt).not.toBeNull();
        expect(receipt).toBeInstanceOf(TransactionReceipt);
    });
    test('ok <- tx receipt for test token seeding', async () => {
        const soloConfig = getConfigData();
        const soloTxId = Hex.of(soloConfig.SEED_TEST_TOKEN_TX_ID);
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const receipt =
            await thorClient.transactions.getTransactionReceipt(soloTxId);
        expect(receipt).toBeDefined();
        expect(receipt).not.toBeNull();
        expect(receipt).toBeInstanceOf(TransactionReceipt);
    });
});
