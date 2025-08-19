/*
 * @group unit/thor/signer
 */
import { Clause, ClauseBuilder, PrivateKeySigner, type Signer, type TransactionBody, TransactionRequest } from '@thor';
import { BlockRef, HexUInt } from '@vcdm';
import { SOLO_NETWORK } from '@utils';
import { Address, Transaction } from '@vechain/sdk';
import { describe, expect } from '@jest/globals';

describe('PrivateKeySigner UNIT tests', () => {
    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const toAddress = Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68'); // THIS SOLO DEFAULT ACCOUNT[1]

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const fromKey = HexUInt.of(
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'
    ).bytes; // THIS SOLO DEFAULT ACCOUNT[1]

    describe('sign - delegated', () => {
        test('ok <- sdk 2 equivalence', () => {
            const transactionRequest = new TransactionRequest(
                BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ), // blockRef
                SOLO_NETWORK.chainTag, // chainTag
                [new Clause(toAddress, 1n, null, null, null)], // clauses
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
            const expected = Transaction.of(txBody).signAsSender(fromKey);
            const signer: Signer = new PrivateKeySigner(fromKey);
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
                [new Clause(toAddress, 1n, null, null, null)], // clauses
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
            const expected = Transaction.of(txBody).sign(fromKey);
            const signer: Signer = new PrivateKeySigner(fromKey);
            const actual = signer.sign(transactionRequest).signature;
            expect(actual).toEqual(expected.signature);
        });
    });
});
