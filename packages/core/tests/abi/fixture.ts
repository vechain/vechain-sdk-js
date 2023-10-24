import { address } from '../../src';

/**
 * Simple functions fixtures
 */
const functions = [
    {
        objectAbi: {
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
        },
        full: 'function f1(uint256 a1, string a2) returns (address r1, bytes r2)',
        minimal: 'function f1(uint256,string) returns (address,bytes)',
        sighash: 'f1(uint256,string)',
        signatureHash: '0x27fcbb2f',
        jsonStringifiedAbi:
            '{"type":"function","name":"f1","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"a1"},{"type":"string","name":"a2"}],"outputs":[{"type":"address","name":"r1"},{"type":"bytes","name":"r2"}]}',
        encodingTestsInputs: [
            [1n, 'test'],
            [2n, 'test2']
        ]
    },
    {
        objectAbi: {
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
        },
        full: 'function nodes() returns (tuple(address master, address endorsor, bytes32 identity, bool active)[] list)',
        minimal:
            'function nodes() returns (tuple(address,address,bytes32,bool)[])',
        sighash: 'nodes()',
        signatureHash: '0x5db82fa0',
        jsonStringifiedAbi:
            '{"type":"function","name":"nodes","constant":false,"payable":false,"inputs":[],"outputs":[{"type":"tuple[]","name":"list","components":[{"type":"address","name":"master"},{"type":"address","name":"endorsor"},{"type":"bytes32","name":"identity"},{"type":"bool","name":"active"}]}]}',
        encodingTestsInputs: [[]]
    }
];

/**
 * Simple parameters for function 2 (functions[1]) fixture.
 * Used to test encoding and decoding of multiple parameters in encode/decode abi tests.
 */
const simpleParametersDataForFunction2 = [
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
 * Simple events fixtures
 */
const events = [
    {
        objectAbi: {
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
        },
        full: 'event E1(uint256 indexed a1, string a2)',
        minimal: 'event E1(uint256 indexed,string)',
        sighash: 'E1(uint256,string)',
        signatureHash:
            '0x47b78f0ec63d97830ace2babb45e6271b15a678528e901a9651e45b65105e6c2',
        jsonStringifiedAbi:
            '{"type":"event","anonymous":false,"name":"E1","inputs":[{"type":"uint256","name":"a1","indexed":true},{"type":"string","name":"a2","indexed":false}]}',
        encodingTestsInputs: [
            [1n, 'test'],
            [2n, 'test2']
        ]
    },
    {
        objectAbi: {
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
            name: 'E2',
            type: 'event'
        },
        full: 'event E2(uint256 indexed a1, string a2)',
        minimal: 'event E2(uint256 indexed,string)',
        sighash: 'E2(uint256,string)',
        signatureHash:
            '0xed4f58f68ac84ec75a04444d287e454e22772efca5f47aca53950d7a135e6dab',
        jsonStringifiedAbi:
            '{"type":"event","anonymous":false,"name":"E2","inputs":[{"type":"uint256","name":"a1","indexed":true},{"type":"string","name":"a2","indexed":false}]}',
        encodingTestsInputs: [
            [1n, 'test'],
            [2n, 'test2']
        ]
    }
];

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
    events,
    functions,
    simpleParametersDataForFunction2,
    encodedDecodedValues,
    encodedDecodedInvalidValues
};
