import {
    InvalidDataTypeError,
    ProviderRpcError
} from '@vechain/vechain-sdk-errors';
import { clauseBuilder, unitsUtils } from '@vechain/vechain-sdk-core';

/**
 * Fixtures for positive cases
 */
const positiveCasesFixtures = [
    {
        description: 'Simple transfer.',
        input: [
            clauseBuilder.transferVET(
                '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                unitsUtils.parseVET('1000')
            ),
            'latest'
        ],
        expected: '0x5208'
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
                to: '0x7487d912d03ab9de786278f679592b3730bdd540'
            },
            'latest'
        ],
        expected: ProviderRpcError
    }
];

export { positiveCasesFixtures, negativeCasesFixtures };
