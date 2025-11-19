"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockLogsFixture = exports.logsFixture = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Fixtures for eth_getLogs positive cases
 */
const logsFixture = [
    // Well defined input
    {
        input: {
            address: ['0x0000000000000000000000000000456e65726779'],
            fromBlock: sdk_core_1.Hex.of(0).toString(),
            toBlock: sdk_core_1.Hex.of(100000n).toString(), // Same integer has different hex representations for bigint and number IEEE 754.
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ]
        },
        expected: [
            {
                transactionHash: '0x0ee8df3a9de6787ec0848ea8951ed8899bb053b6b4af167228dd7c0c012f5346',
                blockHash: '0x000060716a6decc7127d221e8a53cd7b33992db6236490f79d47585f9ae7ca14',
                blockNumber: '0x6071',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e55fff280',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            },
            {
                transactionHash: '0x86b3364c0faf2df6365b975cf1bd8046264b1eeaa2f266fe15b2df27d7954f65',
                blockHash: '0x00006135c993e6cd1ed99aac34679caac80759764ecb01431c9bea0199f3bf4c',
                blockNumber: '0x6135',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            },
            {
                transactionHash: '0x9fada14187c54ca93741c7b20483f52dc83b3f5a934082ea1d7a7d75216c1b80',
                blockHash: '0x00006a2e2b18a4e7697c54045d2d615fe1a2eaad9a698e803c15b847ad4a7f95',
                blockNumber: '0x6a2e',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            },
            {
                transactionHash: '0xed2c6e452326f2ea126632830ebb8abca5bbfbed9da0780bf65efbbf555c8452',
                blockHash: '0x00006a423cfbab794f79328cbd0f29f08f0ed1466c076153445d10c3e0ac21b2',
                blockNumber: '0x6a42',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            }
        ]
    },
    {
        input: {
            address: null,
            fromBlock: sdk_core_1.Hex.of(0).toString(),
            toBlock: sdk_core_1.Hex.of(100000n).toString(), // Same integer has different hex representations for bigint and number IEEE 754.
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ]
        },
        expected: [
            {
                transactionHash: '0x0ee8df3a9de6787ec0848ea8951ed8899bb053b6b4af167228dd7c0c012f5346',
                blockHash: '0x000060716a6decc7127d221e8a53cd7b33992db6236490f79d47585f9ae7ca14',
                blockNumber: '0x6071',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e55fff280',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            },
            {
                transactionHash: '0x86b3364c0faf2df6365b975cf1bd8046264b1eeaa2f266fe15b2df27d7954f65',
                blockHash: '0x00006135c993e6cd1ed99aac34679caac80759764ecb01431c9bea0199f3bf4c',
                blockNumber: '0x6135',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            },
            {
                transactionHash: '0x9fada14187c54ca93741c7b20483f52dc83b3f5a934082ea1d7a7d75216c1b80',
                blockHash: '0x00006a2e2b18a4e7697c54045d2d615fe1a2eaad9a698e803c15b847ad4a7f95',
                blockNumber: '0x6a2e',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            },
            {
                transactionHash: '0xed2c6e452326f2ea126632830ebb8abca5bbfbed9da0780bf65efbbf555c8452',
                blockHash: '0x00006a423cfbab794f79328cbd0f29f08f0ed1466c076153445d10c3e0ac21b2',
                blockNumber: '0x6a42',
                address: '0x0000000000000000000000000000456e65726779',
                data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                    '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                ],
                removed: false,
                logIndex: '0x0',
                transactionIndex: '0x0'
            }
        ]
    }
];
exports.logsFixture = logsFixture;
/**
 * Fixtures for eth_getLogs mocked positive cases
 */
const mockLogsFixture = [
    // To block not defined (latest block as default)
    {
        input: {
            address: [
                '0x0000000000000000000000000000456e65726779',
                '0x0000000000000000000000000000456e65726779'
            ],
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ],
            fromBlock: sdk_core_1.Hex.of(0).toString(),
            toBlock: sdk_core_1.Hex.of(1n).toString() // Same integer has different hex representations for bigint and number IEEE 754.
        },
        expected: []
    },
    // From block and to not defined (latest block as default)
    {
        input: {
            address: [
                '0x0000000000000000000000000000456e65726779',
                '0x0000000000000000000000000000456e65726779'
            ],
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ],
            fromBlock: sdk_core_1.Hex.of(0).toString(),
            toBlock: sdk_core_1.Hex.of(1n).toString() // Same integer has different hex representations for bigint and number IEEE 754.
        },
        expected: []
    },
    // No topics defined, only addresses
    {
        input: {
            address: [
                '0x0000000000000000000000000000456e65726779',
                '0x0000000000000000000000000000456e65726779'
            ],
            fromBlock: sdk_core_1.Hex.of(0).toString(),
            toBlock: sdk_core_1.Hex.of(1n).toString() // Same integer has different hex representations for bigint and number IEEE 754.
        },
        expected: []
    },
    // No addresses defined, only topics
    {
        input: {
            topics: [
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ],
            fromBlock: sdk_core_1.Hex.of(0).toString(),
            toBlock: sdk_core_1.Hex.of(1n).toString() // Same integer has different hex representations for bigint and number IEEE 754.
        },
        expected: []
    },
    // fromBlock and toBlock not defined (latest block as default)
    {
        input: {
            address: '0x0000000000000000000000000000456e65726779'
        },
        expected: []
    }
];
exports.mockLogsFixture = mockLogsFixture;
