import { describe, expect, test } from '@jest/globals';
import { Address, BlockRef, FetchHttpClient, HexUInt, Revision } from '@common';
import { Clause, ThorClient, TransactionRequest } from '@thor/thor-client';
import {
    PrivateKeySigner,
    RetrieveExpandedBlock,
    RetrieveTransactionByID,
    SendTransaction,
    ThorNetworks,
    TransactionRequestRLPCodec,
    TXID
} from '@thor';
import { TEST_ACCOUNTS } from '../../fixture';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group integration/thor/signer
 */
describe('PrivateKeySigner SOLO test', () => {
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 128n;
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3;
    const mockValue = 10n ** 15n; // 0.001 VET

    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.at(httpClient);

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
                new Clause(Address.of(TRANSACTION_RECEIVER.address), mockValue)
            ],
            dependsOn: null,
            expiration: mockExpiration,
            gas: mockGas,
            gasPriceCoef: 0n, // Dynamic fee transactions use 0
            maxFeePerGas: mockMaxFeePerGas,
            maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
            nonce: mockNonce
        });
        // Sign as Sender. Finalized signature.
        const signer = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const txRequestSaS = signer.sign(txRequest);
        const encodedTx = TransactionRequestRLPCodec.encode(txRequestSaS);
        console.log(HexUInt.of(encodedTx).toString());

        const txId = (await SendTransaction.of(encodedTx).askTo(httpClient))
            .response;
        expect(txId).toBeDefined();
        expect(txId).toBeInstanceOf(TXID);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tx = (await RetrieveTransactionByID.of(txId.id).askTo(httpClient))
            .response;
        console.log(tx?.toJSON());
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
            chainTag: chainTag,
            clauses: [
                new Clause(Address.of(TRANSACTION_RECEIVER.address), mockValue)
            ],
            dependsOn: null,
            expiration: mockExpiration,
            gas: mockGas,
            gasPriceCoef: 0n, // Dynamic fee transactions use 0
            maxFeePerGas: mockMaxFeePerGas,
            maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
            nonce: mockNonce
        });
        // Sign as Sender. Partial signature.
        const senderSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const txRequestSaS = senderSigner.sign(txRequest);
        // Sign as Gas Payer. Finalized signature.
        const gasPayerSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
        );
        const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
        const encodedTx = TransactionRequestRLPCodec.encode(txRequestSaGP);
        console.log(HexUInt.of(encodedTx).toString());

        const txId = (await SendTransaction.of(encodedTx).askTo(httpClient))
            .response;
        expect(txId).toBeDefined();
        expect(txId).toBeInstanceOf(TXID);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tx = (await RetrieveTransactionByID.of(txId.id).askTo(httpClient))
            .response;
        console.log(tx?.toJSON());
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
            chainTag: chainTag,
            clauses: [
                new Clause(Address.of(TRANSACTION_RECEIVER.address), mockValue)
            ],
            dependsOn: null,
            expiration: mockExpiration,
            gas: mockGas,
            gasPriceCoef: 0n, // Dynamic fee transactions use 0
            maxFeePerGas: mockMaxFeePerGas,
            maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
            nonce: mockNonce
        });
        // Sign as Gas Payer. Partial signature.
        const gasPayerSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
        );
        const txRequestSaGP = gasPayerSigner.sign(txRequest);
        // SIgn as Sender. Finalized signature.
        const senderSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const txRequestSaS = senderSigner.sign(txRequestSaGP);
        const encodedTx = TransactionRequestRLPCodec.encode(txRequestSaS);
        console.log(HexUInt.of(encodedTx).toString());

        const txId = (await SendTransaction.of(encodedTx).askTo(httpClient))
            .response;
        expect(txId).toBeDefined();
        expect(txId).toBeInstanceOf(TXID);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tx = (await RetrieveTransactionByID.of(txId.id).askTo(httpClient))
            .response;
        console.log(tx?.toJSON());
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
            chainTag: chainTag,
            clauses: [
                new Clause(Address.of(TRANSACTION_RECEIVER.address), mockValue)
            ],
            dependsOn: null,
            expiration: mockExpiration,
            gas: mockGas,
            gasPriceCoef: mockGasPriceCoef,
            nonce: mockNonce
        });
        const signer = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        // Sign as Sender. Finalized signature.
        const txRequestSaS = signer.sign(txRequest);
        const encodedTx = TransactionRequestRLPCodec.encode(txRequestSaS);
        console.log(HexUInt.of(encodedTx).toString());

        const txId = (await SendTransaction.of(encodedTx).askTo(httpClient))
            .response;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tx = (await RetrieveTransactionByID.of(txId.id).askTo(httpClient))
            .response;
        console.log(tx?.toJSON());
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
            chainTag: chainTag,
            clauses: [
                new Clause(Address.of(TRANSACTION_RECEIVER.address), mockValue)
            ],
            dependsOn: null,
            expiration: mockExpiration,
            gas: mockGas,
            gasPriceCoef: mockGasPriceCoef,
            nonce: mockNonce
        });
        expect(txRequest.isSigned).toBe(false);
        // Sign as Sender. Partial signature.
        const senderSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const txRequestSaS = senderSigner.sign(txRequest);
        // Sign as Gas Payer. Finalized signature.
        const gasPayerSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
        );
        const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
        const encodedTx = TransactionRequestRLPCodec.encode(txRequestSaGP);
        console.log(HexUInt.of(encodedTx).toString());

        const txId = (await SendTransaction.of(encodedTx).askTo(httpClient))
            .response;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tx = (await RetrieveTransactionByID.of(txId.id).askTo(httpClient))
            .response;
        console.log(tx?.toJSON());
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
            chainTag: chainTag,
            clauses: [
                new Clause(Address.of(TRANSACTION_RECEIVER.address), mockValue)
            ],
            dependsOn: null,
            expiration: mockExpiration,
            gas: mockGas,
            gasPriceCoef: mockGasPriceCoef,
            nonce: mockNonce
        });
        expect(txRequest.isSigned).toBe(false);
        // Sign as Gas Payer. Partial signature.
        const gasPayerSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
        );
        const txRequestSaGP = gasPayerSigner.sign(txRequest);
        // Sign as Sender. Finalized signature.
        const senderSigner = new PrivateKeySigner(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const txRequestSaS = senderSigner.sign(txRequestSaGP);
        const encodedTx = TransactionRequestRLPCodec.encode(txRequestSaS);
        console.log(HexUInt.of(encodedTx).toString());

        const txId = (await SendTransaction.of(encodedTx).askTo(httpClient))
            .response;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const tx = (await RetrieveTransactionByID.of(txId.id).askTo(httpClient))
            .response;
        console.log(tx?.toJSON());
    });
});
