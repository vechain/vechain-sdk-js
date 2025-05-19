import { describe, expect, test } from '@jest/globals';
import { TargetPath } from '@thor/debug';
import { Hex, IllegalArgumentError } from '@vechain/sdk-core';

/**
 * VeChain TargetPath - unit
 *
 * @group unit/debug
 */
describe('TargetPath unit tests', () => {
    describe('static isValid()', () => {
        test('should validate correct format with txId and clauseIndex', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0';
            expect(TargetPath.isValid(path)).toBe(true);
        });

        test('should validate correct format with txId, blockRef as hex, and clauseIndex', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/1';
            expect(TargetPath.isValid(path)).toBe(true);
        });

        test('should validate correct format with txId, blockRef as number, and clauseIndex', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/12345/2';
            expect(TargetPath.isValid(path)).toBe(true);
        });

        test('should reject paths without clauseIndex', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            expect(TargetPath.isValid(path)).toBe(false);
        });

        test('should reject paths with invalid txId (too short)', () => {
            const path = '0x1234567890abcdef/0';
            expect(TargetPath.isValid(path)).toBe(false);
        });

        test('should reject paths with invalid txId (not hex)', () => {
            const path =
                '0xghijklmnopqrstuv1234567890abcdef1234567890abcdef1234567890abcdef/0';
            expect(TargetPath.isValid(path)).toBe(false);
        });

        test('should reject paths with invalid blockRef (not hex or number)', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/invalid/0';
            expect(TargetPath.isValid(path)).toBe(false);
        });

        test('should reject paths with invalid clauseIndex (not a number)', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0/abc';
            expect(TargetPath.isValid(path)).toBe(false);
        });

        test('should reject empty string', () => {
            expect(TargetPath.isValid('')).toBe(false);
        });

        test('should reject string with invalid format', () => {
            expect(TargetPath.isValid('0x1234/0x5678/clause')).toBe(false);
        });
    });

    describe('constructor (via factory methods)', () => {
        test('should throw error for invalid path in private constructor (through of method)', () => {
            // This test indirectly tests the private constructor by trying to create with invalid path
            // Since the constructor is private, we need to go through a factory method
            const invalidPath = 'not-a-valid-path';
            expect(() => {
                TargetPath.of(invalidPath);
            }).toThrow(IllegalArgumentError);
        });

        test('should handle edge case path with minimum valid format', () => {
            const minimalPath =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0';
            const targetPath = TargetPath.of(minimalPath);
            expect(targetPath.toString()).toBe(minimalPath);
        });

        test('should handle null or undefined input to of() method', () => {
            // @ts-expect-error - We're purposely testing an error case with null
            expect(() => TargetPath.of(null)).toThrow(IllegalArgumentError);
            // @ts-expect-error - We're purposely testing an error case with undefined
            expect(() => TargetPath.of(undefined)).toThrow(
                IllegalArgumentError
            );
        });
    });

    describe('static of()', () => {
        test('should create instance from valid string', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0';
            const targetPath = TargetPath.of(path);
            expect(targetPath).toBeInstanceOf(TargetPath);
            expect(targetPath.toString()).toBe(path);
        });

        test('should return the same instance when given a TargetPath', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0';
            const targetPath = TargetPath.of(path);
            const sameTargetPath = TargetPath.of(targetPath);
            expect(sameTargetPath).toBe(targetPath);
        });

        test('should throw for invalid string', () => {
            const path = 'invalid-path';
            expect(() => TargetPath.of(path)).toThrow(IllegalArgumentError);
        });

        test('should throw for empty string', () => {
            expect(() => TargetPath.of('')).toThrow(IllegalArgumentError);
        });

        // These tests are no longer relevant since we're restricting the input types
        // test('should throw for number input', () => {
        //     expect(() => TargetPath.of(123 as any)).toThrow(IllegalArgumentError);
        // });

        // test('should throw for bigint input', () => {
        //     expect(() => TargetPath.of(123n as any)).toThrow(IllegalArgumentError);
        // });

        // test('should throw for Uint8Array input', () => {
        //     expect(() => TargetPath.of(new Uint8Array([1, 2, 3]) as any)).toThrow(IllegalArgumentError);
        // });
    });

    describe('static fromTxIdAndClause()', () => {
        test('should create instance from valid txId and clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const clauseIndex = 0;
            const targetPath = TargetPath.fromTxIdAndClause(txId, clauseIndex);
            expect(targetPath).toBeInstanceOf(TargetPath);
            expect(targetPath.toString()).toBe(`${txId}/${clauseIndex}`);
        });

        test('should throw for invalid txId', () => {
            const txId = '0xinvalid';
            const clauseIndex = 0;
            expect(() =>
                TargetPath.fromTxIdAndClause(txId, clauseIndex)
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for negative clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const clauseIndex = -1;
            expect(() =>
                TargetPath.fromTxIdAndClause(txId, clauseIndex)
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for non-integer clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const clauseIndex = 1.5;
            expect(() =>
                TargetPath.fromTxIdAndClause(txId, clauseIndex)
            ).toThrow(IllegalArgumentError);
        });
    });

    describe('static fromTxIdBlockRefAndClause()', () => {
        test('should create instance from valid txId, blockRef as hex, and clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef =
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
            const clauseIndex = 1;
            const targetPath = TargetPath.fromTxIdBlockRefAndClause(
                txId,
                blockRef,
                clauseIndex
            );
            expect(targetPath).toBeInstanceOf(TargetPath);
            expect(targetPath.toString()).toBe(
                `${txId}/${blockRef}/${clauseIndex}`
            );
        });

        test('should create instance from valid txId, blockRef as number, and clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = 12345;
            const clauseIndex = 2;
            const targetPath = TargetPath.fromTxIdBlockRefAndClause(
                txId,
                blockRef,
                clauseIndex
            );
            expect(targetPath).toBeInstanceOf(TargetPath);
            expect(targetPath.toString()).toBe(
                `${txId}/${blockRef}/${clauseIndex}`
            );
        });

        test('should throw for invalid txId', () => {
            const txId = '0xinvalid';
            const blockRef = 12345;
            const clauseIndex = 0;
            expect(() =>
                TargetPath.fromTxIdBlockRefAndClause(
                    txId,
                    blockRef,
                    clauseIndex
                )
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for invalid blockRef (string not hex)', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = '0xinvalid';
            const clauseIndex = 0;
            expect(() =>
                TargetPath.fromTxIdBlockRefAndClause(
                    txId,
                    blockRef,
                    clauseIndex
                )
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for invalid blockRef (negative number)', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = -1;
            const clauseIndex = 0;
            expect(() =>
                TargetPath.fromTxIdBlockRefAndClause(
                    txId,
                    blockRef,
                    clauseIndex
                )
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for invalid blockRef (non-integer number)', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = 1.5;
            const clauseIndex = 0;
            expect(() =>
                TargetPath.fromTxIdBlockRefAndClause(
                    txId,
                    blockRef,
                    clauseIndex
                )
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for negative clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = 12345;
            const clauseIndex = -1;
            expect(() =>
                TargetPath.fromTxIdBlockRefAndClause(
                    txId,
                    blockRef,
                    clauseIndex
                )
            ).toThrow(IllegalArgumentError);
        });

        test('should throw for non-integer clauseIndex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = 12345;
            const clauseIndex = 1.5;
            expect(() =>
                TargetPath.fromTxIdBlockRefAndClause(
                    txId,
                    blockRef,
                    clauseIndex
                )
            ).toThrow(IllegalArgumentError);
        });
    });

    describe('property getters', () => {
        test('should extract txId correctly', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const targetPath = TargetPath.fromTxIdAndClause(txId, 0);
            expect(targetPath.txId).toBe(txId);
        });

        test('should return undefined for blockRef when not present', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const targetPath = TargetPath.fromTxIdAndClause(txId, 0);
            expect(targetPath.blockRef).toBeUndefined();
        });

        test('should extract blockRef correctly when present as hex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef =
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
            const targetPath = TargetPath.fromTxIdBlockRefAndClause(
                txId,
                blockRef,
                1
            );
            expect(targetPath.blockRef).toBe(blockRef);
        });

        test('should extract blockRef correctly when present as number', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = 12345;
            const targetPath = TargetPath.fromTxIdBlockRefAndClause(
                txId,
                blockRef,
                2
            );
            expect(targetPath.blockRef).toBe(blockRef.toString());
        });

        test('should extract clauseIndex correctly with two segments', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const clauseIndex = 3;
            const targetPath = TargetPath.fromTxIdAndClause(txId, clauseIndex);
            expect(targetPath.clauseIndex).toBe(clauseIndex);
        });

        test('should extract clauseIndex correctly with three segments', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const blockRef = 12345;
            const clauseIndex = 4;
            const targetPath = TargetPath.fromTxIdBlockRefAndClause(
                txId,
                blockRef,
                clauseIndex
            );
            expect(targetPath.clauseIndex).toBe(clauseIndex);
        });
    });

    describe('Hex compatibility', () => {
        test('should provide txId as Hex', () => {
            const txId =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const targetPath = TargetPath.fromTxIdAndClause(txId, 0);
            expect(targetPath.txIdAsHex).toBeInstanceOf(Hex);
            expect(targetPath.txIdAsHex.toString()).toBe(txId);
        });

        test('should maintain string representation', () => {
            const path =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/0';
            const targetPath = TargetPath.of(path);
            expect(targetPath.toString()).toBe(path);
            expect(targetPath.toJSON()).toBe(path);
        });
    });
});
