"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeout = exports.TESTNET_DELEGATE_URL = exports.TESTNET_CONTRACT_ADDRESS = exports.SOLO_CONTRACT_ADDRESS = exports.TESTING_CONTRACT_ABI = exports.signTransactionTestCases = exports.fundVTHO = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_network_1 = require("@vechain/sdk-network");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const accountDispatcher = sdk_solo_setup_1.AccountDispatcher.getInstance();
const getUnusedAccount = () => {
    return accountDispatcher.getNextAccount();
};
const timeout = 8000; // 8 seconds
exports.timeout = timeout;
const configData = (0, sdk_solo_setup_1.getConfigData)();
/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const SOLO_CONTRACT_ADDRESS = configData.TESTING_CONTRACT_ADDRESS;
exports.SOLO_CONTRACT_ADDRESS = SOLO_CONTRACT_ADDRESS;
const TESTNET_CONTRACT_ADDRESS = '0xb2c20a6de401003a671659b10629eb82ff254fb8';
exports.TESTNET_CONTRACT_ADDRESS = TESTNET_CONTRACT_ADDRESS;
const TESTING_CONTRACT_ABI = configData.TESTING_CONTRACT_ABI;
exports.TESTING_CONTRACT_ABI = TESTING_CONTRACT_ABI;
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
                        chainTag: configData.SOLO_CHAIN_TAG,
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
                description: 'Should sign a transaction with private key delegation',
                isDelegated: true,
                expected: {
                    body: {
                        chainTag: configData.SOLO_CHAIN_TAG,
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
exports.signTransactionTestCases = signTransactionTestCases;
const fundVTHO = async (thorClient, receiverAddress) => {
    const signer = new sdk_network_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(getUnusedAccount().privateKey).bytes, new sdk_network_1.VeChainProvider(thorClient, new sdk_network_1.ProviderInternalBaseWallet([]), false));
    // Load the ERC20 contract
    const contract = thorClient.contracts.load(sdk_core_1.VTHO_ADDRESS, sdk_core_1.ERC20_ABI, signer);
    const expectedVTHO = 200000000000000000000n;
    // Execute a 'transfer' transaction on the deployed contract,
    // transferring a specified amount of tokens
    const transferResult = await contract.transact.transfer({ value: 0, comment: 'Transferring tokens' }, receiverAddress, expectedVTHO);
    // Wait for the transfer transaction to complete and obtain its receipt
    const transactionReceiptTransfer = (await transferResult.wait());
    // Verify that the transfer transaction did not revert
    expect(transactionReceiptTransfer.reverted).toBe(false);
    // Execute a 'balanceOf' call on the contract to check the balance of the receiver
    const balanceOfResult = await contract.read.balanceOf(receiverAddress);
    expect(balanceOfResult).toStrictEqual([expectedVTHO]);
};
exports.fundVTHO = fundVTHO;
/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
const TESTNET_DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/883';
exports.TESTNET_DELEGATE_URL = TESTNET_DELEGATE_URL;
