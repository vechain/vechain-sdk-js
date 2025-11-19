"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESTING_CONTRACT_ABI = exports.TESTING_CONTRACT_BYTECODE = exports.TESTING_CONTRACT_ADDRESS = exports.SOLO_GENESIS_ACCOUNTS = exports.TEST_ACCOUNTS = exports.getUnusedBaseWalletWithGasPayer = exports.getUnusedBaseWallet = exports.getAllUsedAccounts = exports.getUnusedAccount = exports.ZERO_ADDRESS = exports.testNetwork = exports.TESTNET_DELEGATE_URL = exports.testAccount = exports.mainNetwork = exports.configData = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../src");
const http_1 = require("../src/http");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
/**
 * Main network instance fixture
 */
const mainNetwork = new http_1.SimpleHttpClient(src_1.MAINNET_URL);
exports.mainNetwork = mainNetwork;
/**
 * Network instance fixture
 */
const testNetwork = new http_1.SimpleHttpClient(src_1.TESTNET_URL);
exports.testNetwork = testNetwork;
/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';
exports.testAccount = testAccount;
/**
 * Zero address fixture
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.ZERO_ADDRESS = ZERO_ADDRESS;
exports.configData = (0, sdk_solo_setup_1.getConfigData)();
const accountDispatcher = sdk_solo_setup_1.AccountDispatcher.getInstance();
const getUnusedAccount = () => {
    return accountDispatcher.getNextAccount();
};
exports.getUnusedAccount = getUnusedAccount;
const getAllUsedAccounts = () => {
    return accountDispatcher.getAllUsedAccounts();
};
exports.getAllUsedAccounts = getAllUsedAccounts;
const getUnusedBaseWallet = () => {
    const account = getUnusedAccount();
    return new src_1.ProviderInternalBaseWallet([
        {
            privateKey: sdk_core_1.HexUInt.of(account.privateKey).bytes,
            publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(account.privateKey).bytes),
            address: account.address
        }
    ]);
};
exports.getUnusedBaseWallet = getUnusedBaseWallet;
const getUnusedBaseWalletWithGasPayer = (gasPayer) => {
    const account = getUnusedAccount();
    return new src_1.ProviderInternalBaseWallet([
        {
            privateKey: sdk_core_1.HexUInt.of(account.privateKey).bytes,
            publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(account.privateKey).bytes),
            address: account.address
        }
    ], {
        gasPayer
    });
};
exports.getUnusedBaseWalletWithGasPayer = getUnusedBaseWalletWithGasPayer;
/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
const TESTNET_DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/883';
exports.TESTNET_DELEGATE_URL = TESTNET_DELEGATE_URL;
/**
 * Test accounts fixture
 */
const TEST_ACCOUNTS = {
    /**
     * Accounts dedicated for testing account related operations.
     */
    ACCOUNT: {
        SIMPLE_ACCOUNT: getUnusedAccount(),
        NOT_MUTATED_BALANCE_ACCOUNT: getUnusedAccount(),
        DEBUG_TRACE_CALL_ACCOUNT: getUnusedAccount(),
        DEBUG_TRACE_TRANSACTION_ACCOUNT: getUnusedAccount()
    },
    /**
     * Accounts dedicated for testing transaction related operations.
     */
    TRANSACTION: {
        TRANSACTION_SENDER: getUnusedAccount(),
        TRANSACTION_RECEIVER: getUnusedAccount(),
        GAS_PAYER: getUnusedAccount(),
        CONTRACT_MANAGER: getUnusedAccount()
    },
    /**
     * Accounts dedicated for testing subscription related operations.
     */
    SUBSCRIPTION: {
        EVENT_SUBSCRIPTION: getUnusedAccount(),
        VET_TRANSFERS_SUBSCRIPTION: getUnusedAccount()
    }
};
exports.TEST_ACCOUNTS = TEST_ACCOUNTS;
const seededAccount = getUnusedAccount();
const SOLO_GENESIS_ACCOUNTS = {
    TRANSACTION: {
        TRANSACTION_SENDER: seededAccount,
        TRANSACTION_RECEIVER: seededAccount,
        GAS_PAYER: seededAccount
    }
};
exports.SOLO_GENESIS_ACCOUNTS = SOLO_GENESIS_ACCOUNTS;
/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const TESTING_CONTRACT_ADDRESS = exports.configData.TESTING_CONTRACT_ADDRESS;
exports.TESTING_CONTRACT_ADDRESS = TESTING_CONTRACT_ADDRESS;
/**
 * `TestingContract.sol` contract bytecode on Solo Network
 */
const TESTING_CONTRACT_BYTECODE = exports.configData.TESTING_CONTRACT_BYTECODE;
exports.TESTING_CONTRACT_BYTECODE = TESTING_CONTRACT_BYTECODE;
/**
 * ABI of the `TestingContract` smart contract.
 */
const TESTING_CONTRACT_ABI = exports.configData.TESTING_CONTRACT_ABI;
exports.TESTING_CONTRACT_ABI = TESTING_CONTRACT_ABI;
