import { ERC20_ABI, HexUInt, Mnemonic, VTHO_ADDRESS } from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    type ThorClient,
    type TransactionReceipt,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '@vechain/sdk-network';
import { soloConfig, THOR_SOLO_SEEDED_ACCOUNTS } from '@vechain/sdk-solo-setup';

const timeout = 8000; // 8 seconds

/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const SOLO_CONTRACT_ADDRESS: string = soloConfig.TESTING_CONTRACT_ADDRESS;
const TESTNET_CONTRACT_ADDRESS: string =
    '0xb2c20a6de401003a671659b10629eb82ff254fb8';
const TESTING_CONTRACT_ABI = soloConfig.TESTING_CONTRACT_ABI;

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
                                to: SOLO_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57175,
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
                                to: SOLO_CONTRACT_ADDRESS,
                                value: 0
                            }
                        ],
                        dependsOn: null,
                        expiration: 32,
                        gas: 57175,
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
        HexUInt.of(THOR_SOLO_SEEDED_ACCOUNTS[0].privateKey).bytes,
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
        contractAddress.toLowerCase() === TESTNET_CONTRACT_ADDRESS
    ) {
        console.log(
            `Contract address ${contractAddress} is already an allowed recipient for`
        );
        return;
    }

    // Execute a 'addAllowedRecipientFor' transaction on the loaded contract
    const whitelistRecipientResult =
        await contract.transact.addAllowedRecipientFor(
            TESTNET_CONTRACT_ADDRESS,
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
            TESTNET_CONTRACT_ADDRESS,
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
    SOLO_CONTRACT_ADDRESS,
    TESTNET_CONTRACT_ADDRESS,
    TESTNET_DELEGATE_URL,
    timeout
};
