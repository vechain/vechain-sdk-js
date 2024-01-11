import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

/**
 * Test cases for parseUnits
 */
const parseUnitsTestCases = [
    {
        value: '1',
        decimals: 18,
        expected: '1000000000000000000',
        description: 'should format a number to a string with 18 decimals'
    },
    {
        value: '1.1',
        decimals: 18,
        expected: '1100000000000000000',
        description: 'should format a number to a string with 18 decimals'
    },
    {
        value: '1',
        decimals: 4,
        expected: '10000',
        description: 'should format a number to a string with 4 decimals'
    },
    {
        value: '1.23456',
        decimals: 24,
        expected: '1234560000000000000000000',
        description: 'should format a number to a string with 24 decimals'
    },
    {
        value: '123456.789',
        decimals: 24,
        expected: '123456789000000000000000000000',
        description: 'should format a number to a string with 24 decimals'
    },
    {
        value: '1',
        decimals: 80,
        expected:
            '100000000000000000000000000000000000000000000000000000000000000000000000000000000',
        description: 'should format a number to a string with 120 decimals'
    },
    {
        value: '1',
        decimals: 'ether',
        expected: '1000000000000000000',
        description:
            'should format a number to a string with 18 decimals when given "ether"'
    },
    {
        value: '1',
        decimals: 'finney',
        expected: '1000000000000000',
        description:
            'should format a number to a string with 15 decimals when given "finney"'
    },
    {
        value: '1',
        decimals: 'szabo',
        expected: '1000000000000',
        description:
            'should format a number to a string with 15 decimals when given "szabo"'
    },
    {
        value: '1',
        decimals: 'gwei',
        expected: '1000000000',
        description:
            'should format a number to a string with 15 decimals when given "gwei"'
    },
    {
        value: '1',
        decimals: 'mwei',
        expected: '1000000',
        description:
            'should format a number to a string with 15 decimals when given "mwei"'
    },
    {
        value: '1',
        decimals: 'kwei',
        expected: '1000',
        description:
            'should format a number to a string with 15 decimals when given "kwei"'
    },
    {
        value: '1',
        decimals: 'wei',
        expected: '1',
        description:
            'should format a number to a string with 15 decimals when given "wei"'
    },
    {
        value: '-1',
        decimals: 18,
        expected: '-1000000000000000000',
        description:
            'should format a negative number to a string with 18 decimals'
    }
];

/**
 * Test cases for parseUnits with invalid values
 */
const invalidparseUnitsTestCases = [
    {
        value: '1,6',
        decimals: 18,
        expectedError: InvalidDataTypeError
    },
    {
        value: '1',
        decimals: 81,
        expectedError: TypeError
    }
];

/**
 * Test cases for formatUnits
 */
const formatUnitsTestCases = [
    {
        value: '1000000000000000000',
        decimals: 18,
        expected: '1.0',
        description: 'Should format a value with 18 decimals'
    },
    {
        value: '1000000000000000000',
        decimals: 4,
        expected: '100000000000000.0',
        description: 'should format a value with 4 decimals'
    },
    {
        value: '1000000000000000000',
        decimals: 24,
        expected: '0.000001',
        description: 'should format a value with 24 decimals'
    },
    {
        value: '1000000000000000000',
        decimals: 80,
        expected:
            '0.00000000000000000000000000000000000000000000000000000000000001',
        description: 'should format a value with 80 decimals'
    },
    {
        value: '123456789000000000000000000000',
        decimals: 18,
        expected: '123456789000.0',
        description: 'should format a large number with 18 decimals'
    },
    {
        value: '0xde0b6b3a7640000',
        decimals: 18,
        expected: '1.0',
        description: 'should format a hex string with 18 decimals'
    },
    {
        value: 1000000000000000000000000000000000000000000n,
        decimals: 18,
        expected: '1000000000000000000000000.0',
        description: 'should format a bigint with 18 decimals'
    },
    {
        value: 100000,
        decimals: 18,
        expected: '0.0000000000001',
        description: 'should format a number with 18 decimals'
    },
    {
        value: '1000000000000000000',
        decimals: 'ether',
        expected: '1.0',
        description: 'should format a value with "wei" decimals'
    },
    {
        value: '1000000000000000',
        decimals: 'finney',
        expected: '1.0',
        description: 'should format a value with "finney" decimals'
    },
    {
        value: '1000000000000',
        decimals: 'szabo',
        expected: '1.0',
        description: 'should format a value with "szabo" decimals'
    },
    {
        value: '1000000000',
        decimals: 'gwei',
        expected: '1.0',
        description: 'should format a value with "gwei" decimals'
    },
    {
        value: '1000000',
        decimals: 'mwei',
        expected: '1.0',
        description: 'should format a value with "mwei" decimals'
    },
    {
        value: '1000',
        decimals: 'kwei',
        expected: '1.0',
        description: 'should format a value with "kwei" decimals'
    },
    {
        value: '1',
        decimals: 'wei',
        expected: '1', // With 'wei', ethers returns a string without decimals
        description: 'should format a value with "wei" decimals'
    },
    {
        value: '-1000000000000000000',
        decimals: 18,
        expected: '-1.0',
        description: 'should format a negative value with 18 decimals'
    }
];

/**
 * Test cases for formatUnits with invalid values
 */
const invalidFormatUnitsTestCases = [
    {
        value: 'invalid-number',
        decimals: 18,
        expectedError: TypeError
    }
];

/**
 * Test cases for parseVET
 */
const parseVETtestCases = [
    {
        value: '1',
        expected: '1000000000000000000'
    },
    {
        value: '0.1',
        expected: '100000000000000000'
    },
    {
        value: '12345678901234567.89',
        expected: '12345678901234567890000000000000000'
    }
];

/**
 * Test cases for formatVET
 */
const formatVETtestCases = [
    {
        value: '1000000000000000000',
        expected: '1.0'
    },
    {
        value: '0x2D1AF488AA2A245F5A8DBA8',
        expected: '872463268.231948474782374824'
    },
    {
        value: '121235534681305942582523',
        expected: '121235.534681305942582523'
    },
    {
        value: '0x2387169cc2beabf02b',
        expected: '655.370182584678740011'
    }
];

export {
    parseUnitsTestCases,
    invalidparseUnitsTestCases,
    formatUnitsTestCases,
    invalidFormatUnitsTestCases,
    parseVETtestCases,
    formatVETtestCases
};
