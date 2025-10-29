import { TimeoutError } from '@common/errors';
import { FetchHttpClient } from '@common/http';
import { Address, Hex, Revision } from '@common/vcdm';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import { Clause, ThorClient } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { ThorNetworks } from '@thor/thorest/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';

/**
 * @group solo
 */
describe('WaitForTxReceipt SOLO tests', () => {
    let thorClient: ThorClient;
    beforeAll(() => {
        thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
    });

    test('wait for a historic tx receipt', async () => {
        // wait for seeding tx receipt which is already included in a block
        const soloConfig = getConfigData();
        const soloTxId = Hex.of(soloConfig.SEED_VTHO_TX_ID);
        const receipt =
            await thorClient.transactions.waitForTransactionReceipt(soloTxId);
        expect(receipt).toBeDefined();
        expect(receipt).not.toBeNull();
        expect(receipt?.meta.blockNumber).toBeGreaterThan(0);
        expect(receipt?.reverted).toBe(false);
    });
    test('wait for a pending tx receipt with custom options', async () => {
        // create a new transaction and wait for its receipt
        const soloConfig = getConfigData();
        const sender = Address.of(soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]);
        const senderPrivateKey = Hex.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
        );
        const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
        const receiver = Address.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[1]
        );
        const clauses = [new Clause(receiver, 1n)];
        const builder = TransactionBuilder.create(thorClient);
        const txRequest = await builder
            .withClauses(clauses)
            .withDynFeeTxDefaults()
            .withEstimatedGas(sender, { revision: Revision.BEST })
            .build();
        // sign the tx request
        const signedTxRequest = senderSigner.sign(txRequest);
        // send the transaction
        const txId =
            await thorClient.transactions.sendTransaction(signedTxRequest);
        // wait for the receipt of the newly created transaction
        const receipt = await thorClient.transactions.waitForTransactionReceipt(
            txId,
            { timeoutMs: 5000, intervalMs: 500 }
        );
        expect(receipt).toBeDefined();
        expect(receipt).not.toBeNull();
        expect(receipt?.meta.blockNumber).toBeGreaterThan(0);
        expect(receipt?.reverted).toBe(false);
    });
    test('wait for a transaction receipt with default options', async () => {
        // create a new transaction and wait for its receipt
        const soloConfig = getConfigData();
        const sender = Address.of(soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]);
        const senderPrivateKey = Hex.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
        );
        const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
        const receiver = Address.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[1]
        );
        const clauses = [new Clause(receiver, 1n)];
        const builder = TransactionBuilder.create(thorClient);
        const txRequest = await builder
            .withClauses(clauses)
            .withDynFeeTxDefaults()
            .withEstimatedGas(sender, { revision: Revision.BEST })
            .build();
        // sign the tx request
        const signedTxRequest = senderSigner.sign(txRequest);
        // send the transaction
        const txId =
            await thorClient.transactions.sendTransaction(signedTxRequest);
        // wait for the receipt of the newly created transaction
        const receipt =
            await thorClient.transactions.waitForTransactionReceipt(txId);
        expect(receipt).toBeDefined();
        expect(receipt).not.toBeNull();
        expect(receipt?.meta.blockNumber).toBeGreaterThan(0);
        expect(receipt?.reverted).toBe(false);
    });
    test('wait for a transaction receipt with unknown tx id', async () => {
        // this is to check that the wait does properly throw a WaitForTransactionReceiptTimeoutError
        const unknownTxId = Hex.of(
            '0xdeadbeefcafebabef00dbad00badd00dfeedface1337c0ffee000000baadf00d'
        );
        const getReceiptPromise =
            thorClient.transactions.waitForTransactionReceipt(unknownTxId, {
                timeoutMs: 1000,
                intervalMs: 100
            });
        await expect(async () => await getReceiptPromise).rejects.toThrow(
            TimeoutError
        );
    });
});
