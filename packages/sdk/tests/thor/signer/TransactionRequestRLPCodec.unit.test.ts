import { TEST_ACCOUNTS } from '../../fixture';
import { Address, HexUInt } from '@common';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { PrivateKeySigner, TransactionRequestRLPCodec } from '@thor';
import { describe, expect, test } from '@jest/globals';
import type { ThorSoloAccount } from '@vechain/sdk-solo-setup';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/thor/signer
 */
describe('RLPCodec', () => {
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
    const mockDependsOn = HexUInt.of(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    );
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 128n; // 123n
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3;
    const mockValue = 10n ** 15n; // .001 VET


    describe('encode/decode dynamic', () => {
        test('ok <- dynamic fee - no sponsored - unsigned', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            const expected = txRequest;
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - no sponsored - signed', () => {
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
            const originSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = originSigner.sign(txRequest);
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - gas payer signed', () => {
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
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const expected = gasPayerSigner.sign(txRequest);
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - origin signed', () => {
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
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as Sender. Partial signature.
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const expected = originSIgner.sign(txRequest);
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - both signed', () => {
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
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const expected = originSigner.sign(gasPayerSigner.sign(txRequest));
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });

    describe('encode/decode legacy', () => {
        test('ok <- legacy - no sponsored - unsigned', () => {
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
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
        });

        test('ok <- legacy - no sponsored - signed', () => {
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
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const expected = txRequest;
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            console.log(actual);
        });

        test('ok <- legacy - - sponsored - gas payer signed', () => {
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
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
            );
            const expected = gasPayerSigner.sign(txRequest);
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            console.log(actual);
        });

        test('ok <- legacy - sponsored - origin signed', () => {
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
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = originSIgner.sign(txRequest);
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            console.log(actual);
        });

        test('ok <- legacy - sponsored - both signed', () => {
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
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
            );
            const originSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = originSigner.sign(gasPayerSigner.sign(txRequest));
            const actual = TransactionRequestRLPCodec.decode(
                TransactionRequestRLPCodec.encode(expected)
            );
            console.log(actual);
        });
    });

    // describe('encode/decode clauses', () => {
    //     test('ok <- no clauses', () => {
    //         const expected = new TransactionRequest({
    //             blockRef: mockBlockRef,
    //             chainTag: 1,
    //             clauses: [],
    //             dependsOn: null,
    //             expiration: mockExpiration,
    //             gas: mockGas,
    //             gasPriceCoef: 0n,
    //             nonce: mockNonce
    //         });
    //         const actual = TransactionRequestRLPCodec.decode(
    //             TransactionRequestRLPCodec.encode(expected)
    //         );
    //         // expect(actual.toJSON()).toEqual(expected.toJSON());
    //     });
    //
    //     test('ok <- minimal properties', () => {
    //         const expected = new TransactionRequest({
    //             blockRef: mockBlockRef,
    //             chainTag: 1,
    //             clauses: [new Clause(null, mockValue.bi)],
    //             dependsOn: null,
    //             expiration: mockExpiration,
    //             gas: mockGas,
    //             gasPriceCoef: 0n,
    //             nonce: mockNonce
    //         });
    //
    //         const actual = TransactionRequestRLPCodec.decode(
    //             TransactionRequestRLPCodec.encode(expected)
    //         );
    //         // expect(actual.toJSON()).toEqual(expected.toJSON());
    //     });
    //
    //     test('ok <- all properties', () => {
    //         const expected = new TransactionRequest({
    //             blockRef: mockBlockRef,
    //             chainTag: 1,
    //             clauses: [
    //                 new Clause(
    //                     Address.of(TRANSACTION_RECEIVER.address),
    //                     mockValue.bi,
    //                     HexUInt.of('0xabcdef'),
    //                     'test comment',
    //                     '0xabcdef'
    //                 )
    //             ],
    //             dependsOn: null,
    //             expiration: mockExpiration,
    //             gas: mockGas,
    //             gasPriceCoef: 0n,
    //             nonce: mockNonce
    //         });
    //
    //         const actual = TransactionRequestRLPCodec.decode(
    //             TransactionRequestRLPCodec.encode(expected)
    //         );
    //         // expect(actual.toJSON()).toEqual(expected.toJSON());
    //     });
    // });
});
