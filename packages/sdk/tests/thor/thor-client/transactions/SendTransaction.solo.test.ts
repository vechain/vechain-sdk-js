import { Address, Hex, Revision } from '@common';
import { describe, expect, test } from '@jest/globals';
import { Clause, ThorClient } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { PrivateKeySigner } from '@thor/signer';
import { getConfigData } from '@vechain/sdk-solo-setup';
import { ThorNetworks } from '@thor/utils/const/network';

const soloConfig = getConfigData();
// Sender is 1st solo account
const sender = Address.of(soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]);
const senderPrivateKey = Hex.of(
    soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
);
// Receiver is 2nd solo account
const receiver = Address.of(soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[1]);
// sender signer
const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
// gas payer is 3rd solo account
const gasPayer = Address.of(soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[2]);
const gasPayerPrivateKey = Hex.of(
    soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[2]
);
const gasPayerSigner = new PrivateKeySigner(gasPayerPrivateKey.bytes);

/**
 * @group solo
 */
describe('SendTransaction SOLO tests', () => {
    describe('unsponsored transactions', () => {
        test('should send a dynamic fee unsponsored VET transfer transaction', async () => {
            const thorClient = ThorClient.at(ThorNetworks.SOLONET);
            // create tx request to send 1 wei VET to receiver
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
            expect(txId).toBeDefined();
            expect(txId).not.toBeNull();
            expect(txId).toBeInstanceOf(Hex);
            // read back the transaction by ID from the network (could be pending)
            const retrievedTx = await thorClient.transactions.getTransaction(
                txId,
                { pending: true }
            );
            expect(retrievedTx).toBeDefined();
            expect(retrievedTx).not.toBeNull();
            expect(retrievedTx?.id).toBeDefined();
            expect(retrievedTx?.id.toString()).toEqual(txId.toString());
        });
        test('should send a legacy unsponsored VET transfer transaction', async () => {
            const thorClient = ThorClient.at(ThorNetworks.SOLONET);
            // create tx request to send 1 wei VET to receiver
            const clauses = [new Clause(receiver, 1n)];
            const builder = TransactionBuilder.create(thorClient);
            const txRequest = await builder
                .withClauses(clauses)
                .withLegacyTxDefaults()
                .withEstimatedGas(sender, {
                    revision: Revision.BEST
                })
                .build();
            // sign the tx request
            const signedTxRequest = senderSigner.sign(txRequest);
            // send the transaction
            const txId =
                await thorClient.transactions.sendTransaction(signedTxRequest);
            expect(txId).toBeDefined();
            expect(txId).not.toBeNull();
            expect(txId).toBeInstanceOf(Hex);
            // read back the transaction by ID from the network (could be pending)
            const retrievedTx = await thorClient.transactions.getTransaction(
                txId,
                { pending: true }
            );
            expect(retrievedTx).toBeDefined();
            expect(retrievedTx).not.toBeNull();
            expect(retrievedTx?.id).toBeDefined();
            expect(retrievedTx?.id.toString()).toEqual(txId.toString());
        });
    });
    describe('sponsored transactions', () => {
        test('should send a dynamic fee sponsored VET transfer transaction', async () => {
            const thorClient = ThorClient.at(ThorNetworks.SOLONET);
            // create tx request to send 1 wei VET to receiver
            const clauses = [new Clause(receiver, 1n)];
            const builder = TransactionBuilder.create(thorClient);
            const txRequest = await builder
                .withClauses(clauses)
                .withDelegatedFee()
                .withDynFeeTxDefaults()
                .withEstimatedGas(sender, { revision: Revision.BEST })
                .build();
            // sign the tx request as sender
            const senderSignedTxRequest = senderSigner.sign(txRequest);
            // sign the tx request as gas payer
            const gasPayerSignedTxRequest = gasPayerSigner.sign(
                senderSignedTxRequest,
                Address.of(sender.toString())
            );
            // send the transaction
            const txId = await thorClient.transactions.sendTransaction(
                gasPayerSignedTxRequest
            );
            expect(txId).toBeDefined();
            expect(txId).not.toBeNull();
            expect(txId).toBeInstanceOf(Hex);
            // read back the transaction by ID from the network (could be pending)
            const retrievedTx = await thorClient.transactions.getTransaction(
                txId,
                { pending: true }
            );
            expect(retrievedTx).toBeDefined();
            expect(retrievedTx).not.toBeNull();
            expect(retrievedTx?.id).toBeDefined();
            expect(retrievedTx?.id.toString()).toEqual(txId.toString());
            expect(retrievedTx?.delegator).toBeDefined();
            expect(retrievedTx?.delegator?.toString()).toEqual(
                gasPayer.toString()
            );
        });
        test('should send a legacy sponsored VET transfer transaction', async () => {
            const thorClient = ThorClient.at(ThorNetworks.SOLONET);
            // create tx request to send 1 wei VET to receiver
            const clauses = [new Clause(receiver, 1n)];
            const builder = TransactionBuilder.create(thorClient);
            const txRequest = await builder
                .withClauses(clauses)
                .withDelegatedFee()
                .withLegacyTxDefaults()
                .withEstimatedGas(sender, {
                    revision: Revision.BEST
                })
                .build();
            // sign the tx request
            const senderSignedTxRequest = senderSigner.sign(txRequest);
            // sign the tx request as gas payer
            const gasPayerSignedTxRequest = gasPayerSigner.sign(
                senderSignedTxRequest,
                Address.of(sender.toString())
            );
            // send the transaction
            const txId = await thorClient.transactions.sendTransaction(
                gasPayerSignedTxRequest
            );
            expect(txId).toBeDefined();
            expect(txId).not.toBeNull();
            expect(txId).toBeInstanceOf(Hex);
            // read back the transaction by ID from the network (could be pending)
            const retrievedTx = await thorClient.transactions.getTransaction(
                txId,
                { pending: true }
            );
            expect(retrievedTx).toBeDefined();
            expect(retrievedTx).not.toBeNull();
            expect(retrievedTx?.id).toBeDefined();
            expect(retrievedTx?.id.toString()).toEqual(txId.toString());
            expect(retrievedTx?.delegator).toBeDefined();
            expect(retrievedTx?.delegator?.toString()).toEqual(
                gasPayer.toString()
            );
        });
    });
});
