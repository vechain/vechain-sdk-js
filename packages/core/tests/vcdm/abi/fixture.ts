import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';
import { Address, HexUInt } from '../../../src';
import { Hex } from '../../../src/vcdm/Hex';
import { generateRandomValidAddress } from '../../fixture';

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
        full: 'function nodes() returns ((address master, address endorsor, bytes32 identity, bool active)[])',
        minimal: 'function nodes() returns ((address,address,bytes32,bool)[])',
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
        master: Address.checksum(
            HexUInt.of('0x0e8fd586e022f825a109848832d7e552132bc332')
        ),
        endorsor: Address.checksum(
            HexUInt.of('0x224626926a7a12225a60e127cec119c939db4a5c')
        ),
        identity:
            '0xdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c',
        active: false
    },
    {
        master: Address.checksum(
            HexUInt.of('0x4977d68df97bb313b23238520580d8d3a59939bf')
        ),
        endorsor: Address.checksum(
            HexUInt.of('0x7ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff')
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
 * `from` random valid address
 */
const fromRandomAddress = generateRandomValidAddress();

/**
 * `to` random valid address
 */
const toRandomAddress = generateRandomValidAddress();

/**
 * `value` random BigInt
 */
// eslint-disable-next-line sonarjs/pseudo-random
const randomBigInt = BigInt(Math.floor(Math.random() * 1000));

/**
 * Event test cases for encoding topics
 */
const topicsEventTestCases = [
    {
        event: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'from',
                    type: 'address'
                },
                {
                    indexed: true,
                    name: 'to',
                    type: 'address'
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256'
                }
            ],
            name: 'Transfer',
            type: 'event'
        },
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`,
            `0x000000000000000000000000${toRandomAddress.slice(2)}`
        ]
    },
    {
        event: 'event Transfer(address indexed, address indexed, uint256)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`,
            `0x000000000000000000000000${toRandomAddress.slice(2)}`
        ]
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`,
            `0x000000000000000000000000${toRandomAddress.slice(2)}`
        ]
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [fromRandomAddress], // Missing `to` parameter
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`, // Should return only signature and topic1
            undefined // This the indexed address `to`
        ]
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [], // Missing `from` and `to` parameters
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Should return only signature
        ]
    },
    {
        event: 'event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        expectedTopics: [
            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`,
            `0x000000000000000000000000${toRandomAddress.slice(2)}`
        ]
    },
    {
        event: 'event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)',
        valuesToEncode: [], // Missing `from` and `to` parameters
        expectedTopics: [
            '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822' // Should return only signature
        ]
    },
    {
        event: 'event Approval(address indexed owner, address indexed spender, uint256 value)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        expectedTopics: [
            '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`,
            `0x000000000000000000000000${toRandomAddress.slice(2)}`
        ]
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        valuesToEncode: [fromRandomAddress, toRandomAddress, randomBigInt],
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            `0x000000000000000000000000${fromRandomAddress.slice(2)}`,
            `0x000000000000000000000000${toRandomAddress.slice(2)}`,
            Hex.of(randomBigInt).fit(64).toString()
        ]
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        valuesToEncode: [null, null, randomBigInt],
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            undefined,
            undefined,
            Hex.of(randomBigInt).fit(64).toString()
        ]
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        valuesToEncode: [undefined, undefined, randomBigInt],
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            undefined,
            undefined,
            Hex.of(randomBigInt).fit(64).toString()
        ]
    },
    {
        event: 'event Transfer(address from, address to, uint256 tokenId)', // Event without any indexed params
        valuesToEncode: [fromRandomAddress, toRandomAddress, randomBigInt], // Even with specified values for indexed params, should return only signature because there are no indexed params in the event
        expectedTopics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        ]
    },
    {
        event: {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256'
                },
                {
                    indexed: true,
                    internalType: 'bytes32',
                    name: 'appId',
                    type: 'bytes32'
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'receiver',
                    type: 'address'
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'proof',
                    type: 'string'
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'distributor',
                    type: 'address'
                }
            ],
            name: 'RewardDistributed',
            type: 'event'
        },
        valuesToEncode: {
            appId: '0x6c977a18d427360e27c3fc2129a6942acd4ece2c8aaeaf4690034931dc5ba7f9' // EVEarn
        },
        expectedTopics: [
            '0x4811710b0c25cc7e05baf214b3a939cf893f1cbff4d0b219e680f069a4f204a2',
            '0x6c977a18d427360e27c3fc2129a6942acd4ece2c8aaeaf4690034931dc5ba7f9',
            undefined,
            undefined
        ]
    }
];

/**
 * Invalid topics event test cases
 */
const invalidTopicsEventTestCases = [
    {
        event: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'from',
                    type: 'address'
                },
                {
                    indexed: true,
                    name: 'to',
                    type: 'address'
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256'
                }
            ],
            name: 'Transfer',
            type: 'event'
        },
        valuesToEncode: [
            // Too many parameters
            fromRandomAddress,
            toRandomAddress,
            fromRandomAddress,
            toRandomAddress
        ],
        expectedError: InvalidAbiDataToEncodeOrDecode
    },
    {
        event: {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256'
                },
                {
                    indexed: true,
                    internalType: 'bytes32',
                    name: 'appId',
                    type: 'bytes32'
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'receiver',
                    type: 'address'
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'proof',
                    type: 'string'
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'distributor',
                    type: 'address'
                }
            ],
            name: 'RewardDistributed',
            type: 'event'
        },
        valuesToEncode: [
            // Wrong parameters
            fromRandomAddress,
            toRandomAddress,
            fromRandomAddress,
            toRandomAddress,
            fromRandomAddress
        ],
        expectedError: InvalidAbiDataToEncodeOrDecode
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

const contractABI = [
    {
        constant: false,
        inputs: [
            {
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'setValue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getValue',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
] as const;

const contractABIWithEvents = [
    {
        constant: false,
        inputs: [
            {
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'setValue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getValue',
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
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'sender',
                type: 'address'
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'ValueChanged',
        type: 'event'
    }
] as const;

const contractStorageABI = [
    {
        inputs: [],
        name: 'getValue',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_value',
                type: 'string'
            }
        ],
        name: 'setValue',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;

export const encodedParams =
    '0x000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000ea';

// Event data
const ValueChangedEventData = {
    sender: '0x1234567890123456789012345678901234567890', // Replace with the actual address
    value: 100 // Replace with the actual balance value
};

interface ExpectedERC721TransferEventType {
    eventName: 'Transfer';
    args: {
        from: `0x${string}`;
        to: `0x${string}`;
        tokenId: bigint;
    };
}

interface ExpectedCustomFunctionType {
    args: readonly [bigint];
    functionName: 'setValue';
}

export {
    contractABI,
    contractABIWithEvents,
    contractStorageABI,
    encodedDecodedInvalidValues,
    encodedDecodedValues,
    events,
    functions,
    invalidTopicsEventTestCases,
    simpleParametersDataForFunction2,
    topicsEventTestCases,
    ValueChangedEventData,
    type ExpectedCustomFunctionType,
    type ExpectedERC721TransferEventType
};
