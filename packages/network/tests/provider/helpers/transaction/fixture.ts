import {
    blockWithTransactionsExpanded,
    blockWithTransactionsNotExpanded
} from '../../fixture';

/**
 * Test cases for getTransactionIndex
 */
const getTransactionIndexTestCases = [
    {
        block: blockWithTransactionsExpanded,
        hash: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
        expected: 1
    },
    {
        block: blockWithTransactionsExpanded,
        hash: '0xb476d1a43b8632c25a581465c944a1cb5dd99e48d41d326a250847a0a279afa5',
        expected: 2
    },
    {
        block: blockWithTransactionsNotExpanded,
        hash: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
        expected: 0
    }
];

/**
 * Test cases for getTransactionIndex with invalid data
 */
const invalidGetTransactionIndexTestCases = [
    {
        block: blockWithTransactionsExpanded,
        hash: '0x'
    },
    {
        block: blockWithTransactionsExpanded,
        hash: '0xf476d1a43b8632c25a581465c944a1cb5dd99e48541d326a250847a0a279afa5'
    },
    {
        block: blockWithTransactionsNotExpanded,
        hash: 'invalid-hash'
    }
];

export { getTransactionIndexTestCases, invalidGetTransactionIndexTestCases };
