import { describe, expect, test } from '@jest/globals';
import {
    RetrieveExpandedBlock,
    RetrieveTransactionByID,
    ThorClient,
    ThorNetworks
} from '@thor';
import { Address, BlockRef, FetchHttpClient, HexUInt, Revision } from '@common';
import { TEST_ACCOUNTS } from '../../fixture';
import { Clause, TransactionRequest } from '@thor/thor-client';
import { createWalletClient } from '@viem/clients';
import { privateKeyToAccount } from 'viem/accounts';
import { log } from '@common/logging';
import { randomNonce } from '@thor/utils';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group solo/viem/clients
 */
describe('WalletClient SOLO tests', () => {
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 128n;
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockValue = 10n ** 15n; // 0.001 VET

    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.at(httpClient);

    describe('sendTransaction', () => {
        test('ok <- dynamic fee - no sponsored', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;
            if (latestBlock === null || latestBlock === undefined) {
                throw new Error('Failed to retrieve latest block');
            }
            const chainTag = await thorClient.nodes.getChainTag();
            const txRequest = new TransactionRequest({
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: randomNonce()
            });
            // Sign as Sender. Finalized signature.
            const originWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_SENDER.privateKey}`
                )
            });
            const txid = await originWallet.sendTransaction(txRequest);
            expect(txid).toBeDefined();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const tx = (
                await RetrieveTransactionByID.of(txid).askTo(httpClient)
            ).response;
            expect(tx).not.toBeNull();
            log.debug({ message: `${tx?.toJSON()}` });
        });

        test('ok <- dynamic fee, signed then sponsored', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;
            if (latestBlock === null || latestBlock === undefined) {
                throw new Error('Failed to retrieve latest block');
            }
            const chainTag = await thorClient.nodes.getChainTag();
            const txRequest = new TransactionRequest({
                beggar: Address.of(TRANSACTION_SENDER.address),
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: randomNonce()
            });
            // Sign as Sender. Partial signature.
            const originWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_SENDER.privateKey}`
                )
            });
            const encodedSaS = (await originWallet.signTransaction(txRequest))
                .bytes;
            const gasPayerWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_RECEIVER.privateKey}`
                )
            });
            const txid = await gasPayerWallet.sendTransaction(
                TransactionRequest.decode(HexUInt.of(encodedSaS))
            );
            expect(txid).toBeDefined();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const tx = (
                await RetrieveTransactionByID.of(txid).askTo(httpClient)
            ).response;
            expect(tx).not.toBeNull();
            log.debug({ message: `${tx?.toJSON()}` });
        });

        test('ok <- dynamic fee - sponsored than signed', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;
            if (latestBlock === null || latestBlock === undefined) {
                throw new Error('Failed to retrieve latest block');
            }
            const chainTag = await thorClient.nodes.getChainTag();
            const txRequest = new TransactionRequest({
                beggar: Address.of(TRANSACTION_SENDER.address),
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: randomNonce()
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_RECEIVER.privateKey}`
                )
            });
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(txRequest)
            ).bytes;
            // Sign as Sender. Finalized signature.
            const originWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_SENDER.privateKey}`
                )
            });
            const txid = await originWallet.sendTransaction(
                TransactionRequest.decode(HexUInt.of(encodedSaGP))
            );
            expect(txid).toBeDefined();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const tx = (
                await RetrieveTransactionByID.of(txid).askTo(httpClient)
            ).response;
            expect(tx).not.toBeNull();
            log.debug({ message: `${tx?.toJSON()}` });
        });

        test('ok <- legacy - no sponsored', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;
            if (latestBlock === null || latestBlock === undefined) {
                throw new Error('Failed to retrieve latest block');
            }
            const chainTag = await thorClient.nodes.getChainTag();
            const txRequest = new TransactionRequest({
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: randomNonce()
            });
            // Sign as Sender. Finalized signature.
            const originWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_SENDER.privateKey}`
                )
            });
            const txid = await originWallet.sendTransaction(txRequest);
            expect(txid).toBeDefined();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const tx = (
                await RetrieveTransactionByID.of(txid).askTo(httpClient)
            ).response;
            expect(tx).not.toBeNull();
            log.debug({ message: `${tx?.toJSON()}` });
        });

        test('ok <- legacy - signed then sponsored', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;
            if (latestBlock === null || latestBlock === undefined) {
                throw new Error('Failed to retrieve latest block');
            }
            const chainTag = await thorClient.nodes.getChainTag();
            const txRequest = new TransactionRequest({
                beggar: Address.of(TRANSACTION_SENDER.address),
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: randomNonce()
            });
            // Sign as Sender. Partial signature.
            const originWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_SENDER.privateKey}`
                )
            });
            const encodedSaS = (await originWallet.signTransaction(txRequest))
                .bytes;
            const gasPayerWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_RECEIVER.privateKey}`
                )
            });
            const txid = await gasPayerWallet.sendTransaction(
                TransactionRequest.decode(HexUInt.of(encodedSaS))
            );
            expect(txid).toBeDefined();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const tx = (
                await RetrieveTransactionByID.of(txid).askTo(httpClient)
            ).response;
            expect(tx).not.toBeNull();
            log.debug({ message: `${tx?.toJSON()}` });
        });

        test('ok <- legacy - sponsored then signed', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;
            if (latestBlock === null || latestBlock === undefined) {
                throw new Error('Failed to retrieve latest block');
            }
            const chainTag = await thorClient.nodes.getChainTag();
            const txRequest = new TransactionRequest({
                beggar: Address.of(TRANSACTION_SENDER.address),
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: randomNonce()
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_RECEIVER.privateKey}`
                )
            });
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(txRequest)
            ).bytes;
            // Sign as Sender. Finalized signature.
            const originWallet = createWalletClient({
                network: httpClient.baseURL,
                account: privateKeyToAccount(
                    `0x${TRANSACTION_SENDER.privateKey}`
                )
            });
            const txid = await originWallet.sendTransaction(
                TransactionRequest.decode(HexUInt.of(encodedSaGP))
            );
            expect(txid).toBeDefined();
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const tx = (
                await RetrieveTransactionByID.of(txid).askTo(httpClient)
            ).response;
            expect(tx).not.toBeNull();
            log.debug({ message: `${tx?.toJSON()}` });
        });
    });
});
