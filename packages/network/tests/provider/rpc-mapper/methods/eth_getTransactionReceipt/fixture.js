"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptIncorrectCasesTestNetwork = exports.getReceiptCorrectCasesTestNetwork = exports.getReceiptCorrectCasesSoloNetwork = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("../../../../fixture");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
/**
 * Fixture for eth_getTransactionReceipt correct cases for solo network
 */
const getReceiptCorrectCasesSoloNetwork = [
    {
        testCase: 'eth_getTransactionReceipt - Should return correct transaction receipt for token transfer',
        hash: fixture_1.configData.SEED_TEST_TOKEN_TX_ID,
        expected: {
            blockHash: '0x0000000682236126daf237f3863f2d0fb3d417c8cedb9b1ea746514f0ec1ded8',
            blockNumber: '0x6',
            contractAddress: null,
            cumulativeGasUsed: '0x0',
            effectiveGasPrice: '0x0',
            from: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: '0xe8f8c',
            logs: sdk_solo_setup_1.THOR_SOLO_ACCOUNTS_TO_SEED.map((account, index) => {
                return {
                    address: '0x0000000000000000000000000000456e65726779',
                    blockHash: '0x0000000682236126daf237f3863f2d0fb3d417c8cedb9b1ea746514f0ec1ded8',
                    blockNumber: '0x6',
                    data: '0x00000000000000000000000000000000000000000000021e19e0c9bab2400000',
                    logIndex: '0x' + index.toString(16),
                    removed: false,
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa',
                        '0x000000000000000000000000' +
                            account.address.slice(2).toLowerCase()
                    ],
                    transactionHash: fixture_1.configData.SEED_TEST_TOKEN_TX_ID,
                    transactionIndex: '0x0'
                };
            }),
            logsBloom: '0x' + '0'.repeat(512),
            status: '0x1',
            to: '0x0000000000000000000000000000456e65726779',
            transactionHash: fixture_1.configData.SEED_TEST_TOKEN_TX_ID,
            transactionIndex: '0x0',
            type: '0x0'
        }
    }
];
exports.getReceiptCorrectCasesSoloNetwork = getReceiptCorrectCasesSoloNetwork;
/**
 * Fixture for eth_getTransactionReceipt correct cases for test network
 */
const getReceiptCorrectCasesTestNetwork = [
    {
        testCase: 'eth_getTransactionReceipt - Should return correct transaction receipt - test case 1, reverted transaction',
        hash: '0xfcee8fa4c325e3b35cf7a726db2a455fa8a0e8c84809ba0123487428f70ef7d2', // Simple reverted transaction
        expected: {
            blockHash: '0x010be0ce812bed2ef355b0163ec1d21ceb10f10573c45a7e5a24ef0c00b23181',
            blockNumber: '0x10be0ce',
            contractAddress: null,
            from: '0x4383ce6813f49438b7d9a9716a4bb799d83cf116',
            gasUsed: '0x698f',
            logs: [],
            status: '0x0',
            to: '0x9395baa47082552592f9cef61c2a1f068bd2af8f',
            transactionHash: '0xfcee8fa4c325e3b35cf7a726db2a455fa8a0e8c84809ba0123487428f70ef7d2',
            transactionIndex: '0x0',
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            cumulativeGasUsed: '0x0',
            effectiveGasPrice: '0x0',
            type: '0x0'
        }
    },
    {
        testCase: 'eth_getTransactionReceipt - Should return correct transaction receipt - test case 2, multiple logs',
        hash: '0x5144c9150768535d1b4263ffe7f1756b2e2e06020ccb9cf7c5b7dc996ce92276',
        expected: {
            blockHash: '0x0114b4a1182a9103113a4052b2d08e7785ea74901c6974f16661d352202d7bf6',
            blockNumber: '0x114b4a1',
            contractAddress: null,
            cumulativeGasUsed: '0x0',
            effectiveGasPrice: '0x0',
            from: '0x16e3f269c3fb5dcc5844e0e5e7f8bf16270e9755',
            gasUsed: '0x202e4',
            logs: [
                {
                    address: '0xac0ca2a5148e15ef913f9f5cf8eb3cf763f5a43f',
                    blockHash: '0x0114b4a1182a9103113a4052b2d08e7785ea74901c6974f16661d352202d7bf6',
                    blockNumber: '0x114b4a1',
                    data: '0x0000000000000000000000000000000000000000000000024808a928fe542eed',
                    logIndex: '0x1',
                    removed: false,
                    topics: [
                        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
                        '0x00000000000000000000000016e3f269c3fb5dcc5844e0e5e7f8bf16270e9755',
                        '0x0000000000000000000000009df69ad8ff89063869e04164a11579c0a8532e84'
                    ],
                    transactionHash: '0x5144c9150768535d1b4263ffe7f1756b2e2e06020ccb9cf7c5b7dc996ce92276',
                    transactionIndex: '0x1'
                },
                {
                    address: '0x9df69ad8ff89063869e04164a11579c0a8532e84',
                    blockHash: '0x0114b4a1182a9103113a4052b2d08e7785ea74901c6974f16661d352202d7bf6',
                    blockNumber: '0x114b4a1',
                    data: '0x0000000000000000000000000000000000000000000000024808a928fe542eed',
                    logIndex: '0x2',
                    removed: false,
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        '0x00000000000000000000000016e3f269c3fb5dcc5844e0e5e7f8bf16270e9755'
                    ],
                    transactionHash: '0x5144c9150768535d1b4263ffe7f1756b2e2e06020ccb9cf7c5b7dc996ce92276',
                    transactionIndex: '0x1'
                },
                {
                    address: '0x9df69ad8ff89063869e04164a11579c0a8532e84',
                    blockHash: '0x0114b4a1182a9103113a4052b2d08e7785ea74901c6974f16661d352202d7bf6',
                    blockNumber: '0x114b4a1',
                    data: '0x0000000000000000000000000000000000000000000000043c47d85f5fdafe3d000000000000000000000000000000000000000000000006845081885e2f2d2a',
                    logIndex: '0x3',
                    removed: false,
                    topics: [
                        '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724',
                        '0x00000000000000000000000016e3f269c3fb5dcc5844e0e5e7f8bf16270e9755'
                    ],
                    transactionHash: '0x5144c9150768535d1b4263ffe7f1756b2e2e06020ccb9cf7c5b7dc996ce92276',
                    transactionIndex: '0x1'
                },
                {
                    address: '0xac0ca2a5148e15ef913f9f5cf8eb3cf763f5a43f',
                    blockHash: '0x0114b4a1182a9103113a4052b2d08e7785ea74901c6974f16661d352202d7bf6',
                    blockNumber: '0x114b4a1',
                    data: '0x0000000000000000000000000000000000000000000000024808a928fe542eed',
                    logIndex: '0x4',
                    removed: false,
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x00000000000000000000000016e3f269c3fb5dcc5844e0e5e7f8bf16270e9755',
                        '0x0000000000000000000000009df69ad8ff89063869e04164a11579c0a8532e84'
                    ],
                    transactionHash: '0x5144c9150768535d1b4263ffe7f1756b2e2e06020ccb9cf7c5b7dc996ce92276',
                    transactionIndex: '0x1'
                }
            ],
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            status: '0x1',
            to: '0xac0ca2a5148e15ef913f9f5cf8eb3cf763f5a43f',
            transactionHash: '0x5144c9150768535d1b4263ffe7f1756b2e2e06020ccb9cf7c5b7dc996ce92276',
            transactionIndex: '0x1',
            type: '0x0'
        }
    },
    {
        testCase: 'eth_getTransactionReceipt - Should return correct transaction receipt - test case 3, reverted transaction',
        hash: '0x0000000000000000000000000b2a455fa8000000000000000000000000000000', // Simple null transaction
        expected: null
    }
];
exports.getReceiptCorrectCasesTestNetwork = getReceiptCorrectCasesTestNetwork;
/**
 * Fixture for eth_getTransactionReceipt incorrect cases for test network
 */
const getReceiptIncorrectCasesTestNetwork = [
    {
        testCase: 'eth_getTransactionReceipt - Should throw error for invalid params length',
        params: [],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    },
    {
        testCase: 'eth_getTransactionReceipt - Should throw error for invalid transaction id',
        params: ['0x_INVALID_TRANSACTION_ID'],
        expectedError: sdk_errors_1.JSONRPCInvalidParams
    }
];
exports.getReceiptIncorrectCasesTestNetwork = getReceiptIncorrectCasesTestNetwork;
