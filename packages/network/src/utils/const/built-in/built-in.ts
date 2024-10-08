/**
 * Address of the Params built-in contract.
 *
 * @link see [params.sol](https://docs.vechain.org/developer-resources/built-in-contracts#params-sol)
 */
const PARAMS_ADDRESS = '0x0000000000000000000000000000506172616d73';

/**
 * Address of the Energy built-in contract.
 *
 * @link see [energy.sol](https://docs.vechain.org/developer-resources/built-in-contracts#energy-sol)
 */
const ENERGY_ADDRESS = '0x0000000000000000000000000000456e65726779';

/**
 * ABI of the Params built-in contract.
 *
 * @link see [params.sol](https://docs.vechain.org/developer-resources/built-in-contracts#params-sol)
 */
const PARAMS_ABI = [
    {
        constant: false,
        inputs: [
            {
                name: '_key',
                type: 'bytes32'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'set',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '_key',
                type: 'bytes32'
            }
        ],
        name: 'get',
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
        inputs: [],
        name: 'executor',
        outputs: [
            {
                name: '',
                type: 'address'
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
                name: 'key',
                type: 'bytes32'
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Set',
        type: 'event'
    }
] as const;

/**
 * ABI of the Energy built-in contract. (VTHO)
 *
 * @link see [energy.sol](https://docs.vechain.org/developer-resources/built-in-contracts#energy-sol)
 */
const ENERGY_ABI = [
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
] as const;

/**
 * Built-in contracts.
 */
export const BUILT_IN_CONTRACTS = {
    PARAMS_ABI,
    PARAMS_ADDRESS,
    ENERGY_ABI,
    ENERGY_ADDRESS
};
