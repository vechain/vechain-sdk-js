import { describe, expect, test, beforeAll } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { FetchHttpClient } from '@common/http';
import { ThorNetworks } from '@thor/thorest/utils';
import { Address, Hex, Revision } from '@common/vcdm';
import { PrivateKeySigner } from '@thor/signer';
import { Clause } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { getConfigData } from '@vechain/sdk-solo-setup';
import { TimeoutError } from '@common/errors';

/**
 * @group solo
 */
describe('ContractsModule - wait() method timeout tests', () => {
    let thorClient: ThorClient;
    
    beforeAll(() => {
        thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
    });

    test('wait() should accept timeout options and pass them correctly', async () => {
        const soloConfig = getConfigData();
        const sender = Address.of(soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]);
        const senderPrivateKey = Hex.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
        );
        const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
        const receiver = Address.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[1]
        );
        
        // Create a simple contract call transaction
        const clauses = [new Clause(receiver, 1n)];
        const builder = TransactionBuilder.create(thorClient);
        const txRequest = await builder
            .withClauses(clauses)
            .withDynFeeTxDefaults()
            .withEstimatedGas(sender, { revision: Revision.BEST })
            .build();
        
        const signedTxRequest = senderSigner.sign(txRequest);
        const txId = await thorClient.transactions.sendTransaction(signedTxRequest);
        
        // Create a mock SendTransactionResult
        const sendResult = {
            id: txId.toString(),
            wait: async (options?: { timeoutMs?: number; intervalMs?: number }) => {
                return await thorClient.transactions.waitForTransactionReceipt(
                    txId,
                    options
                );
            }
        };

        // Wait with custom timeout options
        const result = await sendResult.wait({
            timeoutMs: 10000,
            intervalMs: 500
        });

        expect(result).toBeDefined();
        expect(result).not.toBeNull();
        if (result !== null) {
            expect(result.meta.txID.toString()).toBe(txId.toString());
            expect(result.meta.blockNumber).toBeGreaterThan(0);
            expect(result.meta.blockID).toBeDefined();
        }
    }, 15000);

    test('wait() should use default timeout when no options provided', async () => {
        // Use a non-existent transaction ID to test timeout
        const nonExistentTxId = Hex.of(
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        );

        const mockSendResult = {
            id: nonExistentTxId.toString(),
            wait: async (options?: { timeoutMs?: number; intervalMs?: number }) => {
                return await thorClient.transactions.waitForTransactionReceipt(
                    nonExistentTxId,
                    options
                );
            }
        };

        const startTime = Date.now();
        // Should throw TimeoutError after default 30s timeout
        await expect(async () => await mockSendResult.wait()).rejects.toThrow(
            TimeoutError
        );
        const endTime = Date.now();

        // Should have taken approximately 30 seconds (with tolerance)
        expect(endTime - startTime).toBeGreaterThanOrEqual(29000);
        expect(endTime - startTime).toBeLessThan(35000);
    }, 40000);

    test('wait() should timeout correctly with custom timeout options', async () => {
        const nonExistentTxId = Hex.of(
            '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        );

        const mockSendResult = {
            id: nonExistentTxId.toString(),
            wait: async (options?: { timeoutMs?: number; intervalMs?: number }) => {
                return await thorClient.transactions.waitForTransactionReceipt(
                    nonExistentTxId,
                    options
                );
            }
        };

        const startTime = Date.now();
        // Should throw TimeoutError after custom timeout
        await expect(
            async () =>
                await mockSendResult.wait({
                    timeoutMs: 2000,
                    intervalMs: 100
                })
        ).rejects.toThrow(TimeoutError);
        const endTime = Date.now();

        expect(endTime - startTime).toBeGreaterThanOrEqual(1900);
        expect(endTime - startTime).toBeLessThan(3000);
    }, 5000);
});
