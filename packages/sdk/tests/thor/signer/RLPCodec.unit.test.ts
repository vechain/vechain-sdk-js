import { TEST_ACCOUNTS } from '../../fixture';
import { Address, HexUInt, Quantity } from '@common';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { RLPCodec } from '@thor';
import { expect } from '@jest/globals';
import { concatBytes } from '@noble/curves/utils.js';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/thor/signer
 */
describe('RLPCodec', () => {
    // Test data setup
    const mockBlockRef = HexUInt.of('0x1234567890abcdef');
    const mockDependsOn = HexUInt.of(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    );
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 123n;
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3;
    const mockValue = Quantity.of(1000);
    const mockGasPayerSignature = new Uint8Array(65).fill(0xbe);
    const mockOriginSignature = new Uint8Array(65).fill(0xba);
    const mockSignature = concatBytes(
        mockOriginSignature,
        mockGasPayerSignature
    );

    describe('encode/decode dynamic', () => {
        test('ok <- all properties', () => {
            const expected = new TransactionRequest(
                {
                    beggar: Address.of(TRANSACTION_SENDER.address),
                    blockRef: mockBlockRef,
                    chainTag: 1,
                    clauses: [
                        new Clause(
                            Address.of(TRANSACTION_RECEIVER.address),
                            mockValue.bi
                        )
                    ],
                    dependsOn: mockDependsOn,
                    expiration: mockExpiration,
                    gas: mockGas,
                    gasPriceCoef: 0n, // Dynamic fee transactions use 0
                    maxFeePerGas: mockMaxFeePerGas,
                    maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                    nonce: mockNonce
                },
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );
            const encoded = RLPCodec.encode(expected);
            // Verify 0x51 prefix is present
            expect(encoded[0]).toBe(0x51);
            const actual = RLPCodec.decode(encoded);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- minimal properties', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
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
            const encoded = RLPCodec.encode(expected);
            // Verify 0x51 prefix is present
            expect(encoded[0]).toBe(0x51);
            const actual = RLPCodec.decode(encoded);
            expect(actual.isDynamicFee).toBe(true);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });

    describe('encode/decode legacy', () => {
        test('ok <- legacy - all properties', () => {
            const expected = new TransactionRequest(
                {
                    beggar: Address.of(TRANSACTION_SENDER.address),
                    blockRef: mockBlockRef,
                    chainTag: 1,
                    clauses: [
                        new Clause(
                            Address.of(TRANSACTION_RECEIVER.address),
                            mockValue.bi
                        )
                    ],
                    dependsOn: mockDependsOn,
                    expiration: mockExpiration,
                    gas: mockGas,
                    gasPriceCoef: mockGasPriceCoef,
                    nonce: mockNonce
                },
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );
            const encoded = RLPCodec.encode(expected);
            // Verify no 0x51 is not present
            expect(encoded[0]).not.toBe(0x51);
            const actual = RLPCodec.decode(encoded);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(true);
            expect(actual.isSigned).toBe(true);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- legacy - minimal properties', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            const encoded = RLPCodec.encode(expected);
            // Verify no 0x51 is not present
            expect(encoded[0]).not.toBe(0x51);
            const actual = RLPCodec.decode(encoded);
            expect(actual.isDynamicFee).toBe(false);
            expect(actual.isIntendedToBeSponsored).toBe(false);
            expect(actual.isSigned).toBe(false);
            expect(actual.toJSON()).toEqual(expected.toJSON());
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
            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- minimal properties', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(null, mockValue.bi)],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce
            });

            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- all properties', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi,
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

            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });
});
