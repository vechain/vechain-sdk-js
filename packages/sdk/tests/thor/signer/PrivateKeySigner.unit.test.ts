/*
 * @group unit/thor/signer
 */
import {
    Clause,
    ClauseBuilder,
    type DelegatedSignedTransactionRequest,
    PrivateKeySigner,
    type Signer,
    type TransactionBody,
    TransactionRequest
} from '@thor';
import { BlockRef, HexUInt } from '@vcdm';
import { SOLO_NETWORK } from '@utils';
import { Address, Transaction } from '@vechain/sdk';
import { describe, expect } from '@jest/globals';
import * as nc_utils from '@noble/curves/abstract/utils';

describe('PrivateKeySigner UNIT tests', () => {
    const SENDER = {
        privateKey: HexUInt.of(
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
        ).bytes
    };
    const RECEIVER = {
        address: Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39')
    };
    const GAS_PAYER = {
        privateKey: HexUInt.of(
            '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766'
        ).bytes
    };

    test('demo', () => {
        const requestTx = new TransactionRequest(
            BlockRef.of(
                '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
            ), // blockRef
            SOLO_NETWORK.chainTag, // chainTag
            [new Clause(RECEIVER.address, 1n, null, null, null)], // clauses
            32, // expiration
            100000n, // gas
            0n, // gasPriceCoef
            8, // nonce
            null, // dependsOn
            true // delegated
        );
        const sender: Signer = new PrivateKeySigner(SENDER.privateKey);
        const signedTx = sender.sign(requestTx);
        const gasPayer: PrivateKeySigner = new PrivateKeySigner(
            GAS_PAYER.privateKey
        );
        const sponsoredTx = gasPayer.sign(signedTx);
        expect(sponsoredTx.signature).toEqual(
            nc_utils.concatBytes(
                signedTx.signature,
                (sponsoredTx as DelegatedSignedTransactionRequest)
                    .gasPayerSignature
            )
        );
    });

    describe('sign - signed delegated', () => {
        test('ok <- sdk 2 equivalence', () => {
            const transactionRequest = new TransactionRequest(
                BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ), // blockRef
                SOLO_NETWORK.chainTag, // chainTag
                [new Clause(RECEIVER.address, 1n, null, null, null)], // clauses
                32, // expiration
                100000n, // gas
                0n, // gasPriceCoef
                8, // nonce
                null, // dependsOn
                true // delegated
            );

            const txBody: TransactionBody = {
                chainTag: transactionRequest.chainTag,
                blockRef: transactionRequest.blockRef.toString(),
                expiration: transactionRequest.expiration,
                clauses: [
                    ClauseBuilder.transferVET(
                        transactionRequest.clauses[0].to as Address,
                        transactionRequest.clauses[0].value
                    )
                ],
                gasPriceCoef: Number(transactionRequest.gasPriceCoef),
                gas: Number(transactionRequest.gas),
                dependsOn: transactionRequest.dependsOn?.toString() ?? null,
                nonce: transactionRequest.nonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            };
            const signedTransaction = Transaction.of(txBody).signAsSender(
                SENDER.privateKey
            );

            const sender: Signer = new PrivateKeySigner(SENDER.privateKey);
            const signedTransactionRequest = sender.sign(transactionRequest);
            expect(signedTransaction.signature).toEqual(
                signedTransactionRequest.signature
            );

            const gasPayer: Signer = new PrivateKeySigner(GAS_PAYER.privateKey);
            const expected = signedTransaction.signAsGasPayer(
                sender.address,
                GAS_PAYER.privateKey
            );
            const actual = gasPayer.sign(signedTransactionRequest);
            expect(actual.signature).toEqual(expected.signature);
        });
    });

    describe('sign - unsigned delegated', () => {
        test('ok <- sdk 2 equivalence', () => {
            const transactionRequest = new TransactionRequest(
                BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ), // blockRef
                SOLO_NETWORK.chainTag, // chainTag
                [new Clause(RECEIVER.address, 1n, null, null, null)], // clauses
                32, // expiration
                100000n, // gas
                0n, // gasPriceCoef
                8, // nonce
                null, // dependsOn
                true // delegated
            );

            const txBody: TransactionBody = {
                chainTag: transactionRequest.chainTag,
                blockRef: transactionRequest.blockRef.toString(),
                expiration: transactionRequest.expiration,
                clauses: [
                    ClauseBuilder.transferVET(
                        transactionRequest.clauses[0].to as Address,
                        transactionRequest.clauses[0].value
                    )
                ],
                gasPriceCoef: Number(transactionRequest.gasPriceCoef),
                gas: Number(transactionRequest.gas),
                dependsOn: transactionRequest.dependsOn?.toString() ?? null,
                nonce: transactionRequest.nonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            };
            const expected = Transaction.of(txBody).signAsSender(
                SENDER.privateKey
            );
            const signer: Signer = new PrivateKeySigner(SENDER.privateKey);
            const actual = signer.sign(transactionRequest).signature;
            expect(actual).toEqual(expected.signature);
        });
    });

    describe('sign - not delegated', () => {
        test('ok <- sdk 2 equivalence', () => {
            const transactionRequest = new TransactionRequest(
                BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ), // blockRef
                SOLO_NETWORK.chainTag, // chainTag
                [new Clause(RECEIVER.address, 1n, null, null, null)], // clauses
                32, // expiration
                100000n, // gas
                0n, // gasPriceCoef
                8, // nonce
                null // dependsOn
            );

            const txBody: TransactionBody = {
                chainTag: transactionRequest.chainTag,
                blockRef: transactionRequest.blockRef.toString(),
                expiration: transactionRequest.expiration,
                clauses: [
                    ClauseBuilder.transferVET(
                        transactionRequest.clauses[0].to as Address,
                        transactionRequest.clauses[0].value
                    )
                ],
                gasPriceCoef: Number(transactionRequest.gasPriceCoef),
                gas: Number(transactionRequest.gas),
                dependsOn: transactionRequest.dependsOn?.toString() ?? null,
                nonce: transactionRequest.nonce
            };
            const expected = Transaction.of(txBody).sign(SENDER.privateKey);
            const signer: Signer = new PrivateKeySigner(SENDER.privateKey);
            const actual = signer.sign(transactionRequest).signature;
            expect(actual).toEqual(expected.signature);
        });
    });
});
