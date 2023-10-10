import { address } from '../../src';

/**
 * Simple functions
 */

const function1 = {
    constant: false,
    inputs: [
        {
            name: 'a1',
            type: 'uint256'
        },
        {
            name: 'a2',
            type: 'string'
        }
    ],
    name: 'f1',
    outputs: [
        {
            name: 'r1',
            type: 'address'
        },
        {
            name: 'r2',
            type: 'bytes'
        }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
};

const function2 = {
    inputs: [],
    name: 'nodes',
    payable: false,
    outputs: [
        {
            components: [
                {
                    internalType: 'address',
                    name: 'master',
                    type: 'address'
                },
                {
                    internalType: 'address',
                    name: 'endorsor',
                    type: 'address'
                },
                {
                    internalType: 'bytes32',
                    name: 'identity',
                    type: 'bytes32'
                },
                {
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool'
                }
            ],
            internalType: 'struct AuthorityUtils.Candidate[]',
            name: 'list',
            type: 'tuple[]'
        }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
};

const function2SimpleParametersData: Array<{
    master: string;
    endorsor: string;
    identity: string;
    active: boolean;
}> = [
    {
        master: address.toChecksumed(
            '0x0e8fd586e022f825a109848832d7e552132bc332'
        ),
        endorsor: address.toChecksumed(
            '0x224626926a7a12225a60e127cec119c939db4a5c'
        ),
        identity:
            '0xdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c',
        active: false
    },
    {
        master: address.toChecksumed(
            '0x4977d68df97bb313b23238520580d8d3a59939bf'
        ),
        endorsor: address.toChecksumed(
            '0x7ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff'
        ),
        identity:
            '0x83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f534',
        active: false
    }
];

/**
 * Simple events
 */

const event1 = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            name: 'a1',
            type: 'uint256'
        },
        {
            indexed: false,
            name: 'a2',
            type: 'string'
        }
    ],
    name: 'E1',
    type: 'event'
};

const event2 = {
    anonymous: true,
    inputs: [
        {
            indexed: true,
            name: 'a1',
            type: 'uint256'
        },
        {
            indexed: false,
            name: 'a2',
            type: 'string'
        }
    ],
    name: 'E2',
    type: 'event'
};

const event3 = {
    anonymous: false,
    inputs: [
        {
            indexed: true,
            name: 'a1',
            type: 'uint256'
        }
    ],
    name: 'E3',
    type: 'event'
};

const event4 = {
    inputs: [
        {
            indexed: true,
            name: 'a1',
            type: 'string'
        }
    ],
    name: 'E4',
    type: 'event'
};

const event5 = {
    inputs: [
        {
            indexed: true,
            name: 'a1',
            type: 'bytes'
        }
    ],
    name: 'E5',
    type: 'event'
};

const event6 = {
    anonymous: false,
    inputs: [
        {
            components: [
                {
                    internalType: 'address',
                    name: 'master',
                    type: 'address'
                },
                {
                    internalType: 'address',
                    name: 'endorsor',
                    type: 'address'
                },
                {
                    internalType: 'bytes32',
                    name: 'identity',
                    type: 'bytes32'
                },
                {
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool'
                }
            ],
            internalType: 'struct AuthorityUtils.Candidate[]',
            name: 'nodes',
            indexed: false,
            type: 'tuple[]'
        }
    ],
    name: 'Added',
    type: 'event'
};

/**
 * Encode and decode parameter valid values
 */
const encodedDecodedValues = [
    {
        type: 'uint256',
        value: '2345675643',
        encoded:
            '0x000000000000000000000000000000000000000000000000000000008bd02b7b'
    },
    {
        type: 'bytes32',
        value: '0xdf32340000000000000000000000000000000000000000000000000000000000',
        encoded:
            '0xdf32340000000000000000000000000000000000000000000000000000000000'
    },
    {
        type: 'bytes',
        value: '0xdf3234',
        encoded:
            '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000'
    },
    {
        type: 'bytes32[]',
        value: [
            '0xdf32340000000000000000000000000000000000000000000000000000000000',
            '0xfdfd000000000000000000000000000000000000000000000000000000000000'
        ],
        encoded:
            '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000'
    },
    {
        type: 'string',
        value: 'Hello!%!',
        encoded:
            '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
    },
    {
        type: 'uint256',
        value: '16',
        encoded:
            '0x0000000000000000000000000000000000000000000000000000000000000010'
    }
];

/**
 * Encode and decode parameter invalid values
 */
const encodedDecodedInvalidValues = [
    {
        type: 'INVALID_TYPE',
        value: 'INVALID_VALUE',
        encoded: 'INVALID_ENCODED_VALUE'
    },
    {
        type: 'uint256',
        value: 'INVALID_VALUE',
        encoded: 'INVALID_ENCODED_VALUE'
    },
    {
        type: 'INVALID_TYPE',
        value: '12',
        encoded: 'INVALID_ENCODED_VALUE'
    }
];

export {
    event1,
    event2,
    event3,
    event4,
    event5,
    event6,
    function1,
    function2,
    function2SimpleParametersData,
    encodedDecodedValues,
    encodedDecodedInvalidValues
};
