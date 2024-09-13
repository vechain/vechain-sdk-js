import { coder, Units } from '@vechain/sdk-core';
import { BUILT_IN_CONTRACTS } from '../../../src';
import {
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../fixture';
import { transfer1VTHOClause } from '../transactions/fixture';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Test cases for `estimateGas` method
 */
const estimateGasTestCases = {
    revert: [
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 1 clause',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            Units.parseEther('1000000000').bi
                        ]
                    )
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 39455,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 2 clauses where both revert',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            Units.parseEther('1000000000').bi
                        ]
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1000000000').toString(),
                    data: '0x'
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 55455,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 2 clauses where only second reverts',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            Units.parseEther('1').bi
                        ]
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1000000000').toString(),
                    data: '0x'
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['', ''],
                reverted: true,
                totalGas: 67518,
                vmErrors: ['', 'insufficient balance for transfer']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with 3 clauses where only last reverts',
            clauses: [
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            Units.parseEther('1').bi
                        ]
                    )
                },
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            Units.parseEther('1').bi
                        ]
                    )
                },
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            Units.parseEther('1000000000').bi
                        ]
                    )
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['', '', 'builtin: insufficient balance'],
                reverted: true,
                totalGas: 102491,
                vmErrors: ['', '', 'execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with a Panic(uint256) error',
            clauses: [
                {
                    to: TESTING_CONTRACT_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        TESTING_CONTRACT_ABI,
                        'testAssertError',
                        [1] // Any number !== 0 will cause Panic error
                    )
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['Panic(0x01)'], // 0x01: If you call assert with an argument that evaluates to false.
                reverted: true,
                totalGas: 37009,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts due to offered gas below the gas required',
            clauses: [transfer1VTHOClause],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gas: 1000
            },
            expected: {
                reverted: true,
                totalGas: 39192,
                revertReasons: [''],
                vmErrors: ['out of gas']
            }
        }
    ],
    success: [
        {
            description:
                'Should estimate gas cost of a transaction that transfers 1 VTHO',
            clauses: [transfer1VTHOClause],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                reverted: false,
                totalGas: 51518,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that executes many clauses',
            clauses: [
                transfer1VTHOClause,
                transfer1VTHOClause,
                {
                    to: TESTING_CONTRACT_ADDRESS,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        TESTING_CONTRACT_ABI,
                        'testAssertError',
                        [0] // Any number !== 0 will cause Panic error
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1').toString(),
                    data: '0x'
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                reverted: false,
                totalGas: 115954,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction with delegation context',
            clauses: [transfer1VTHOClause],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gasPayer: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
            },
            expected: {
                reverted: false,
                totalGas: 51518,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction sending VET',
            clauses: [
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1').toString(),
                    data: '0x'
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                reverted: false,
                totalGas: 21000,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction sending VET with 2 clauses',
            clauses: [
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1').toString(),
                    data: '0x'
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1').toString(),
                    data: '0x'
                }
            ],
            caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gasPadding: 0.2 // 20%
            },
            expected: {
                reverted: false,
                totalGas: 44400, // 37000 + 20%
                revertReasons: [],
                vmErrors: []
            }
        }
    ]
};

/**
 * Test cases where the estimation throws an error
 */
const invalidEstimateGasTestCases = [
    {
        clauses: [],
        options: {},
        expectedError: InvalidDataType
    },
    {
        clauses: [
            {
                to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPadding: 1.1
        },
        expectedError: InvalidDataType
    },
    {
        clauses: [
            {
                to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPadding: 0
        },
        expectedError: InvalidDataType
    },
    {
        clauses: [
            {
                to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPadding: -1
        },
        expectedError: InvalidDataType
    }
];

export { estimateGasTestCases, invalidEstimateGasTestCases };
