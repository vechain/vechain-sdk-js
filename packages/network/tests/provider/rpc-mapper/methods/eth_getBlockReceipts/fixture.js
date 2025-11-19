"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockReceiptsInvalidFixture = exports.blockHashReceiptsFixture = exports.blockReceiptsFixture = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Fixtures for the `eth_getBlockReceipts` RPC method.
 *
 * This fixtures are used to test the `eth_getBlockReceipts` RPC method to
 * test positive cases.
 */
const blockReceiptsFixture = [
    {
        blockNumber: '0x122c99a',
        expected: [
            {
                blockHash: '0x0122c99aaf2b9ee1e4d4835c0dc78e799b09101b06b67733ff58b416c8b0b870',
                blockNumber: '0x122c99a',
                contractAddress: null,
                from: '0x4f6fc409e152d33843cf4982d414c1dd0879277e',
                gasUsed: '0xcd66',
                logs: [
                    {
                        blockHash: '0x0122c99aaf2b9ee1e4d4835c0dc78e799b09101b06b67733ff58b416c8b0b870',
                        blockNumber: '0x122c99a',
                        transactionHash: '0x43b02a0dac2503d3e8d9540bf3174466267c558a3a50fa997a8f5a590711c10c',
                        address: '0x0000000000000000000000000000456e65726779',
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000004f6fc409e152d33843cf4982d414c1dd0879277e',
                            '0x0000000000000000000000009ac05eb9defbd0cef08548fa33a9d25972684be5'
                        ],
                        data: '0x000000000000000000000000000000000000000000000002b5e3af16b1880000',
                        removed: false,
                        transactionIndex: '0x0',
                        logIndex: '0x0'
                    }
                ],
                status: '0x1',
                to: '0x9ac05eb9defbd0cef08548fa33a9d25972684be5',
                transactionHash: '0x43b02a0dac2503d3e8d9540bf3174466267c558a3a50fa997a8f5a590711c10c',
                transactionIndex: '0x0',
                logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                cumulativeGasUsed: '0x0',
                effectiveGasPrice: '0x0',
                type: '0x0'
            }
        ]
    },
    {
        blockNumber: sdk_core_1.HexInt.of(17529453).toString(),
        expected: [
            {
                blockHash: '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
                blockNumber: '0x10b7a6d',
                contractAddress: null,
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                gasUsed: '0x60d8',
                logs: [],
                status: '0x1',
                to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                transactionHash: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
                transactionIndex: '0x0',
                logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                cumulativeGasUsed: '0x0',
                effectiveGasPrice: '0x0',
                type: '0x0'
            },
            {
                blockHash: '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
                blockNumber: '0x10b7a6d',
                contractAddress: null,
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                gasUsed: '0x9da8',
                logs: [],
                status: '0x1',
                to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                transactionHash: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
                transactionIndex: '0x1',
                logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                cumulativeGasUsed: '0x0',
                effectiveGasPrice: '0x0',
                type: '0x0'
            },
            {
                blockHash: '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
                blockNumber: '0x10b7a6d',
                contractAddress: null,
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                gasUsed: '0xae68',
                logs: [],
                status: '0x1',
                to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                transactionHash: '0xb476d1a43b8632c25a581465c944a1cb5dd99e48d41d326a250847a0a279afa5',
                transactionIndex: '0x2',
                logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                cumulativeGasUsed: '0x0',
                effectiveGasPrice: '0x0',
                type: '0x0'
            }
        ]
    }
];
exports.blockReceiptsFixture = blockReceiptsFixture;
/**
 * Negative test cases for the `eth_getBlockReceipts` RPC method.
 *
 * This fixtures are used to test the `eth_getBlockReceipts` RPC method to
 * test negative cases.
 */
const blockReceiptsInvalidFixture = [
    // Invalid block number hex string
    {
        blockNumber: 'INVALID_BLOCK_NUMBER'
    },
    // Null block number given
    {
        blockNumber: null
    },
    // No block number given
    {}
];
exports.blockReceiptsInvalidFixture = blockReceiptsInvalidFixture;
/**
 * Block hash for testing ethGetBlockReceipts with a specific block hash
 */
const blockHashReceiptsFixture = {
    blockHash: '0x015395abb2644d21d6f15c9e2b616a190e1a9d01259ba895d6f99ece4f99e2f0'
};
exports.blockHashReceiptsFixture = blockHashReceiptsFixture;
