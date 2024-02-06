import {
    InvalidDataTypeError,
    ProviderRpcError
} from '@vechain/vechain-sdk-errors';

/**
 * Fixtures for eth_call positive cases
 */
const positiveCasesFixtures = [
    {
        description: 'Sends 1 VET to the receiver.',
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
