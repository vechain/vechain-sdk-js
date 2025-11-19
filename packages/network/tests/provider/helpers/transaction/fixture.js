"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidGetTransactionIndexTestCases = exports.getTransactionIndexTestCases = void 0;
const fixture_1 = require("../../fixture");
/**
 * Test cases for getTransactionIndex
 */
const getTransactionIndexTestCases = [
    {
        block: fixture_1.blockWithTransactionsExpanded,
        hash: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
        expected: 1
    },
    {
        block: fixture_1.blockWithTransactionsExpanded,
        hash: '0xb476d1a43b8632c25a581465c944a1cb5dd99e48d41d326a250847a0a279afa5',
        expected: 2
    },
    {
        block: fixture_1.blockWithTransactionsNotExpanded,
        hash: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
        expected: 0
    }
];
exports.getTransactionIndexTestCases = getTransactionIndexTestCases;
/**
 * Test cases for getTransactionIndex with invalid data
 */
const invalidGetTransactionIndexTestCases = [
    {
        block: fixture_1.blockWithTransactionsExpanded,
        hash: '0x'
    },
    {
        block: fixture_1.blockWithTransactionsExpanded,
        hash: '0xf476d1a43b8632c25a581465c944a1cb5dd99e48541d326a250847a0a279afa5'
    },
    {
        block: fixture_1.blockWithTransactionsNotExpanded,
        hash: 'invalid-hash'
    }
];
exports.invalidGetTransactionIndexTestCases = invalidGetTransactionIndexTestCases;
