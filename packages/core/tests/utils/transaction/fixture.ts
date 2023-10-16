import { ERRORS, TRANSACTIONS_GAS_CONSTANTS } from '../../../src';
import { type Clause } from '../../../src/transaction/types';

/**
 * Invalid clauses data fixture
 */
const invalidData = [
    // Invalid to field
    {
        to: 'INVALID_ADDRESS',
        value: 0,
        data: '',
        errorToThrow: ERRORS.DATA.INVALID_DATA_TYPE('an address')
    },
    // Invalid data field format for smart contract creation
    {
        to: null,
        value: 0,
        data: 'INVALID_DATA_FORMAT',
        errorToThrow: ERRORS.DATA.INVALID_DATA_TYPE('a hexadecimal string')
    }
];

/**
 * Fixture for normal transactions clauses
 */
const normalTransactions = [
    // 1 clause transaction
    {
        clauses: [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 0,
                data: ''
            }
        ],
        expected:
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS +
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS
    },
    // 5 clause transaction
    {
        clauses: Array(5).fill({
            to: '0x0000000000000000000000000000000000000000',
            value: 0,
            data: ''
        }),
        expected:
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS * 5 +
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS
    }
];

/**
 * Fixture for normal transactions clauses
 */
const smartContractTransactions = (
    numberOfZeroBytes: number,
    numberOfNonZeroBytes: number
): Array<{ clauses: Clause[]; expected: number }> => [
    // Empty data contract creation
    {
        clauses: [
            {
                to: null,
                value: 0,
                data: ''
            }
        ],
        expected:
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS
    },

    // Empty data contract creation - With some zeros
    {
        clauses: [
            {
                to: null,
                value: 0,
                data: '0x' + '00'.repeat(numberOfZeroBytes)
            }
        ],
        expected:
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS +
            TRANSACTIONS_GAS_CONSTANTS.ZERO_GAS_DATA * numberOfZeroBytes
    },

    // Smart contract creation - With some non-zero bytes
    {
        clauses: [
            {
                to: null,
                value: 0,
                data: '0x' + '10'.repeat(numberOfNonZeroBytes)
            }
        ],
        expected:
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS +
            TRANSACTIONS_GAS_CONSTANTS.NON_ZERO_GAS_DATA * numberOfNonZeroBytes
    },

    // Smart contract creation - With some zeros and non-zero bytes
    {
        clauses: [
            {
                to: null,
                value: 0,
                data:
                    '0x' +
                    '00'.repeat(numberOfZeroBytes) +
                    '10'.repeat(numberOfNonZeroBytes)
            }
        ],
        expected:
            TRANSACTIONS_GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION +
            TRANSACTIONS_GAS_CONSTANTS.TX_GAS +
            TRANSACTIONS_GAS_CONSTANTS.ZERO_GAS_DATA * numberOfZeroBytes +
            TRANSACTIONS_GAS_CONSTANTS.NON_ZERO_GAS_DATA * numberOfNonZeroBytes
    }
];

export { invalidData, normalTransactions, smartContractTransactions };
