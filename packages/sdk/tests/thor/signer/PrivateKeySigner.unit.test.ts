import { TEST_ACCOUNTS } from '../../fixture';
import { Address, HexUInt } from '@common';
import {
    ClauseBuilder,
    PrivateKeySigner,
    Transaction,
    type TransactionBody,
    TransactionRequestRLPCodec
} from '@thor';
import { Clause, TransactionRequest } from '@thor/thor-client';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

// TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
const ORIGIN_KEY =
    '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'; // THIS SOLO DEFAULT ACCOUNT[1]

describe('PrivateKeySigner', () => {
    const mockBlockRef = HexUInt.of('0x00000058f9f24003');
    const mockChainTag = 179;
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 0n; // 123n
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3;
    const mockValue = 10n ** 18n; // 1 VET

    describe('sign', () => {
        test('test', () => {
            const transferClause = ClauseBuilder.transferVET(
                Address.of(TRANSACTION_RECEIVER.address),
                mockValue
            );
            const txBody: TransactionBody = {
                chainTag: mockChainTag,
                blockRef: mockBlockRef.toString(),
                expiration: mockExpiration,
                clauses: [transferClause],
                gasPriceCoef: Number(mockGasPriceCoef),
                gas: Number(mockGas),
                dependsOn: null,
                nonce: mockNonce
            };
            const signedTx = Transaction.of(txBody).sign(
                HexUInt.of(ORIGIN_KEY).bytes
            );
            console.log(HexUInt.of(signedTx.encoded).toString());
        });

        test('ok <- legacy - no sponsored', () => {
            const transactionRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef, // Dynamic fee transactions use 0
                nonce: mockNonce
            });
            const signer = new PrivateKeySigner(HexUInt.of(ORIGIN_KEY).bytes);
            const signedTransactionRequest = signer.sign(transactionRequest);
            const encoded = TransactionRequestRLPCodec.encodeToSend(
                signedTransactionRequest
            );
            console.log(HexUInt.of(encoded).toString());
        });
    });
});
