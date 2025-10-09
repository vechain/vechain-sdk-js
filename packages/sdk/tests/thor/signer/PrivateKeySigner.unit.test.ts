import { describe, expect, test } from '@jest/globals';
import { Address, Hex, HexUInt } from '@common';
import { PrivateKeySigner, Transaction } from '@thor';
import { Clause, TransactionRequest } from '@thor/thor-client';
import { TEST_ACCOUNTS } from '../../fixture';
import { ThorSoloAccount } from '@vechain/sdk-solo-setup';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/thor/signer
 */
describe('PrivateKeySigner UNIT test', () => {
    const mockSenderAccount = {
        privateKey:
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
        address: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
    } satisfies ThorSoloAccount;
    const mockReceiverAccount = {
        privateKey:
            '62183dac319418f40e47dec7b60f104d0d6a9e248860b005e8b6d36cf9e8f11a',
        address: '0x9E4E0efb170070e35A6b76b683aEE91dd77805B3'
    } satisfies ThorSoloAccount;

    const mockBlockRef = HexUInt.of('0x000000b7b1994856');
    const mockChainTag = 246;
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 128n; // 123n
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3;
    const mockValue = 10n ** 15n; // .001 VET

    describe('sign', () => {
        test('ok <- dynamic fee - no sponsored', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const signedTxRequest = signer.sign(txRequest);
            expect(signedTxRequest.isSigned).toBe(true);
            expect(signedTxRequest.originSignature).toEqual(
                signedTxRequest.signature
            );
        });

        test('ok <- legacy - no sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef, // Dynamic fee transactions use 0
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const signedTxRequest = signer.sign(txRequest);
            expect(signedTxRequest.isSigned).toBe(true);
            expect(signedTxRequest.originSignature).toEqual(
                signedTxRequest.signature
            );
        });

        test('ok <- legacy - sponsored', () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef, // Dynamic fee transactions use 0
                nonce: mockNonce
            });

            const tx = Transaction.of({
                chainTag: txRequest.chainTag,
                blockRef: txRequest.blockRef.toString(),
                expiration: txRequest.expiration,
                clauses: txRequest.clauses.map((clause: Clause) => ({
                    to: clause.to?.toString() ?? null,
                    value: clause.value,
                    data: clause.data?.toString() ?? Hex.PREFIX
                })),
                gasPriceCoef: Number(txRequest.gasPriceCoef),
                gas: Number(txRequest.gas),
                dependsOn: txRequest.dependsOn?.toString() ?? null,
                nonce: txRequest.nonce,
                reserved: {
                    features: 1
                }
            });
            const txSaS = tx.signAsSender(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            console.log(txSaS.senderSignature);
            const senderSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = senderSigner.sign(txRequest);
            console.log(txRequestSaS.originSignature);
        });
    });
});
