import { TEST_ACCOUNTS } from '../../../fixture';
import {
    Address,
    HexUInt,
    InvalidEncodingError,
    InvalidTransactionField
} from '@common';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { type TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';
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
            '0x7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
        address: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
    } satisfies ThorSoloAccount;
    const mockReceiverAccount = {
        privateKey:
            '0x62183dac319418f40e47dec7b60f104d0d6a9e248860b005e8b6d36cf9e8f11a',
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
    const mockNonce = 3n;
    const mockValue = 10n ** 15n; // .001 VET

    describe('constructor', () => {
        test('ok <- legacy transaction not delegated with all parameters', () => {
            const body = {
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
            } satisfies TransactionBody;

            const originSig = new Uint8Array([1, 2, 3]);
            const txRequest = TransactionRequest.of(body, originSig);
            expect(txRequest.blockRef).toBe(body.blockRef);
            expect(txRequest.chainTag).toBe(body.chainTag);
            expect(txRequest.clauses).toEqual(body.clauses);
            expect(txRequest.dependsOn).toBe(body.dependsOn);
            expect(txRequest.expiration).toBe(body.expiration);
            expect(txRequest.gas).toBe(body.gas);
            expect(txRequest.gasPriceCoef).toBe(body.gasPriceCoef);
            expect(txRequest.maxFeePerGas).toBeUndefined();
            expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
            expect(txRequest.nonce).toBe(body.nonce);
            expect(txRequest.isDynamicFee).toBe(false);
            expect(txRequest.isLegacy).toBe(true);
            expect(txRequest.signature).toEqual(originSig);
        });

        test('ok <- legacy transaction with delegated fee with all parameters', () => {
            const body = {
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            } satisfies TransactionBody;

            const originSig = new Uint8Array([1, 2, 3]);
            const txRequest = TransactionRequest.of(body, originSig);
            expect(txRequest.blockRef).toBe(body.blockRef);
            expect(txRequest.chainTag).toBe(body.chainTag);
            expect(txRequest.clauses).toEqual(body.clauses);
            expect(txRequest.dependsOn).toBe(body.dependsOn);
            expect(txRequest.expiration).toBe(body.expiration);
            expect(txRequest.gas).toBe(body.gas);
            expect(txRequest.gasPriceCoef).toBe(body.gasPriceCoef);
            expect(txRequest.maxFeePerGas).toBeUndefined();
            expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
            expect(txRequest.nonce).toBe(body.nonce);
            expect(txRequest.isDynamicFee).toBe(false);
            expect(txRequest.isLegacy).toBe(true);
            expect(txRequest.signature).toEqual(originSig);
            expect(txRequest.isDelegated).toBe(true);
        });

        test('ok <- dynamic fee transaction not delegated with all parameters', () => {
            const body = {
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
            } satisfies TransactionBody;

            const txRequest = TransactionRequest.of(body);
            expect(txRequest.blockRef).toBe(body.blockRef);
            expect(txRequest.chainTag).toBe(body.chainTag);
            expect(txRequest.clauses).toEqual(body.clauses);
            expect(txRequest.dependsOn).toBe(body.dependsOn);
            expect(txRequest.expiration).toBe(body.expiration);
            expect(txRequest.gas).toBe(body.gas);
            expect(txRequest.gasPriceCoef).toBeUndefined();
            expect(txRequest.maxFeePerGas).toBe(body.maxFeePerGas);
            expect(txRequest.maxPriorityFeePerGas).toBe(
                body.maxPriorityFeePerGas
            );
            expect(txRequest.nonce).toBe(body.nonce);
            expect(txRequest.isDynamicFee).toBe(true);
            expect(txRequest.isLegacy).toBe(false);
            expect(txRequest.signature).toBeUndefined();
        });

        test('ok <- dynamic fee transaction with delegated fee with all parameters', () => {
            const body = {
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            } satisfies TransactionBody;

            const txRequest = TransactionRequest.of(body);
            expect(txRequest.blockRef).toBe(body.blockRef);
            expect(txRequest.chainTag).toBe(body.chainTag);
            expect(txRequest.clauses).toEqual(body.clauses);
            expect(txRequest.dependsOn).toBe(body.dependsOn);
            expect(txRequest.expiration).toBe(body.expiration);
            expect(txRequest.gas).toBe(body.gas);
            expect(txRequest.gasPriceCoef).toBeUndefined();
            expect(txRequest.maxFeePerGas).toBe(body.maxFeePerGas);
            expect(txRequest.maxPriorityFeePerGas).toBe(
                body.maxPriorityFeePerGas
            );
            expect(txRequest.nonce).toBe(body.nonce);
            expect(txRequest.isDynamicFee).toBe(true);
            expect(txRequest.isLegacy).toBe(false);
            expect(txRequest.signature).toBeUndefined();
            expect(txRequest.isDelegated).toBe(true);
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
            } satisfies TransactionBody;

            const txRequest = TransactionRequest.of(params);

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
            expect(txRequest.signature).toBeUndefined();
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
            } satisfies TransactionBody;

            const txRequest = TransactionRequest.of(params);

            expect(txRequest.maxFeePerGas).toBe(1n);
            expect(txRequest.maxPriorityFeePerGas).toBe(0n);
            expect(txRequest.gasPriceCoef).toBeUndefined();
            expect(txRequest.isDynamicFee).toBe(true);
            expect(txRequest.isLegacy).toBe(false);
            expect(txRequest.signature).toBeUndefined();
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

            const txRequest = TransactionRequest.of(params);
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

            const txRequest = TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
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
                TransactionRequest.of(params);
                fail('Expected InvalidTransactionField to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidTransactionField);
                const invalidFieldError = error as InvalidTransactionField;
                expect(invalidFieldError.message).toContain(
                    'Invalid parameters'
                );
                expect(invalidFieldError.args).toBeDefined();
            }
        });
    });

    describe('defensive copying of signature', () => {
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

            const originalSig = new Uint8Array([1, 2, 3]);
            const txRequest = TransactionRequest.of(params, originalSig);

            // Modify original array
            originalSig[0] = 99;

            // Should not affect the transaction request
            expect(txRequest.signature?.[0]).toBe(1);
            expect(txRequest.signature).not.toBe(originalSig);
        });
    });

    describe('encode transaction request', () => {
        test('ok <- encode dynamic fee - no sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
            } satisfies TransactionBody);
            const { encoded } = txRequest;
            expect(encoded.toString().toLowerCase()).toBe(
                '0x51f85c81f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c0'.toLowerCase()
            );
        });
        test('ok <- encode dynamic fee - sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            } satisfies TransactionBody);
            const { encoded } = txRequest;
            expect(encoded.toString().toLowerCase()).toBe(
                '0x51f85d81f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c101'.toLowerCase()
            );
        });
        test('ok <- encode legacy - no sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
                nonce: mockNonce
            } satisfies TransactionBody);
            const { encoded } = txRequest;
            expect(encoded.toString().toLowerCase()).toBe(
                '0xf85181f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c680008081808261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c0'.toLowerCase()
            );
        });
        test('ok <- encode legacy - sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
                maxFeePerGas: undefined,
                maxPriorityFeePerGas: undefined,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            } satisfies TransactionBody);
            const { encoded } = txRequest;
            expect(encoded.toString().toLowerCase()).toBe(
                '0xf85281f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c680008081808261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c101'.toLowerCase()
            );
        });
        test('ok <- encode dynamic fee - no sponsored - signed', () => {
            const txRequest = TransactionRequest.of({
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
            } satisfies TransactionBody);
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const signedTxRequest = signer.sign(txRequest);
            const { encoded } = signedTxRequest;
            expect(encoded.toString().toLowerCase()).toBe(
                '0x51f89f81f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c0b841ff9ecc2a0cba9d8713457bd2b26fbb5524b0aae8494defb4269ea6257cb440260a0fa10d3b0ffc382f551979ed3c9759e7323e4a4463961034b46a47053363e001'.toLowerCase()
            );
        });
        test('ok <- encodedynamic fee - sponsored - signed by origin and gas payer', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            } satisfies TransactionBody);
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const signedTxRequest = signer.sign(txRequest);
            const gasPayerSignedTx = signer.sign(
                signedTxRequest,
                Address.of(mockSenderAccount.address)
            );
            const { encoded } = gasPayerSignedTx;
            expect(encoded.toString().toLowerCase()).toBe(
                '0x51f8e181f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c101b88252c1f233540111e774baee5f3c7c573b9fba4db0a31811be2dd42f2c39dfef40061b56f1f9932ae525d98631dc6f9297d42b49fc46a1e96e1461ed9a33f78fee005ddde31520f1b1f49aa00c2b5f953970e73760f96877937fea5d8785c680f7226e3c5ef73728b5c30f8911c4c670d2fc0e985b3dbb054d21b8517bd74722ffc801'.toLowerCase()
            );
        });
        test('ok <- encode dynamic fee - sponsored - signed by origin only', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            } satisfies TransactionBody);
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originSignedTxRequest = signer.sign(txRequest);
            const { encoded } = originSignedTxRequest;
            expect(encoded.toString().toLowerCase()).toBe(
                '0x51f8a081f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c101b84152c1f233540111e774baee5f3c7c573b9fba4db0a31811be2dd42f2c39dfef40061b56f1f9932ae525d98631dc6f9297d42b49fc46a1e96e1461ed9a33f78fee00'.toLowerCase()
            );
        });
    });

    describe('decode transaction request', () => {
        test('ok <- decode dynamic fee - no sponsored - unsigned', () => {
            const encoded = HexUInt.of(
                '0x51f85c81f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c0'
            );
            const txRequest = TransactionRequest.decode(encoded);
            expect(txRequest.blockRef.toString()).toBe(mockBlockRef.toString());
            expect(txRequest.chainTag.toString()).toBe(mockChainTag.toString());
            expect(txRequest.dependsOn?.toString()).toBe(
                mockDependsOn.toString()
            );
            expect(txRequest.expiration.toString()).toBe(
                mockExpiration.toString()
            );
            expect(txRequest.gas).toBe(mockGas);
            expect(txRequest.maxFeePerGas).toBe(mockMaxFeePerGas);
            expect(txRequest.maxPriorityFeePerGas).toBe(
                mockMaxPriorityFeePerGas
            );
            expect(txRequest.reserved?.features).toBe(0);
            expect(txRequest.reserved?.unused).toEqual([]);
        });
        test('ok <- decode dynamic fee - sponsored - signed by origin only', () => {
            const encoded = HexUInt.of(
                '0x51f8a081f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c101b84152c1f233540111e774baee5f3c7c573b9fba4db0a31811be2dd42f2c39dfef40061b56f1f9932ae525d98631dc6f9297d42b49fc46a1e96e1461ed9a33f78fee00'
            );
            const txRequest = TransactionRequest.decode(encoded);
            expect(txRequest.blockRef.toString()).toBe(mockBlockRef.toString());
            expect(txRequest.chainTag.toString()).toBe(mockChainTag.toString());
            expect(txRequest.dependsOn?.toString()).toBe(
                mockDependsOn.toString()
            );
            expect(txRequest.expiration.toString()).toBe(
                mockExpiration.toString()
            );
            expect(txRequest.gas).toBe(mockGas);
            expect(txRequest.maxFeePerGas).toBe(mockMaxFeePerGas);
            expect(txRequest.maxPriorityFeePerGas).toBe(
                mockMaxPriorityFeePerGas
            );
            expect(txRequest.reserved?.features).toBe(1);
            expect(txRequest.reserved?.unused).toBeUndefined();
            expect(txRequest.signature?.length).toBe(65);
        });
        test('ok <- decode dynamic fee - sponsored - signed by origin and gas payer', () => {
            const encoded = HexUInt.of(
                '0x51f8e181f685b7b199485620dfde949e4e0efb170070e35a6b76b683aee91dd77805b387038d7ea4c6800080850649534e0086091e97c5ee008261a8a0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789003c101b88252c1f233540111e774baee5f3c7c573b9fba4db0a31811be2dd42f2c39dfef40061b56f1f9932ae525d98631dc6f9297d42b49fc46a1e96e1461ed9a33f78fee005ddde31520f1b1f49aa00c2b5f953970e73760f96877937fea5d8785c680f7226e3c5ef73728b5c30f8911c4c670d2fc0e985b3dbb054d21b8517bd74722ffc801'
            );
            const txRequest = TransactionRequest.decode(encoded);
            expect(txRequest.blockRef.toString()).toBe(mockBlockRef.toString());
            expect(txRequest.chainTag.toString()).toBe(mockChainTag.toString());
            expect(txRequest.dependsOn?.toString()).toBe(
                mockDependsOn.toString()
            );
            expect(txRequest.expiration.toString()).toBe(
                mockExpiration.toString()
            );
            expect(txRequest.gas).toBe(mockGas);
            expect(txRequest.maxFeePerGas).toBe(mockMaxFeePerGas);
            expect(txRequest.maxPriorityFeePerGas).toBe(
                mockMaxPriorityFeePerGas
            );
            expect(txRequest.reserved?.features).toBe(1);
            expect(txRequest.reserved?.unused).toBeUndefined();
            expect(txRequest.signature?.length).toBe(65 * 2);
            const originSignature = txRequest.signature?.slice(0, 65);
            const gasPayerSignature = txRequest.signature?.slice(65);
            const originSignatureHex = HexUInt.of(originSignature ?? 0n)
                .toString()
                .toLowerCase();
            const gasPayerSignatureHex = HexUInt.of(gasPayerSignature ?? 0n)
                .toString()
                .toLowerCase();
            expect(originSignatureHex).toBe(
                '0x52c1f233540111e774baee5f3c7c573b9fba4db0a31811be2dd42f2c39dfef40061b56f1f9932ae525d98631dc6f9297d42b49fc46a1e96e1461ed9a33f78fee00'.toLowerCase()
            );
            expect(gasPayerSignatureHex).toBe(
                '0x5ddde31520f1b1f49aa00c2b5f953970e73760f96877937fea5d8785c680f7226e3c5ef73728b5c30f8911c4c670d2fc0e985b3dbb054d21b8517bd74722ffc801'.toLowerCase()
            );
        });
        test('ok <- decode legacy - sponsored - signed by origin and gas payer', () => {
            const encoded = HexUInt.of(
                '0xf9011f27880166f0d03904eb8020f87ef87c94dccaabd81b38e0deef4c202bc7f1261a4d9192c680b864b391c7d3623374722d75736400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005a67077e8000000000000000000000000000000000000000000000000000000006937f0ef818083015e2e8086019b028528ddc101b882e13033d012d788ed7f044707413b709ab130747962fc001c0f64270b0e73072551f8aaf43d310e4531e1e19a9a31ab175744676df87d6246cbe63527158778e7016a67a95ba49e8a9ddf50862f8b4f85662eb95e738430ffc3c049bda41d3a656d2618ac0d4be84208501c59e5f57bfa452d05566f8760858b9e5d30fb24945a3800'
            );
            const txRequest = TransactionRequest.decode(encoded);
            expect(txRequest.blockRef.toString()).toBe('0x0166f0d03904eb80');
            expect(txRequest.chainTag).toBe(39);
            expect(txRequest.dependsOn).toBeNull();
            expect(txRequest.expiration).toBe(32);
            expect(txRequest.gas).toBe(89646n);
            expect(txRequest.maxFeePerGas).toBeUndefined();
            expect(txRequest.maxPriorityFeePerGas).toBeUndefined();
            expect(txRequest.gasPriceCoef).toBe(128n);
            expect(txRequest.reserved?.features).toBe(1);
            expect(txRequest.signature?.length).toBe(65 * 2);
            const originSignature = txRequest.signature?.slice(0, 65);
            const gasPayerSignature = txRequest.signature?.slice(65);
            const originSignatureHex = HexUInt.of(originSignature ?? 0n)
                .toString()
                .toLowerCase();
            const gasPayerSignatureHex = HexUInt.of(gasPayerSignature ?? 0n)
                .toString()
                .toLowerCase();
            expect(originSignatureHex).toBe(
                '0xe13033d012d788ed7f044707413b709ab130747962fc001c0f64270b0e73072551f8aaf43d310e4531e1e19a9a31ab175744676df87d6246cbe63527158778e701'.toLowerCase()
            );
            expect(gasPayerSignatureHex).toBe(
                '0x6a67a95ba49e8a9ddf50862f8b4f85662eb95e738430ffc3c049bda41d3a656d2618ac0d4be84208501c59e5f57bfa452d05566f8760858b9e5d30fb24945a3800'.toLowerCase()
            );
        });
    });

    describe('encode/decode/hash dynamic', () => {
        test('ok <- dynamic fee - no sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
            } satisfies TransactionBody);
            const actual = TransactionRequest.decode(
                HexUInt.of(txRequest.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(txRequest.toJSON());
        });

        test('ok <- dynamic fee - no sponsored - signed', () => {
            const txRequest = TransactionRequest.of({
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
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isDelegated).toBe(false);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            const expected = txRequest;
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - gas payer signed only', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const expected = gasPayerSigner.sign(txRequest);
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - origin signed only', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const expected = originSigner.sign(txRequest);
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- dynamic fee - sponsored - both signed', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originSignedTxRequest = originSigner.sign(txRequest);
            const gasPayerSignedTxRequest = gasPayerSigner.sign(
                originSignedTxRequest,
                Address.of(mockSenderAccount.address)
            );
            const actual = TransactionRequest.decode(
                HexUInt.of(gasPayerSignedTxRequest.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isDelegated).toBe(true);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(gasPayerSignedTxRequest.toJSON());
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
                TransactionRequest.decode(HexUInt.of(malformedDynamicFeeData));
            }).toThrow('invalid encoded transaction request');
        });
    });

    describe('encode/decode/hash legacy', () => {
        test('ok <- legacy - no sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isDelegated).toBe(false);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - no sponsored - signed', () => {
            const txRequest = TransactionRequest.of({
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
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isDelegated).toBe(false);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - - sponsored - unsigned', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            const actual = TransactionRequest.decode(
                HexUInt.of(txRequest.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isDelegated).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(txRequest.toJSON());
        });

        test('ok <- legacy - - sponsored - gas payer signed', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
            );
            const expected = gasPayerSigner.sign(txRequest);
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isDelegated).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - sponsored - origin signed', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            const originSIgner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = originSIgner.sign(txRequest);
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isDelegated).toBe(true);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - sponsored - both signed', () => {
            const txRequest = TransactionRequest.of({
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
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
            );
            const originSigner = new PrivateKeySigner(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const expected = gasPayerSigner.sign(
                originSigner.sign(txRequest),
                Address.of(mockSenderAccount.address)
            );
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.hash.bytes).toEqual(txRequest.hash.bytes);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isDelegated).toBe(true);
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
                TransactionRequest.decode(HexUInt.of(malformedEncodedData));
            }).toThrow(InvalidEncodingError);
        });
    });

    describe('encode/decode clauses', () => {
        test('ok <- no clauses', () => {
            const expected = TransactionRequest.of({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });
            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- clause with empty data defaults to Hex.PREFIX', () => {
            const expected = TransactionRequest.of({
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

            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.clauses).toHaveLength(1);
            expect(actual.clauses[0].data).toBeNull();
            expect(actual.clauses[0].toJSON().data).toBe('0x'); // Should be Hex.PREFIX
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- minimal properties', () => {
            const expected = TransactionRequest.of({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(null, mockValue)],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });

            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- all properties', () => {
            const expected = TransactionRequest.of({
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

            const actual = TransactionRequest.decode(
                HexUInt.of(expected.encoded)
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });
});
