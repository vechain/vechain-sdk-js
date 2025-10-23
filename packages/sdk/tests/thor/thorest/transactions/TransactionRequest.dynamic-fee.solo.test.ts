import { describe, expect, test } from '@jest/globals';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { PrivateKeySigner } from '@thor/signer';
import { Address, Hex, HexUInt, Revision } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';
import { ThorNetworks } from '@thor/thorest';
import { RetrieveExpandedBlock } from '@thor/thorest/blocks';
import {
    RetrieveTransactionReceipt,
    SendTransaction
} from '@thor/thorest/transactions';
import { ThorClient } from '@thor/thor-client/ThorClient';

/**
 * @group integration/solo
 */
describe('TransactionRequest Dynamic Fee Support - Solo Integration', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.at(httpClient);

    // Solo network test addresses
    const toAddress = '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'; // Solo default account[1]
    const fromKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'; // Solo default account[1]
    const fromSigner = new PrivateKeySigner(Hex.of(fromKey).bytes);

    // Helper to get latest block reference
    const getLatestBlockRef = async (): Promise<string> => {
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;

        if (latestBlock == null) {
            throw new Error(
                'Failed to retrieve latest block from Thor network.'
            );
        }

        // BlockRef needs to be 8 bytes (first 8 bytes of block ID)
        return latestBlock.id.toString().slice(0, 18); // 0x + 16 hex chars = 18 total
    };

    // Helper to create a basic clause
    const createTransferClause = (): Clause => {
        return new Clause(
            Address.of(toAddress),
            10n ** 15n, // 0.001 VET
            Hex.of('0x'),
            null,
            null
        );
    };

    describe('Legacy Transaction Integration', () => {
        test('should create and send legacy transaction with gasPriceCoef', async () => {
            const blockRef = await getLatestBlockRef();
            const chainTag = await thorClient.nodes.getChainTag();

            const legacyTx = new TransactionRequest({
                blockRef: HexUInt.of(blockRef),
                chainTag,
                clauses: [createTransferClause()],
                dependsOn: null,
                expiration: 32,
                gas: 21000000n,
                gasPriceCoef: 128n,
                // eslint-disable-next-line sonarjs/pseudo-random
                nonce: Math.floor(Math.random() * 1000000)
            });

            // Verify it's detected as legacy
            expect(legacyTx.isDynamicFee).toBe(false);
            expect(legacyTx.gasPriceCoef).toBe(128n);
            expect(legacyTx.maxFeePerGas).toBeUndefined();
            expect(legacyTx.maxPriorityFeePerGas).toBeUndefined();

            // Sign the transaction
            const signedTx = fromSigner.sign(legacyTx);
            expect(signedTx.isDynamicFee).toBe(false);
            expect(signedTx.isSigned).toBe(true);

            // Encode and verify no type prefix
            const encoded = signedTx.encoded;
            expect(encoded[0]).not.toBe(0x51);

            // Send to solo network
            const txResponse =
                await SendTransaction.of(encoded).askTo(httpClient);
            expect(txResponse.response).toBeDefined();
            expect(txResponse.response.id).toBeDefined();

            console.log(
                `Legacy transaction sent: ${txResponse.response.id.toString()}`
            );

            // Wait a bit and try to get receipt
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const receiptResponse = await RetrieveTransactionReceipt.of(
                txResponse.response.id
            ).askTo(httpClient);
            if (receiptResponse.response != null) {
                expect(receiptResponse.response.reverted).toBe(false);
                console.log(
                    `Legacy transaction confirmed in block: ${receiptResponse.response.meta.blockID}`
                );
            }
        }, 30000);
    });

    describe('Dynamic Fee Transaction Integration', () => {
        test('should create and send dynamic fee transaction', async () => {
            const blockRef = await getLatestBlockRef();
            const chainTag = await thorClient.nodes.getChainTag();

            const dynamicTx = new TransactionRequest({
                blockRef: HexUInt.of(blockRef),
                chainTag,
                clauses: [createTransferClause()],
                dependsOn: null,
                expiration: 32,
                gas: 25000n,
                maxFeePerGas: 10027000000000n, // 20 Gwei
                maxPriorityFeePerGas: 27000000000n, // 5 Gwei
                // eslint-disable-next-line sonarjs/pseudo-random
                nonce: Math.floor(Math.random() * 1000000)
            });

            // Verify it's detected as dynamic fee
            expect(dynamicTx.isDynamicFee).toBe(true);
            expect(dynamicTx.maxFeePerGas).toBe(10027000000000n);
            expect(dynamicTx.maxPriorityFeePerGas).toBe(27000000000n);

            // Sign the transaction
            const signedTx = fromSigner.sign(dynamicTx);
            expect(signedTx.isDynamicFee).toBe(true);
            expect(signedTx.isSigned).toBe(true);
            expect(signedTx.maxFeePerGas).toBe(10027000000000n);
            expect(signedTx.maxPriorityFeePerGas).toBe(27000000000n);

            // Encode and verify 0x51 type prefix
            const encoded = signedTx.encoded;
            expect(encoded[0]).toBe(0x51);

            // Send to solo network
            const txResponse =
                await SendTransaction.of(encoded).askTo(httpClient);
            expect(txResponse.response).toBeDefined();
            expect(txResponse.response.id).toBeDefined();

            console.log(
                `Dynamic fee transaction sent: ${txResponse.response.id.toString()}`
            );

            // Wait a bit and try to get receipt
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const receiptResponse = await RetrieveTransactionReceipt.of(
                txResponse.response.id
            ).askTo(httpClient);
            if (receiptResponse.response != null) {
                expect(receiptResponse.response.reverted).toBe(false);
                console.log(
                    `Dynamic fee transaction confirmed in block: ${receiptResponse.response.meta.blockID}`
                );
            }
        }, 30000);

        test('Should handle dynamic fee transaction with only maxFeePerGas', async () => {
            const blockRef = await getLatestBlockRef();

            const dynamicTx = new TransactionRequest({
                blockRef: HexUInt.of(blockRef),
                chainTag: await thorClient.nodes.getChainTag(),
                clauses: [createTransferClause()],
                dependsOn: null,
                expiration: 32,
                gas: 25000n,
                maxFeePerGas: 10027000000000n, // 15 Gwei,
                maxPriorityFeePerGas: 0n,
                // eslint-disable-next-line sonarjs/pseudo-random
                nonce: Math.floor(Math.random() * 1000000)
            });

            // Should still be detected as dynamic fee
            expect(dynamicTx.isDynamicFee).toBe(true);
            expect(dynamicTx.maxFeePerGas).toBe(10027000000000n);
            expect(dynamicTx.maxPriorityFeePerGas).not.toBeUndefined();

            // Sign and encode
            const signedTx = fromSigner.sign(dynamicTx);
            const encoded = signedTx.encoded;
            expect(encoded[0]).toBe(0x51);

            // Send to solo network
            const txResponse =
                await SendTransaction.of(encoded).askTo(httpClient);
            expect(txResponse.response).toBeDefined();
            expect(txResponse.response.id).toBeDefined();

            console.log(
                `Dynamic fee (maxFeePerGas only) transaction sent: ${txResponse.response.id.toString()}`
            );
        }, 30000);
    });

    describe('Backward Compatibility Integration', () => {
        test('Should handle existing legacy code patterns on solo network', async () => {
            const blockRef = await getLatestBlockRef();

            // Simulate existing code that only uses gasPriceCoef
            const existingLegacyTx = new TransactionRequest({
                blockRef: HexUInt.of(blockRef),
                chainTag: await thorClient.nodes.getChainTag(),
                clauses: [createTransferClause()],
                dependsOn: null,
                expiration: 32,
                gas: 210000n,
                gasPriceCoef: 255n, // Max legacy coefficient
                // eslint-disable-next-line sonarjs/pseudo-random
                nonce: Math.floor(Math.random() * 1000000)
                // No dynamic fee fields at all
            });

            // Should be detected as legacy
            expect(existingLegacyTx.isDynamicFee).toBe(false);
            expect(existingLegacyTx.gasPriceCoef).toBe(255n);

            // Should work with existing signer patterns
            const signedTx = fromSigner.sign(existingLegacyTx);
            expect(signedTx.isDynamicFee).toBe(false);
            expect(signedTx.gasPriceCoef).toBe(255n);

            // Should encode without type prefix
            const encoded = signedTx.encoded;
            expect(encoded[0]).not.toBe(0x51);

            // Should send successfully to solo network
            const txResponse =
                await SendTransaction.of(encoded).askTo(httpClient);
            expect(txResponse.response).toBeDefined();
            expect(txResponse.response.id).toBeDefined();

            console.log(
                `Backward compatibility transaction sent: ${txResponse.response.id.toString()}`
            );
        }, 30000);
    });

    describe('Mixed Transaction Types Integration', () => {
        test('Should handle both legacy and dynamic fee transactions in same session', async () => {
            const blockRef = await getLatestBlockRef();

            // Create both types
            const legacyTx = new TransactionRequest({
                blockRef: HexUInt.of(blockRef),
                chainTag: await thorClient.nodes.getChainTag(),
                clauses: [createTransferClause()],
                dependsOn: null,
                expiration: 32,
                gas: 21000n,
                gasPriceCoef: 100n,
                // eslint-disable-next-line sonarjs/pseudo-random
                nonce: Math.floor(Math.random() * 1000000)
            });

            const dynamicTx = new TransactionRequest({
                blockRef: HexUInt.of(blockRef),
                chainTag: await thorClient.nodes.getChainTag(),
                clauses: [createTransferClause()],
                dependsOn: null,
                expiration: 32,
                gas: 25000n,
                maxFeePerGas: 10027000000000n,
                maxPriorityFeePerGas: 27000000000n,
                // eslint-disable-next-line sonarjs/pseudo-random
                nonce: Math.floor(Math.random() * 1000000)
            });

            // Verify different detection
            expect(legacyTx.isDynamicFee).toBe(false);
            expect(dynamicTx.isDynamicFee).toBe(true);

            // Sign both
            const signedLegacy = fromSigner.sign(legacyTx);
            const signedDynamic = fromSigner.sign(dynamicTx);

            // Encode both
            const legacyEncoded = signedLegacy.encoded;
            const dynamicEncoded = signedDynamic.encoded;

            // Verify different encoding
            expect(legacyEncoded[0]).not.toBe(0x51);
            expect(dynamicEncoded[0]).toBe(0x51);
            expect(legacyEncoded).not.toEqual(dynamicEncoded);

            // Send both to solo network
            const legacyResponse =
                await SendTransaction.of(legacyEncoded).askTo(httpClient);
            expect(legacyResponse.response).toBeDefined();
            console.log(`Legacy tx: ${legacyResponse.response.id.toString()}`);

            // Send dynamic fee transaction
            const dynamicResponse =
                await SendTransaction.of(dynamicEncoded).askTo(httpClient);
            expect(dynamicResponse.response).toBeDefined();
            console.log(
                `Dynamic tx: ${dynamicResponse.response.id.toString()}`
            );
        }, 30000);
    });
});
