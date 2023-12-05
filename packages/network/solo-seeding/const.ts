/**
 * ABI of the `TestingContract` smart contract.
 */
const TESTING_CONTRACT_ABI = JSON.stringify([
    {
        inputs: [
            {
                internalType: 'string',
                name: 'message',
                type: 'string'
            }
        ],
        name: 'CustomError',
        type: 'error'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'newValue',
                type: 'uint256'
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'oldValue',
                type: 'uint256'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256'
            }
        ],
        name: 'StateChanged',
        type: 'event'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_addressData',
                type: 'address'
            }
        ],
        name: 'addressData',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balances',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: '_boolData',
                type: 'bool'
            }
        ],
        name: 'boolData',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '_byteData',
                type: 'bytes32'
            }
        ],
        name: 'bytes32Data',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256[]',
                name: '_dynamicArrayData',
                type: 'uint256[]'
            }
        ],
        name: 'dynamicArrayData',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'enum TestingContract.ExampleEnum',
                name: '_enumData',
                type: 'uint8'
            }
        ],
        name: 'enumData',
        outputs: [
            {
                internalType: 'enum TestingContract.ExampleEnum',
                name: '',
                type: 'uint8'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256[3]',
                name: '_fixedArrayData',
                type: 'uint256[3]'
            }
        ],
        name: 'fixedArrayData',
        outputs: [
            {
                internalType: 'uint256[3]',
                name: '',
                type: 'uint256[3]'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            }
        ],
        name: 'getBalance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'int256',
                name: '_intData',
                type: 'int256'
            }
        ],
        name: 'intData',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_uintData',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_addressData',
                type: 'address'
            },
            {
                internalType: 'bytes32',
                name: '_byteData',
                type: 'bytes32'
            },
            {
                internalType: 'string',
                name: '_stringData',
                type: 'string'
            },
            {
                internalType: 'uint256[3]',
                name: '_fixedArrayData',
                type: 'uint256[3]'
            },
            {
                internalType: 'uint256[]',
                name: '_dynamicArrayData',
                type: 'uint256[]'
            },
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string'
                    }
                ],
                internalType: 'struct TestingContract.ExampleStruct',
                name: '_structData',
                type: 'tuple'
            },
            {
                internalType: 'enum TestingContract.ExampleEnum',
                name: '_enumData',
                type: 'uint8'
            }
        ],
        name: 'multipleData',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            },
            {
                internalType: 'string',
                name: '',
                type: 'string'
            },
            {
                internalType: 'uint256[3]',
                name: '',
                type: 'uint256[3]'
            },
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]'
            },
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string'
                    }
                ],
                internalType: 'struct TestingContract.ExampleStruct',
                name: '',
                type: 'tuple'
            },
            {
                internalType: 'enum TestingContract.ExampleEnum',
                name: '',
                type: 'uint8'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint8',
                name: '_uint8Data',
                type: 'uint8'
            },
            {
                internalType: 'uint16',
                name: '_uint16Data',
                type: 'uint16'
            },
            {
                internalType: 'uint32',
                name: '_uint32Data',
                type: 'uint32'
            },
            {
                internalType: 'uint64',
                name: '_uint64Data',
                type: 'uint64'
            },
            {
                internalType: 'uint160',
                name: '_uint160Data',
                type: 'uint160'
            },
            {
                internalType: 'uint256',
                name: '_uint256Data',
                type: 'uint256'
            }
        ],
        name: 'multipleIntData',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8'
            },
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16'
            },
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32'
            },
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64'
            },
            {
                internalType: 'uint160',
                name: '',
                type: 'uint160'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_newValue',
                type: 'uint256'
            }
        ],
        name: 'setStateVariable',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'stateVariable',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_stringData',
                type: 'string'
            }
        ],
        name: 'stringData',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string'
                    }
                ],
                internalType: 'struct TestingContract.ExampleStruct',
                name: '_structData',
                type: 'tuple'
            }
        ],
        name: 'structData',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string'
                    }
                ],
                internalType: 'struct TestingContract.ExampleStruct',
                name: '',
                type: 'tuple'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'testAssertError',
        outputs: [],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'testCustomError',
        outputs: [],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [],
        name: 'testInvalidOpcodeError',
        outputs: [],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint8',
                name: '_value',
                type: 'uint8'
            }
        ],
        name: 'testOverflowError',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'testRequireError',
        outputs: [],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'testRevertError',
        outputs: [],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_uintData',
                type: 'uint256'
            }
        ],
        name: 'uintData',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256'
            }
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
]);

export { TESTING_CONTRACT_ABI };
