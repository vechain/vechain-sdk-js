import { Address, FetchHttpClient, Hex, Revision } from '@common';
import { describe, expect, test } from '@jest/globals';
import { Clause, ThorClient } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { ThorNetworks } from '@thor/thorest/utils';
import { PrivateKeySigner } from '@thor/signer';

// Sender is 1st solo account
const sender = Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa');
const senderPrivateKey = Hex.of(
    '0x99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'
);
// Receiver is 2nd solo account
const receiver = Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68');
// sender signer
const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
// gas payer is 3rd solo account
const gasPayer = Address.of('0x0f872421dc479f3c11edd89512731814d0598db5');
const gasPayerPrivateKey = Hex.of(
    '0xf4a1a17039216f535d42ec23732c79943ffb45a089fbb78a14daad0dae93e991'
);
const gasPayerSigner = new PrivateKeySigner(gasPayerPrivateKey.bytes);

/**
 * @group solo
 */
describe('SendTransaction SOLO tests', () => {
    describe('unsponsored transactions', () => {
        test('should send a dynamic fee unsponsored VET transfer transaction', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
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
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
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
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            // create tx request to send 1 wei VET to receiver
            const clauses = [new Clause(receiver, 1n)];
            const builder = TransactionBuilder.create(thorClient);
            const txRequest = await builder
                .withClauses(clauses)
                .withSponsorReq(sender)
                .withDynFeeTxDefaults()
                .withEstimatedGas(sender, { revision: Revision.BEST })
                .build();
            // sign the tx request as sender
            const senderSignedTxRequest = senderSigner.sign(txRequest);
            // sign the tx request as gas payer
            const gasPayerSignedTxRequest = gasPayerSigner.sign(
                senderSignedTxRequest
            );
            console.log(
                'should send a dynamic fee sponsored VET transfer transaction',
                gasPayerSignedTxRequest.toJSON()
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
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            // create tx request to send 1 wei VET to receiver
            const clauses = [new Clause(receiver, 1n)];
            const builder = TransactionBuilder.create(thorClient);
            const txRequest = await builder
                .withClauses(clauses)
                .withSponsorReq(sender)
                .withLegacyTxDefaults()
                .withEstimatedGas(sender, {
                    revision: Revision.BEST
                })
                .build();
            // sign the tx request
            const senderSignedTxRequest = senderSigner.sign(txRequest);
            // sign the tx request as gas payer
            const gasPayerSignedTxRequest = gasPayerSigner.sign(
                senderSignedTxRequest
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
