import { TEST_ACCOUNTS } from '../../../fixture';
import {
    Address,
    HexUInt,
    InvalidEncodingError,
    InvalidTransactionField
} from '@common';
import {
    Clause,
    TransactionRequest,
    type TransactionRequestParam
} from '@thor/thor-client/model/transactions';
import { PrivateKeySigner } from '@thor';
import { describe, expect, test } from '@jest/globals';
import type { ThorSoloAccount } from '@vechain/sdk-solo-setup';
import { fail } from 'assert';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/thor/signer
 */
describe('TransactionRequest UNIT tests', () => {
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

    describe('constructor', () => {
        test('ok <- legacy transaction with all parameters', () => {
            const params = {
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: HexUInt.of(
                    '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
                ),
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            } satisfies TransactionRequestParam;

            const originSig = new Uint8Array([1, 2, 3]);
            const gasPayerSig = new Uint8Array([4, 5, 6]);
            const signature = new Uint8Array([7, 8, 9]);

            const txRequest = new TransactionRequest(
                params,
                originSig,
                gasPayerSig,
                signature
            );

            expect(txRequest.gasSponsorshipRequester).toBe(
                params.gasSponsorshipRequester
            );
            expect(txRequest.blockRef).toBe(params.blockRef);
            expect(txRequest.chainTag).toBe(params.chainTag);
            expect(txRequest.clauses).toEqual(params.clauses);
            expect(txRequest.dependsOn).toBe(params.dependsOn);
            expect(txRequest.expiration).toBe(params.expiration);
            expect(txRequest.gas).toBe(params.gas);
            expect(txRequest.gasPriceCoef).toBe(params.gasPriceCoef);
            expect(txRequest.maxFeePerGas).toBeUndefined();
            expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
            expect(txRequest.nonce).toBe(params.nonce);
            expect(txRequest.isDynamicFee).toBe(false);
            expect(txRequest.isLegacy).toBe(true);
        });

        test('ok <- dynamic fee transaction with all parameters', () => {
            const params = {
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
                gasPriceCoef: undefined,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            } satisfies TransactionRequestParam;

            const txRequest = new TransactionRequest(params);

            expect(txRequest.gasSponsorshipRequester).toBe(
                params.gasSponsorshipRequester
            );
            expect(txRequest.blockRef).toBe(params.blockRef);
            expect(txRequest.chainTag).toBe(params.chainTag);
            expect(txRequest.clauses).toEqual(params.clauses);
            expect(txRequest.dependsOn).toBe(params.dependsOn);
            expect(txRequest.expiration).toBe(params.expiration);
            expect(txRequest.gas).toBe(params.gas);
            expect(txRequest.gasPriceCoef).toBeUndefined();
            expect(txRequest.maxFeePerGas).toBe(params.maxFeePerGas);
            expect(txRequest.maxPriorityFeePerGas).toBe(
                params.maxPriorityFeePerGas
            );
            expect(txRequest.nonce).toBe(params.nonce);
            expect(txRequest.isDynamicFee).toBe(true);
            expect(txRequest.isLegacy).toBe(false);
        });

        test('ok <- minimal legacy transaction without optional parameters', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            } satisfies TransactionRequestParam;

            const txRequest = new TransactionRequest(params);

            expect(txRequest.gasSponsorshipRequester).toBeUndefined();
            expect(txRequest.blockRef).toBe(params.blockRef);
            expect(txRequest.chainTag).toBe(params.chainTag);
            expect(txRequest.clauses).toEqual(params.clauses);
            expect(txRequest.dependsOn).toBe(params.dependsOn);
            expect(txRequest.expiration).toBe(params.expiration);
            expect(txRequest.gas).toBe(params.gas);
            expect(txRequest.gasPriceCoef).toBe(params.gasPriceCoef);
            expect(txRequest.maxFeePerGas).toBeUndefined();
            expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
            expect(txRequest.nonce).toBe(params.nonce);
            expect(txRequest.isDynamicFee).toBe(false);
            expect(txRequest.isLegacy).toBe(true);
        });

        test('ok <- minimal dynamic fee transaction', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: 1n,
                maxPriorityFeePerGas: 0n,
                nonce: mockNonce
            };

            const txRequest = new TransactionRequest(params);

            expect(txRequest.maxFeePerGas).toBe(1n);
            expect(txRequest.maxPriorityFeePerGas).toBe(0n);
            expect(txRequest.gasPriceCoef).toBeUndefined();
            expect(txRequest.isDynamicFee).toBe(true);
            expect(txRequest.isLegacy).toBe(false);
        });

        test('ok <- handles undefined signatures with empty arrays', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const txRequest = new TransactionRequest(params);

            expect(txRequest.originSignature).toEqual(new Uint8Array([]));
            expect(txRequest.gasPayerSignature).toEqual(new Uint8Array([]));
            expect(txRequest.signature).toEqual(new Uint8Array([]));
        });

        test('ok <- legacy transaction with gasPriceCoef = 0', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            };

            const txRequest = new TransactionRequest(params);
            expect(txRequest.gasPriceCoef).toBe(0n);
            expect(txRequest.isLegacy).toBe(true);
            expect(txRequest.isDynamicFee).toBe(false);
        });

        test('ok <- dynamic fee transaction with maxPriorityFeePerGas = 0', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: 1n,
                maxPriorityFeePerGas: 0n,
                nonce: mockNonce
            };

            const txRequest = new TransactionRequest(params);
            expect(txRequest.maxPriorityFeePerGas).toBe(0n);
            expect(txRequest.isDynamicFee).toBe(true);
            expect(txRequest.isLegacy).toBe(false);
        });

        test('err <- throws InvalidTransactionField for invalid fee configuration - no gas pricing', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- throws InvalidTransactionField for mixed fee configuration - legacy and dynamic', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- throws InvalidTransactionField for negative gasPriceCoef', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: -1n,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- throws InvalidTransactionField for zero maxFeePerGas', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: 0n,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- throws InvalidTransactionField for negative maxPriorityFeePerGas', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: -1n,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- throws InvalidTransactionField for partial dynamic fee configuration - only maxFeePerGas', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: undefined,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- throws InvalidTransactionField for partial dynamic fee configuration - only maxPriorityFeePerGas', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });

        test('err <- verifies error message and context', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
                nonce: mockNonce
            };

            try {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
                fail('Expected InvalidTransactionField to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidTransactionField);
                const invalidFieldError = error as InvalidTransactionField;
                expect(invalidFieldError.message).toContain(
                    'Invalid parameters'
                );
                expect(invalidFieldError.args).toEqual({ params });
            }
        });

        test('err <- throws InvalidTransactionField for sponsorship requester but remote gas payer url is provided', () => {
            const params = {
                gasSponsorshipRequester: undefined,
                gasPayerServiceUrl: new URL('http://localhost:4000'),
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: undefined,
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
                nonce: mockNonce
            };

            expect(() => {
                // eslint-disable-next-line no-new,sonarjs/constructor-for-side-effects
                new TransactionRequest(params);
            }).toThrow(InvalidTransactionField);
        });
    });

    describe('defensive copying of signatures', () => {
        test('ok <- creates defensive copy of originSignature', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const originalSig = new Uint8Array([1, 2, 3]);
            const txRequest = new TransactionRequest(params, originalSig);

            // Modify original array
            originalSig[0] = 99;

            // Should not affect the transaction request
            expect(txRequest.originSignature[0]).toBe(1);
            expect(txRequest.originSignature).not.toBe(originalSig);
        });

        test('ok <- creates defensive copy of gasPayerSignature', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const gasPayerSig = new Uint8Array([4, 5, 6]);
            const txRequest = new TransactionRequest(
                params,
                undefined,
                gasPayerSig
            );

            // Modify original array
            gasPayerSig[0] = 99;

            // Should not affect the transaction request
            expect(txRequest.gasPayerSignature[0]).toBe(4);
            expect(txRequest.gasPayerSignature).not.toBe(gasPayerSig);
        });

        test('ok <- creates defensive copy of signature', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const signature = new Uint8Array([7, 8, 9]);
            const txRequest = new TransactionRequest(
                params,
                undefined,
                undefined,
                signature
            );

            // Modify original array
            signature[0] = 99;

            // Should not affect the transaction request
            expect(txRequest.signature[0]).toBe(7);
            expect(txRequest.signature).not.toBe(signature);
        });
    });

    describe('encode/decode/hash dynamic', () => {
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
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            const actual = TransactionRequest.decode(txRequest.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(txRequest.toJSON());
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
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            const originSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = originSigner.sign(txRequest);
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - unsigned', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            const expected = txRequest;
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - gas payer signed', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const expected = gasPayerSigner.sign(txRequest);
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - origin signed', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as Sender. Partial signature.
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const expected = originSIgner.sign(txRequest);
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - both signed', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('err <- dynamic fee - throw for incorrect encoded size', () => {
            // Create a malformed dynamic fee transaction (starts with 0x51 prefix)
            // but has incorrect number of fields in the RLP structure
            const malformedDynamicFeeData = new Uint8Array([
                0x51, // Dynamic fee prefix
                0xc3, // RLP list with 3 bytes of data
                0x01, // First element: 1
                0x02, // Second element: 2
                0x03 // Third element: 3
            ]);

            expect(() => {
                TransactionRequest.decode(malformedDynamicFeeData);
            }).toThrow('invalid encoded transaction request');
        });
    });

    describe('encode/decode/hash legacy', () => {
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
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const expected = txRequest;
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
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
            const originSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = originSigner.sign(txRequest);
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - - sponsored - unsigned', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const actual = TransactionRequest.decode(txRequest.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(txRequest.toJSON());
        });

        test('ok <- legacy - - sponsored - gas payer signed', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - sponsored - origin signed', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - sponsored - both signed', () => {
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: Address.of(mockSenderAccount.address),
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
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('err <- legacy - throws for incorrect encoded size', () => {
            // Create a malformed RLP encoded array with incorrect number of fields
            // This will have a size that doesn't match any expected RLP profile length
            const malformedEncodedData = new Uint8Array([
                0xc3, // RLP list with 3 bytes of data
                0x01, // First element: 1
                0x02, // Second element: 2
                0x03 // Third element: 3
            ]);

            expect(() => {
                TransactionRequest.decode(malformedEncodedData);
            }).toThrow(InvalidEncodingError);
        });
    });

    describe('encode/decode clauses', () => {
        test('ok <- no clauses', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });
            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- clause with empty data defaults to Hex.PREFIX', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue,
                        null // Empty data should result in Hex.PREFIX
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });

            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.clauses).toHaveLength(1);
            expect(actual.clauses[0].data).toBeNull();
            expect(actual.clauses[0].toJSON().data).toBe('0x'); // Should be Hex.PREFIX
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- minimal properties', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(null, mockValue)],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });

            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- all properties', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue,
                        HexUInt.of('0xabcdef'),
                        'test comment',
                        '0xabcdef'
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });

            const actual = TransactionRequest.decode(expected.encoded);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- body.gasSponsorshipRequester defined creates Address using Address.of', () => {
            // Create a transaction request with gas sponsorship requester address defined
            const expectedGasSponsorshipRequester = Address.of(
                mockSenderAccount.address
            );
            const txRequest = new TransactionRequest({
                gasSponsorshipRequester: expectedGasSponsorshipRequester,
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

            // Encode and then decode to test the mapBodyToTransactionRequest method
            const encoded = txRequest.encoded;
            const decoded = TransactionRequest.decode(encoded);

            // Verify that the gas sponsorship requester address is properly reconstructed using Address.of
            expect(decoded.gasSponsorshipRequester).toBeDefined();
            expect(decoded.gasSponsorshipRequester?.toString()).toBe(
                expectedGasSponsorshipRequester.toString()
            );
            expect(decoded.isIntendedToBeSponsored).toBe(true);
            expect(decoded.toJSON().gasSponsorshipRequester).toBe(
                expectedGasSponsorshipRequester.toString()
            );
        });

        test('ok <- body.gasSponsorshipRequester undefined results in params.gasSponsorshipRequester as undefined', () => {
            // Create a transaction request without gas sponsorship requester address
            const txRequest = new TransactionRequest({
                // gas sponsorship requester intentionally omitted
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

            // Encode and then decode to test the mapBodyToTransactionRequest method
            const encoded = txRequest.encoded;
            const decoded = TransactionRequest.decode(encoded);

            // Verify that the gas sponsorship requester address is undefined
            expect(decoded.gasSponsorshipRequester).toBeUndefined();
            expect(decoded.isIntendedToBeSponsored).toBe(false);
            expect(decoded.toJSON().gasSponsorshipRequester).toBeUndefined();
        });
    });
});
