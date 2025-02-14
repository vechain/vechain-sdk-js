import { ERC20_ABI, HexUInt, Mnemonic, VTHO_ADDRESS } from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    THOR_SOLO_ACCOUNTS,
    type ThorClient,
    type TransactionReceipt,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '@vechain/sdk-network';

const timeout = 8000; // 8 seconds

/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const TESTING_CONTRACT_ADDRESS: string =
    '0xb2c20a6de401003a671659b10629eb82ff254fb8';

/**
 * ABI of the `TestingContract` smart contract.
 */
const TESTING_CONTRACT_ABI = [
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
                internalType: 'bytes',
                name: '_data',
                type: 'bytes'
            }
        ],
        name: 'calculateBlake2b256',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
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
                internalType: 'uint256',
                name: 'blockNum',
                type: 'uint256'
            }
        ],
        name: 'getBlockID',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'blockNum',
                type: 'uint256'
            }
        ],
        name: 'getBlockSigner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'blockNum',
                type: 'uint256'
            }
        ],
        name: 'getBlockTime',
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
                internalType: 'uint256',
                name: 'blockNum',
                type: 'uint256'
            }
        ],
        name: 'getBlockTotalScore',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getTotalSupply',
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
        inputs: [],
        name: 'getTxBlockRef',
        outputs: [
            {
                internalType: 'bytes8',
                name: '',
                type: 'bytes8'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getTxExpiration',
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
        inputs: [],
        name: 'getTxID',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getTxProvedWork',
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
] as const;

// This is private for EIP-712 unit test case only. Dummy address.
const EIP712_CONTRACT = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC';

// This is private for EIP-712 unit test case only. Dummy address.
const EIP712_FROM = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';

// This is private for EIP-712 unit test case only. Dummy address.
const EIP712_TO = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';

/**
 * SignTransaction test cases
 * Has both correct and incorrect for solo and an example of using gasPayerServiceUrl on testnet
 */
const signTransactionTestCases = {
    solo: {
        /**
         * Correct test cases
         */
        correct: [
            {
                description: 'Should sign a transaction without delegation',
                isDelegated: false,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57491,
                        gasPriceCoef: 0
                    }
                }
            },
            {
                description:
                    'Should sign a transaction with private key delegation',
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 246,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57491,
                        gasPriceCoef: 0,
                        reserved: {
                            features: 1
                        }
                    }
                }
            }
        ]
    },
    testnet: {
        correct: [
            {
                description: 'Should sign a transaction with delegation url',
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: 39,
                        clauses: [
                            {
                                data: '0xb6b55f25000000000000000000000000000000000000000000000000000000000000007b',
                                to: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 21464,
                        gasPriceCoef: 0,
                        reserved: {
                            features: 1
                        }
                    }
                }
            }
        ]
    }
};

const fundVTHO = async (
    thorClient: ThorClient,
    receiverAddress: string
): Promise<void> => {
    const signer = new VeChainPrivateKeySigner(
        HexUInt.of(THOR_SOLO_ACCOUNTS[0].privateKey).bytes,
        new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([]),
            false
        )
    );
    // Load the ERC20 contract
    const contract = thorClient.contracts.load(VTHO_ADDRESS, ERC20_ABI, signer);

    const expectedVTHO = 200000000000000000000n;

    // Execute a 'transfer' transaction on the deployed contract,
    // transferring a specified amount of tokens
    const transferResult = await contract.transact.transfer(
        { value: 0, comment: 'Transferring tokens' },
        receiverAddress,
        expectedVTHO
    );

    // Wait for the transfer transaction to complete and obtain its receipt
    const transactionReceiptTransfer =
        (await transferResult.wait()) as TransactionReceipt;

    // Verify that the transfer transaction did not revert
    expect(transactionReceiptTransfer.reverted).toBe(false);

    // Execute a 'balanceOf' call on the contract to check the balance of the receiver
    const balanceOfResult = await contract.read.balanceOf(receiverAddress);
    expect(balanceOfResult).toStrictEqual([expectedVTHO]);
};

/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
const TESTNET_DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/705';

const FEE_DELEGATION_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'addAllowedRecipientFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '_title',
                type: 'bytes32'
            }
        ],
        name: 'mintSponsorship',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'addAllowedSenderFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'addMaintainerFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'signerOf',
        outputs: [
            {
                internalType: 'address',
                name: 'signer',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'contractOf',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'ownerOf',
        outputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32[]',
                name: '_keys',
                type: 'bytes32[]'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'getDataFor',
        outputs: [
            {
                internalType: 'bytes32[]',
                name: '_values',
                type: 'bytes32[]'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256'
            }
        ],
        name: 'requestWithdrawBalanceFor',
        outputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'maintainersFor',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'allowedRecipientsFor',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'allowedSendersFor',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'removeAllowedRecipientFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'removeAllowedSenderFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'removeMaintainerFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'maintainersFor',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'setContractFor',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256'
            }
        ],
        name: 'contractOf',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

const FEE_DELEGATION_ADDRESS = '0x0bc7cc67d618a9b5054183faa3b58a25bd5bb928';

const FEE_DELEGATION_PRIVATE_KEY = Mnemonic.toPrivateKey(
    'tone life garage donkey panic female night scout cram chair fade fork'.split(
        ' '
    )
);

const addAddressToFeeDelegationWhitelist = async (
    thorClient: ThorClient,
    address: string
): Promise<void> => {
    const signer = new VeChainPrivateKeySigner(
        FEE_DELEGATION_PRIVATE_KEY,
        new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([]),
            false
        )
    );
    // Load the FeeDelegation contract
    const contract = thorClient.contracts.load(
        FEE_DELEGATION_ADDRESS,
        FEE_DELEGATION_ABI,
        signer
    );

    // Execute a 'addAllowedSenderFor' transaction on the loaded contract
    const whitelistResult = await contract.transact.addAllowedSenderFor(
        address,
        705n
    );

    // Wait for the transfer transaction to complete and obtain its receipt
    const whitelistTransactionReceipt =
        (await whitelistResult.wait()) as TransactionReceipt;

    // Verify that the transfer transaction did not revert
    expect(whitelistTransactionReceipt.reverted).toBe(false);

    const [[contractAddress]] = (await contract.read.allowedRecipientsFor(
        705n
    )) as readonly [ReadonlyArray<`0x${string}`>];

    if (
        contractAddress !== undefined &&
        contractAddress.toLowerCase() === TESTING_CONTRACT_ADDRESS
    ) {
        console.log(
            `Contract address ${contractAddress} is already an allowed recipient for`
        );
        return;
    }

    // Execute a 'addAllowedRecipientFor' transaction on the loaded contract
    const whitelistRecipientResult =
        await contract.transact.addAllowedRecipientFor(
            TESTING_CONTRACT_ADDRESS,
            705n
        );

    // Wait for the transfer transaction to complete and obtain its receipt
    const whitelistRecipientTransactionReceipt =
        (await whitelistRecipientResult.wait()) as TransactionReceipt;

    // Verify that the transfer transaction did not revert
    expect(whitelistRecipientTransactionReceipt.reverted).toBe(false);
};

const removeAddressFromFeeDelegationWhitelist = async (
    thorClient: ThorClient,
    address: string
): Promise<void> => {
    const signer = new VeChainPrivateKeySigner(
        FEE_DELEGATION_PRIVATE_KEY,
        new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([]),
            false
        )
    );
    // Load the FeeDelegation contract
    const contract = thorClient.contracts.load(
        FEE_DELEGATION_ADDRESS,
        FEE_DELEGATION_ABI,
        signer
    );

    // Execute a 'removeAllowedSenderFor' transaction on the loaded contract
    const whitelistResult = await contract.transact.removeAllowedSenderFor(
        address,
        705n
    );

    // Wait for the transfer transaction to complete and obtain its receipt
    const whitelistTransactionReceipt =
        (await whitelistResult.wait()) as TransactionReceipt;

    // Verify that the transfer transaction did not revert
    expect(whitelistTransactionReceipt.reverted).toBe(false);

    // Execute a 'addAllowedRecipientFor' transaction on the loaded contract
    const whitelistRecipientResult =
        await contract.transact.removeAllowedRecipientFor(
            TESTING_CONTRACT_ADDRESS,
            705n
        );

    // Wait for the transfer transaction to complete and obtain its receipt
    const whitelistRecipientTransactionReceipt =
        (await whitelistRecipientResult.wait()) as TransactionReceipt;

    // Verify that the transfer transaction did not revert
    expect(whitelistRecipientTransactionReceipt.reverted).toBe(false);
};

export {
    addAddressToFeeDelegationWhitelist,
    EIP712_CONTRACT,
    EIP712_FROM,
    EIP712_TO,
    fundVTHO,
    removeAddressFromFeeDelegationWhitelist,
    signTransactionTestCases,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    TESTNET_DELEGATE_URL,
    timeout
};
