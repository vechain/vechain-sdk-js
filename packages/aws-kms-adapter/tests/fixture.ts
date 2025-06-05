import { ERC20_ABI, HexUInt, Mnemonic, VTHO_ADDRESS } from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    type ThorClient,
    type TransactionReceipt,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '@vechain/sdk-network';
import {
    getConfigData,
    AccountDispatcher,
    type ThorSoloAccount
} from '@vechain/sdk-solo-setup';

const accountDispatcher = AccountDispatcher.getInstance();

const getUnusedAccount = (): ThorSoloAccount => {
    return accountDispatcher.getNextAccount();
};

const timeout = 8000; // 8 seconds

const configData = getConfigData();

/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const SOLO_CONTRACT_ADDRESS: string = configData.TESTING_CONTRACT_ADDRESS;
const TESTNET_CONTRACT_ADDRESS: string =
    '0xb2c20a6de401003a671659b10629eb82ff254fb8';
const TESTING_CONTRACT_ABI = configData.TESTING_CONTRACT_ABI;

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
                        gas: 57175
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
        HexUInt.of(getUnusedAccount().privateKey).bytes,
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
const TESTNET_DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/883';

export {
    fundVTHO,
    signTransactionTestCases,
    TESTING_CONTRACT_ABI,
    SOLO_CONTRACT_ADDRESS,
    TESTNET_CONTRACT_ADDRESS,
    TESTNET_DELEGATE_URL,
    timeout
};
