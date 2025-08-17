// RLPCodecTransactionRequest.test.ts
import { describe, expect } from '@jest/globals';
import {
    Clause,
    ClauseBuilder,
    RLPCodecTransactionRequest,
    type TransactionBody,
    TransactionRequest
} from '@thor';
import { BlockRef, Hex } from '@vcdm';
import { Address, Transaction } from '@vechain/sdk';
import { SOLO_NETWORK } from '@utils';
import { TEST_ACCOUNTS } from '../../fixture';

const { TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/*
 * @group unit/thor/signer
 */
describe('RLPCodecTransactionRequest UNIT tests', () => {
    describe('encode', () => {
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
                null // dependsOn
            );

            const expected = Hex.of(
                '0xea81f68558f9f2400320d8d7949e4e0efb170070e35a6b76b683aee91dd77805b3018080830186a08008c0'
            ).bytes;
            const actual =
                RLPCodecTransactionRequest.encode(transactionRequest);
            expect(actual).toEqual(expected);
        });

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
                RLPCodecTransactionRequest.encode(transactionRequest);
            expect(actual).toEqual(expected);
        });
    });
});
