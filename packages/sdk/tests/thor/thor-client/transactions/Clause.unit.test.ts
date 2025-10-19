import { Address, Hex, HexUInt, Quantity } from '@common';
import { Clause } from '@thor/thor-client/model/transactions';
import { expect } from '@jest/globals';
import { type ClauseJSON } from '@thor/thorest/json';

/**
 * @group unit/thor/thor-client/transactions
 */
describe('Clause', () => {
    // Test data setup
    const mockAddress = Address.of(
        '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed'
    );
    const mockValue = 1000n;
    const mockData = HexUInt.of('0xabcdef1234567890');
    const mockComment = 'Test comment for clause';
    const mockAbi = '{"type":"function","name":"transfer","inputs":[]}';

    describe('constructor', () => {
        test('ok <- with minimal parameters', () => {
            const clause = new Clause(mockAddress, mockValue);

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBeNull();
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <- with all parameters', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                mockData,
                mockComment,
                mockAbi
            );

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBe(mockData);
            expect(clause.comment).toBe(mockComment);
            expect(clause.abi).toBe(mockAbi);
        });

        test('ok <- with null recipient for contract deployment', () => {
            const clause = new Clause(null, mockValue, mockData);

            expect(clause.to).toBeNull();
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBe(mockData);
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <- handle zero value', () => {
            const clause = new Clause(mockAddress, 0n);

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(0n);
            expect(clause.data).toBeNull();
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <-handle large values', () => {
            const largeValue = BigInt(Number.MAX_SAFE_INTEGER) * 1000n;
            const clause = new Clause(mockAddress, largeValue);

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(largeValue);
        });

        test('ok <- handle undefined optional parameters as null', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                undefined,
                undefined,
                undefined
            );

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBeNull();
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <- handle mixed null and defined optional parameters', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                mockData,
                null,
                mockAbi
            );

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBe(mockData);
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBe(mockAbi);
        });

        test('ok <- handle empty strings for optional parameters', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                HexUInt.of('0x'),
                '',
                ''
            );

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toEqual(HexUInt.of('0x'));
            expect(clause.comment).toBe('');
            expect(clause.abi).toBe('');
        });
    });

    describe('static of method', () => {
        test('ok <- from ClauseJSON with all fields', () => {
            const clauseData = {
                to: mockAddress.toString(),
                value: HexUInt.of(mockValue).toString(),
                data: mockData.toString()
            } satisfies ClauseJSON;

            const clause = Clause.of(clauseData);

            expect(clause.to).toEqual(mockAddress);
            expect(clause.value).toEqual(mockValue);
            expect(clause.data).toEqual(mockData);
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <- from ClauseJSON with null recipient', () => {
            const clauseData = {
                to: null,
                value: HexUInt.of(mockValue).toString(),
                data: mockData.toString()
            } satisfies ClauseJSON;

            const clause = Clause.of(clauseData);

            expect(clause.to).toBeNull();
            expect(clause.value).toEqual(mockValue);
            expect(clause.data).toEqual(mockData);
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <- from ClauseJSON with no data', () => {
            const clauseData = {
                to: mockAddress.toString(),
                value: HexUInt.of(mockValue).toString()
            } satisfies ClauseJSON;

            const clause = Clause.of(clauseData);

            expect(clause.to).toEqual(mockAddress);
            expect(clause.value).toEqual(mockValue);
            expect(clause.data).toBeNull();
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok <- from ClauseJSON with zero value', () => {
            const clauseData = {
                to: mockAddress.toString(),
                value: HexUInt.of(0).toString()
            } satisfies ClauseJSON;

            const clause = Clause.of(clauseData);

            expect(clause.to).toEqual(mockAddress);
            expect(clause.value).toEqual(0n);
            expect(clause.data).toBeNull();
        });
    });

    describe('toJSON method', () => {
        test('ok <- with all fields to JSON', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                mockData,
                mockComment,
                mockAbi
            );

            const json = clause.toJSON();

            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(mockValue).toString());
            expect(json.data).toBe(mockData.toString());
        });

        test('ok <- with null recipient to JSON', () => {
            const clause = new Clause(null, mockValue, mockData);

            const json = clause.toJSON();

            expect(json.to).toBeNull();
            expect(json.value).toBe(Quantity.of(mockValue).toString());
            expect(json.data).toBe(mockData.toString());
        });

        test('ok <- with null data to JSON using 0x prefix', () => {
            const clause = new Clause(mockAddress, mockValue, null);

            const json = clause.toJSON();

            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(mockValue).toString());
            expect(json.data).toBe(Hex.PREFIX); // Should be "0x"
        });

        test('ok <- clause with zero value to JSON', () => {
            const clause = new Clause(mockAddress, 0n);

            const json = clause.toJSON();

            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(0n).toString());
            expect(json.data).toBe(Hex.PREFIX);
        });

        test('ok <- with large value to JSON', () => {
            const largeValue = BigInt(Number.MAX_SAFE_INTEGER) * 1000n;
            const clause = new Clause(mockAddress, largeValue);

            const json = clause.toJSON();

            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(largeValue).toString());
            expect(json.data).toBe(Hex.PREFIX);
        });

        test('ok <- not include comment in JSON serialization', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                mockData,
                mockComment
            );

            const json = clause.toJSON();

            expect(json).not.toHaveProperty('comment');
            expect('comment' in json).toBe(false);
        });

        test('ok <- not include abi in JSON serialization', () => {
            const clause = new Clause(
                mockAddress,
                mockValue,
                mockData,
                mockComment,
                mockAbi
            );

            const json = clause.toJSON();

            expect(json).not.toHaveProperty('abi');
            expect('abi' in json).toBe(false);
        });

        test('ok <- handle empty hex data correctly', () => {
            const emptyData = HexUInt.of('0x');
            const clause = new Clause(mockAddress, mockValue, emptyData);

            const json = clause.toJSON();

            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(mockValue).toString());
            expect(json.data).toBe('0x');
        });
    });

    describe('edge cases and immutability', () => {
        test('ok <- handle contract deployment scenario', () => {
            // Contract deployment typically has null recipient and data payload
            const deploymentData = HexUInt.of(
                '0x608060405234801561001057600080fd5b50'
            );
            const clause = new Clause(
                null,
                0n,
                deploymentData,
                'Contract deployment'
            );

            expect(clause.to).toBeNull();
            expect(clause.value).toBe(0n);
            expect(clause.data).toBe(deploymentData);
            expect(clause.comment).toBe('Contract deployment');

            const json = clause.toJSON();
            expect(json.to).toBeNull();
            expect(json.value).toBe('0x0');
            expect(json.data).toBe(deploymentData.toString());
        });

        test('ok <- handle simple VET transfer scenario', () => {
            // Simple VET transfer has recipient, value, but no data
            const transferAmount = 1000000000000000000n; // 1 VET in wei
            const clause = new Clause(
                mockAddress,
                transferAmount,
                null,
                'VET transfer'
            );

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(transferAmount);
            expect(clause.data).toBeNull();
            expect(clause.comment).toBe('VET transfer');

            const json = clause.toJSON();
            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(transferAmount).toString());
            expect(json.data).toBe(Hex.PREFIX);
        });

        test('ok <- handle contract method call scenario', () => {
            // Contract method call has recipient, possible value, and data
            const methodCallData = HexUInt.of(
                '0xa9059cbb000000000000000000000000742d35cc'
            );
            const clause = new Clause(
                mockAddress,
                0n,
                methodCallData,
                'Token transfer',
                mockAbi
            );

            expect(clause.to).toBe(mockAddress);
            expect(clause.value).toBe(0n);
            expect(clause.data).toBe(methodCallData);
            expect(clause.comment).toBe('Token transfer');
            expect(clause.abi).toBe(mockAbi);

            const json = clause.toJSON();
            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe('0x0');
            expect(json.data).toBe(methodCallData.toString());
        });

        test('ok <- handle roundtrip consistency', () => {
            const originalClause = new Clause(
                mockAddress,
                mockValue,
                mockData,
                mockComment,
                mockAbi
            );

            const json = originalClause.toJSON();

            // Verify JSON structure
            expect(json.to).toBe(mockAddress.toString());
            expect(json.value).toBe(Quantity.of(mockValue).toString());
            expect(json.data).toBe(mockData.toString());

            // Note: comment and abi are not included in JSON, so perfect roundtrip
            // would require preserving them separately if needed
        });
    });

    describe('type validation and constraints', () => {
        test('ok <- handle maximum safe integer value', () => {
            const maxValue = BigInt(Number.MAX_SAFE_INTEGER);
            const clause = new Clause(mockAddress, maxValue);

            expect(clause.value).toBe(maxValue);
            expect(clause.toJSON().value).toBe(
                Quantity.of(maxValue).toString()
            );
        });

        test('ok <- handle values beyond JavaScript safe integer range', () => {
            const hugeValue = BigInt('999999999999999999999999999999999999999');
            const clause = new Clause(mockAddress, hugeValue);

            expect(clause.value).toBe(hugeValue);
            expect(clause.toJSON().value).toBe(
                Quantity.of(hugeValue).toString()
            );
        });

        test('ok <- handle various data formats', () => {
            const testCases = [
                { data: HexUInt.of('0x'), expected: '0x' },
                { data: HexUInt.of('0x00'), expected: '0x00' },
                { data: HexUInt.of('0xabcdef'), expected: '0xabcdef' },
                { data: null, expected: Hex.PREFIX }
            ];

            testCases.forEach(({ data, expected }) => {
                const clause = new Clause(mockAddress, mockValue, data);
                expect(clause.toJSON().data).toBe(expected);
            });
        });
    });
});
