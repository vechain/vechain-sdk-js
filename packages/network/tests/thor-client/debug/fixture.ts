import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

/**
 * Debug traceTransactionClause tests fixture testnet
 *
 * @NOTE we refers to block 0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f.
 * It has the following transactions:
 * * Index 0 - 0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687 (1 clause, index 0)
 * * Index 1 - 0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f (1 clause, index 0)
 */
const traceTransactionClauseTestnet = {
    // Positive test cases
    positiveCases: [
        // Transaction 1 - With transaction ID
        {
            testName:
                'traceTransactionClause - transaction 1 with transaction ID',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction:
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
            clauseIndex: 0,
            name: null,
            expected: { gas: 0, failed: false, returnValue: '', structLogs: [] }
        },
        // Transaction 1 - With transaction index into block
        {
            testName:
                'traceTransactionClause - transaction 1 with transaction  index into block',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 0,
            clauseIndex: 0,
            name: null,
            expected: { gas: 0, failed: false, returnValue: '', structLogs: [] }
        },
        // Transaction 2 - With transaction ID
        {
            testName:
                'traceTransactionClause - transaction 2 with transaction ID',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction:
                '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f',
            clauseIndex: 0,
            name: 'call',
            expected: {
                from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
                gas: '0x8b92',
                gasUsed: '0x50fa',
                to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
                input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
                value: '0x0',
                type: 'CALL'
            }
        },
        // Transaction 2 - With transaction index into block
        {
            testName:
                'traceTransactionClause - transaction 2 with transaction index into block',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 1,
            clauseIndex: 0,
            name: 'noop',
            expected: {}
        }
    ],
    // Negative test cases
    negativeCases: [
        // Invalid block ID
        {
            testName: 'traceTransactionClause - transaction 1 invalid block ID',
            blockID: 'INVALID',
            transaction:
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
            clauseIndex: 0,
            name: null,
            expectedError: InvalidDataTypeError
        },
        // Invalid transaction ID
        {
            testName:
                'traceTransactionClause - transaction 1 invalid transaction ID',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 'INVALID',
            clauseIndex: 0,
            name: null,
            expectedError: InvalidDataTypeError
        },
        // Invalid transaction index
        {
            testName:
                'traceTransactionClause - transaction 1 invalid transaction index',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: -1,
            clauseIndex: 0,
            name: null,
            expectedError: InvalidDataTypeError
        },
        // Invalid clause index
        {
            testName:
                'traceTransactionClause - transaction 1 invalid clause index',
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction: 0,
            clauseIndex: -1,
            name: null,
            expectedError: InvalidDataTypeError
        }
    ]
};

/**
 * First transaction testnet fixture
 *
 * @NOTE we refers, again, to block 0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f.
 */
const firstTransactionTestnetFixture =
    traceTransactionClauseTestnet.positiveCases[0];

export { traceTransactionClauseTestnet, firstTransactionTestnetFixture };
