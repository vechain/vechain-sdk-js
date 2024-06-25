import { coder, unitsUtils } from '@vechain/sdk-core';
import { stringifyData } from '@vechain/sdk-errors';
import { ThorClient, TransactionSimulationResult } from '@vechain/sdk-network';
import { expect } from 'expect';

/**
 * ABI of the Energy built-in contract. (VTHO)
 *
 * @link see [energy.sol](https://docs.vechain.org/developer-resources/built-in-contracts#energy-sol)
 */
const energy_abi = stringifyData([
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'approve',
        outputs: [
            {
                name: 'success',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_from',
                type: 'address'
            },
            {
                name: '_to',
                type: 'address'
            },
            {
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'transferFrom',
        outputs: [
            {
                name: 'success',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'pure',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address'
            },
            {
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'transfer',
        outputs: [
            {
                name: 'success',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_from',
                type: 'address'
            },
            {
                name: '_to',
                type: 'address'
            },
            {
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'move',
        outputs: [
            {
                name: 'success',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalBurned',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address'
            },
            {
                name: '_spender',
                type: 'address'
            }
        ],
        name: 'allowance',
        outputs: [
            {
                name: 'remaining',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_from',
                type: 'address'
            },
            {
                indexed: true,
                name: '_to',
                type: 'address'
            },
            {
                indexed: false,
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'Transfer',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: '_owner',
                type: 'address'
            },
            {
                indexed: true,
                name: '_spender',
                type: 'address'
            },
            {
                indexed: false,
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'Approval',
        type: 'event'
    }
]);

const _soloUrl = 'http://localhost:8669/';
const thorSoloClient = ThorClient.fromUrl(_soloUrl);

// START_SNIPPET: RevertReasonSimulationSnippet

const simulatedTx: TransactionSimulationResult[] = await thorSoloClient.transactions.simulateTransaction(
    [
        {
            to: '0x0000000000000000000000000000456e65726779',
            value: '0',
            data: coder.encodeFunctionInput(
                energy_abi,
                'transfer',
                [
                    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                    unitsUtils.parseVET('1000000000')
                ]
            )
        }
    ]
);

const revertReason = await thorSoloClient.transactions.decodeRevertReason(simulatedTx[0].data);

// END_SNIPPET: RevertReasonSimulationSnippet

expect(revertReason).toBe('builtin: insufficient balance');
