// RLPCodecTransactionRequest.test.ts
import { describe, expect } from '@jest/globals';
import {
    Clause,
    ClauseBuilder,
    RLPCodecTransactionRequest,
    type TransactionBody,
    TransactionRequest
} from '@thor';
import { BlockRef } from '@vcdm';
import { Address, Transaction } from '@vechain/sdk';
import { SOLO_NETWORK } from '@utils';
import { TEST_ACCOUNTS } from '../../fixture';

const { TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/*
 * @group unit/thor/signer
 */
describe('RLPCodecTransactionRequest UNIT tests', () => {
    describe('encode delegated', () => {
        test('ok <- valid transaction request', () => {
            const transactionRequest = new TransactionRequest(
                BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ), // blockRef
                SOLO_NETWORK.chainTag, // chainTag
                [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        1n,
                        null,
                        null,
                        null
                    )
                ], // clauses
                32, // expiration
                100000n, // gas
                0n, // gasPriceCoef
                8, // nonce
                null, // dependsOn,
                true
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
            const expected = Transaction.of(txBody).encode(false);
            // console.log(Hex.of(expected).toString());
            const actual =
                RLPCodecTransactionRequest.encodeTransactionRequest(
                    transactionRequest
                );
            // console.log(Hex.of(actual).toString());
            expect(actual).toEqual(expected);
        });
    });

    describe('encode not delegated', () => {
        test('ok <- sdk 2 equivalence', () => {
            const transactionRequest = new TransactionRequest(
                BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ), // blockRef
                SOLO_NETWORK.chainTag, // chainTag
                [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        1n,
                        null,
                        null,
                        null
                    )
                ], // clauses
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
            const expected = Transaction.of(txBody).encode(false);
            const actual =
                RLPCodecTransactionRequest.encodeTransactionRequest(
                    transactionRequest
                );
            expect(actual).toEqual(expected);
        });
    });
});
