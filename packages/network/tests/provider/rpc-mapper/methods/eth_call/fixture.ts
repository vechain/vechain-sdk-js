import { InvalidDataTypeError, ProviderRpcError } from '@vechain/sdk-errors';
import { Hex0x } from '@vechain/sdk-core';

/**
 * Fixtures for positive cases
 */
const positiveCasesFixtures = [
    {
        description: 'Sends 1 VET to the receiver. (latest tag)',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'latest'
        ],
        expected: '0x'
    },
    {
        description: 'Sends 1 VET to the receiver. (finalized tag)',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'finalized'
        ],
        expected: '0x'
    },
    {
        description: 'Sends 1 VET to the receiver. (safe tag)',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'safe'
        ],
        expected: '0x'
    },
    {
        description: 'Sends 1 VET to the receiver. (pending tag)',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'pending'
        ],
        expected: '0x'
    },
    {
        description: 'Sends 1 VET to the receiver. (using { blockNumber: 0 } )',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            {
                blockNumber: 0
            }
        ],
        expected: '0x'
    },
    {
        description: 'Sends 1 VET to the receiver. (using { blockHash: 0x } )',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            {
                blockHash: Hex0x.of(0)
            }
        ],
        expected: '0x'
    },
    {
        description:
            'Sends 1 VET to the receiver. (using 0x0 string blockHash)',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            Hex0x.of(0)
        ],
        expected: '0x'
    },
    {
        description: 'Sends 1 VET to the receiver. (earliest tag)',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'earliest'
        ],
        expected: '0x'
    },
    {
        description: 'Send complex transaction object.',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
                gas: 30432,
                gasPrice: '0x9184e72a000',
                value: '0x9184e72a',
                data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'
            },
            'latest'
        ],
        expected: '0x'
    },
    {
        description: 'Send complex transaction object.',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
                gas: 30432,
                gasPrice: '0x9184e72a000',
                value: '0x9184e72a',
                data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'
            },
            'latest'
        ],
        expected: '0x'
    }
];

/**
 * Negative cases fixtures
 */
const negativeCasesFixtures = [
    {
        description: 'No parameter passed',
        input: [],
        expected: InvalidDataTypeError
    },
    {
        description: 'Missing parameters',
        input: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540'
            },
            'latest'
        ],
        expected: ProviderRpcError
    }
];

export { positiveCasesFixtures, negativeCasesFixtures };
