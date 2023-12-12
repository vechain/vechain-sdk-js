import { contract, unitsUtils } from '@vechainfoundation/vechain-sdk-core';
import { BUILT_IN_CONTRACTS } from '../../../built-in-fixture';
import {
    TESTING_CONTRACT_ABI,
    TEST_ACCOUNTS,
    TEST_CONTRACT_ADDRESS
} from '../../../fixture';
import { transfer1VTHOClause } from '../transactions/fixture';

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
                    data: contract.coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1000000000')
                        ]
                    )
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 24455,
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
                    data: contract.coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1000000000')
                        ]
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1000000000').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 40455,
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
                    data: contract.coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1')
                        ]
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1000000000').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['', ''],
                reverted: true,
                totalGas: 52518,
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
                    data: contract.coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1')
                        ]
                    )
                },
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1')
                        ]
                    )
                },
                {
                    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: contract.coder.encodeFunctionInput(
                        BUILT_IN_CONTRACTS.ENERGY_ABI,
                        'transfer',
                        [
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                                .address,
                            unitsUtils.parseVET('1000000000')
                        ]
                    )
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['', '', 'builtin: insufficient balance'],
                reverted: true,
                totalGas: 87491,
                vmErrors: ['', '', 'execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts with a Panic(uint256) error',
            clauses: [
                {
                    to: TEST_CONTRACT_ADDRESS,
                    value: '0',
                    data: contract.coder.encodeFunctionInput(
                        TESTING_CONTRACT_ABI,
                        'testAssertError',
                        [1] // Any number !== 0 will cause Panic error
                    )
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                revertReasons: ['Panic(0x01)'], // 0x01: If you call assert with an argument that evaluates to false.
                reverted: true,
                totalGas: 22009,
                vmErrors: ['execution reverted']
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction that reverts due to offered gas below the gas required',
            clauses: [transfer1VTHOClause],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
                gas: 1000
            },
            expected: {
                reverted: true,
                totalGas: 24192,
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
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 36518,
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
                    to: TEST_CONTRACT_ADDRESS,
                    value: '0',
                    data: contract.coder.encodeFunctionInput(
                        TESTING_CONTRACT_ABI,
                        'testAssertError',
                        [0] // Any number !== 0 will cause Panic error
                    )
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 100954,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description:
                'Should estimate gas cost of a transaction with delegation context',
            clauses: [transfer1VTHOClause],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
                gasPayer: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
            },
            expected: {
                reverted: false,
                totalGas: 36518,
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
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
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
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                },
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: unitsUtils.parseVET('1').toString(),
                    data: '0x'
                }
            ],
            options: {
                caller: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            },
            expected: {
                reverted: false,
                totalGas: 37000,
                revertReasons: [],
                vmErrors: []
            }
        }
    ]
};

export { estimateGasTestCases };
