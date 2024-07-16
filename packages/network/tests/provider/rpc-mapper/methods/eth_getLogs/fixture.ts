import { Hex0x } from '@vechain/sdk-core';

/**
 * Fixtures for eth_getLogs positive cases
 */
const logsFixture = [
    // Well defined input
    {
        input: {
            address: ['0x0000000000000000000000000000456e65726779'],
            fromBlock: Hex0x.of(0),
            toBlock: Hex0x.of(100000),
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ]
        },
        expected: []
    },
    {
        input: {
            address: null,
            fromBlock: Hex0x.of(0),
            toBlock: Hex0x.of(100000),
            topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ]
        },
        expected: []
    }
];

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
            fromBlock: Hex0x.of(0),
            toBlock: Hex0x.of(1)
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
            fromBlock: Hex0x.of(0),
            toBlock: Hex0x.of(1)
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
            fromBlock: Hex0x.of(0),
            toBlock: Hex0x.of(1)
        },
        expected: []
    },

    // No addresses defined, only topics
    {
        input: {
            topics: [
                '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
            ],
            fromBlock: Hex0x.of(0),
            toBlock: Hex0x.of(1)
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

export { logsFixture, mockLogsFixture };
