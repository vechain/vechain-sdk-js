import { describe, expect, test } from '@jest/globals';
import { TransactionRequest } from '../../../src/thor/model/TransactionRequest';
import { Clause } from '../../../src/thor/model/Clause';
import { PrivateKeySigner } from '../../../src/thor/signer/PrivateKeySigner';
import { RLPCodecTransactionRequest } from '../../../src/thor/signer/RLPCodecTransactionRequest';
import { Address, Hex, HexUInt } from '../../../src/vcdm';

/**
 * Test suite for dynamic fee transaction auto-detection and handling
 */
describe('TransactionRequest Dynamic Fee Support', () => {
    const mockClause = new Clause(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        1000000000000000000n, // 1 VET
        Hex.of('0x'),
        null, // comment
        null  // abi
    );

    const baseTransactionParams = {
        blockRef: HexUInt.of('0x00000000aabbccdd'),
        chainTag: 0x27,
        clauses: [mockClause],
        dependsOn: null,
        expiration: 32,
        gas: 21000n,
        nonce: 12345678,
        isSponsored: false
    };

    describe('Legacy Transaction Auto-Detection', () => {
        test('Should detect legacy transaction when only gasPriceCoef is provided', () => {
            const legacyTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 128n
            });

            expect(legacyTx.isDynamicFee()).toBe(false);
            expect(legacyTx.gasPriceCoef).toBe(128n);
            expect(legacyTx.maxFeePerGas).toBeUndefined();
            expect(legacyTx.maxPriorityFeePerGas).toBeUndefined();
        });

        test('Should detect legacy transaction when no dynamic fee fields are provided', () => {
            const legacyTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n
            });

            expect(legacyTx.isDynamicFee()).toBe(false);
            expect(legacyTx.gasPriceCoef).toBe(0n);
        });
    });

    describe('Dynamic Fee Transaction Auto-Detection', () => {
        test('Should detect dynamic fee transaction when maxFeePerGas is provided', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n, // Still required but not used
                maxFeePerGas: 2000000000n
            });

            expect(dynamicTx.isDynamicFee()).toBe(true);
            expect(dynamicTx.maxFeePerGas).toBe(2000000000n);
            expect(dynamicTx.maxPriorityFeePerGas).toBeUndefined();
        });

        test('Should detect dynamic fee transaction when maxPriorityFeePerGas is provided', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxPriorityFeePerGas: 500000000n
            });

            expect(dynamicTx.isDynamicFee()).toBe(true);
            expect(dynamicTx.maxFeePerGas).toBeUndefined();
            expect(dynamicTx.maxPriorityFeePerGas).toBe(500000000n);
        });

        test('Should detect dynamic fee transaction when both dynamic fee fields are provided', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxFeePerGas: 2000000000n,
                maxPriorityFeePerGas: 500000000n
            });

            expect(dynamicTx.isDynamicFee()).toBe(true);
            expect(dynamicTx.maxFeePerGas).toBe(2000000000n);
            expect(dynamicTx.maxPriorityFeePerGas).toBe(500000000n);
        });
    });

    describe('RLP Encoding Behavior', () => {
        test('Should encode legacy transaction without type prefix', () => {
            const legacyTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 128n
            });

            const encoded = RLPCodecTransactionRequest.encodeTransactionRequest(legacyTx);
            
            // Legacy transactions should not have 0x02 prefix
            expect(encoded[0]).not.toBe(0x02);
            expect(legacyTx.isDynamicFee()).toBe(false);
        });

        test('Should encode dynamic fee transaction with 0x02 type prefix', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxFeePerGas: 2000000000n,
                maxPriorityFeePerGas: 500000000n
            });

            const encoded = RLPCodecTransactionRequest.encodeTransactionRequest(dynamicTx);
            
            // Dynamic fee transactions should have 0x02 prefix
            expect(encoded[0]).toBe(0x02);
            expect(dynamicTx.isDynamicFee()).toBe(true);
        });

        test('Should use different RLP structure for dynamic vs legacy transactions', () => {
            const legacyTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 128n
            });

            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxFeePerGas: 2000000000n,
                maxPriorityFeePerGas: 500000000n
            });

            const legacyEncoded = RLPCodecTransactionRequest.encodeTransactionRequest(legacyTx);
            const dynamicEncoded = RLPCodecTransactionRequest.encodeTransactionRequest(dynamicTx);

            // Should produce different encodings
            expect(legacyEncoded).not.toEqual(dynamicEncoded);
            expect(legacyEncoded.length).not.toBe(dynamicEncoded.length);
        });
    });

    describe('Signer Integration', () => {
        const privateKey = new Uint8Array(32).fill(1);
        const signer = new PrivateKeySigner(privateKey);

        test('Should sign legacy transaction and preserve auto-detection', () => {
            const legacyTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 128n
            });

            const signedTx = signer.sign(legacyTx);

            expect(signedTx.isDynamicFee()).toBe(false);
            expect(signedTx.gasPriceCoef).toBe(128n);
            expect(signedTx.maxFeePerGas).toBeUndefined();
            expect(signedTx.maxPriorityFeePerGas).toBeUndefined();
            expect(signedTx.isSigned()).toBe(true);
        });

        test('Should sign dynamic fee transaction and preserve auto-detection', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxFeePerGas: 2000000000n,
                maxPriorityFeePerGas: 500000000n
            });

            const signedTx = signer.sign(dynamicTx);

            expect(signedTx.isDynamicFee()).toBe(true);
            expect(signedTx.maxFeePerGas).toBe(2000000000n);
            expect(signedTx.maxPriorityFeePerGas).toBe(500000000n);
            expect(signedTx.isSigned()).toBe(true);
        });

        test('Should encode signed legacy transaction without type prefix', () => {
            const legacyTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 128n
            });

            const signedTx = signer.sign(legacyTx);
            const encoded = RLPCodecTransactionRequest.encodeSignedTransactionRequest(signedTx);

            expect(encoded[0]).not.toBe(0x02);
            expect(signedTx.isDynamicFee()).toBe(false);
        });

        test('Should encode signed dynamic fee transaction with 0x02 type prefix', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxFeePerGas: 2000000000n,
                maxPriorityFeePerGas: 500000000n
            });

            const signedTx = signer.sign(dynamicTx);
            const encoded = RLPCodecTransactionRequest.encodeSignedTransactionRequest(signedTx);

            expect(encoded[0]).toBe(0x02);
            expect(signedTx.isDynamicFee()).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        test('Should handle transaction with maxFeePerGas set to 0', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxFeePerGas: 0n
            });

            expect(dynamicTx.isDynamicFee()).toBe(true);
            expect(dynamicTx.maxFeePerGas).toBe(0n);
        });

        test('Should handle transaction with maxPriorityFeePerGas set to 0', () => {
            const dynamicTx = new TransactionRequest({
                ...baseTransactionParams,
                gasPriceCoef: 0n,
                maxPriorityFeePerGas: 0n
            });

            expect(dynamicTx.isDynamicFee()).toBe(true);
            expect(dynamicTx.maxPriorityFeePerGas).toBe(0n);
        });

        test('Should maintain backward compatibility with existing legacy transactions', () => {
            const privateKey = new Uint8Array(32).fill(1);
            const testSigner = new PrivateKeySigner(privateKey);
            
            // Simulate existing code that only provides gasPriceCoef
            const legacyTx = new TransactionRequest({
                blockRef: HexUInt.of('0x00000000aabbccdd'),
                chainTag: 0x27,
                clauses: [mockClause],
                dependsOn: null,
                expiration: 32,
                gas: 21000n,
                gasPriceCoef: 255n, // Max gasPriceCoef
                nonce: 12345678,
                isSponsored: false
                // No dynamic fee fields
            });

            expect(legacyTx.isDynamicFee()).toBe(false);
            expect(legacyTx.gasPriceCoef).toBe(255n);
            
            // Should still be signable and encodable
            const signedTx = testSigner.sign(legacyTx);
            expect(signedTx.isSigned()).toBe(true);
            expect(signedTx.isDynamicFee()).toBe(false);
        });
    });
});
