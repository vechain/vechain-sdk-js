import { HexUInt, Secp256k1 } from '@vechain/sdk-core';
import {
    MAINNET_URL,
    ProviderInternalBaseWallet,
    type SignTransactionOptions,
    TESTNET_URL
} from '../src';
import { SimpleHttpClient } from '../src/http';
import {
    AccountDispatcher,
    getConfigData,
    type ThorSoloAccount,
    type ConfigData
} from '@vechain/sdk-solo-setup';

/**
 * Main network instance fixture
 */
const mainNetwork = new SimpleHttpClient(MAINNET_URL);

/**
 * Network instance fixture
 */
const testNetwork = new SimpleHttpClient(TESTNET_URL);

/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

/**
 * Zero address fixture
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const configData: ConfigData = getConfigData();

const accountDispatcher = AccountDispatcher.getInstance();

const getUnusedAccount = (): ThorSoloAccount => {
    return accountDispatcher.getNextAccount();
};

const getAllUsedAccounts = (): ThorSoloAccount[] => {
    return accountDispatcher.getAllUsedAccounts();
};

const getUnusedBaseWallet = (): ProviderInternalBaseWallet => {
    const account = getUnusedAccount();
    return new ProviderInternalBaseWallet([
        {
            privateKey: HexUInt.of(account.privateKey).bytes,
            publicKey: Secp256k1.derivePublicKey(
                HexUInt.of(account.privateKey).bytes
            ),
            address: account.address
        }
    ]);
};

const getUnusedBaseWalletWithGasPayer = (
    gasPayer: SignTransactionOptions
): ProviderInternalBaseWallet => {
    const account = getUnusedAccount();
    return new ProviderInternalBaseWallet(
        [
            {
                privateKey: HexUInt.of(account.privateKey).bytes,
                publicKey: Secp256k1.derivePublicKey(
                    HexUInt.of(account.privateKey).bytes
                ),
                address: account.address
            }
        ],
        {
            gasPayer
        }
    );
};

/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
const TESTNET_DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/883';

/**
 * Test accounts fixture
 */
const TEST_ACCOUNTS: {
    ACCOUNT: {
        SIMPLE_ACCOUNT: ThorSoloAccount;
        NOT_MUTATED_BALANCE_ACCOUNT: ThorSoloAccount;
        DEBUG_TRACE_CALL_ACCOUNT: ThorSoloAccount;
        DEBUG_TRACE_TRANSACTION_ACCOUNT: ThorSoloAccount;
    };
    TRANSACTION: {
        TRANSACTION_SENDER: ThorSoloAccount;
        TRANSACTION_RECEIVER: ThorSoloAccount;
        GAS_PAYER: ThorSoloAccount;
        CONTRACT_MANAGER: ThorSoloAccount;
    };
    SUBSCRIPTION: {
        EVENT_SUBSCRIPTION: ThorSoloAccount;
        VET_TRANSFERS_SUBSCRIPTION: ThorSoloAccount;
    };
} = {
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

const seededAccount = getUnusedAccount();

const SOLO_GENESIS_ACCOUNTS: {
    TRANSACTION: {
        TRANSACTION_SENDER: ThorSoloAccount;
        TRANSACTION_RECEIVER: ThorSoloAccount;
        GAS_PAYER: ThorSoloAccount;
    };
} = {
    TRANSACTION: {
        TRANSACTION_SENDER: seededAccount,
        TRANSACTION_RECEIVER: seededAccount,
        GAS_PAYER: seededAccount
    }
};

/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const TESTING_CONTRACT_ADDRESS: string = configData.TESTING_CONTRACT_ADDRESS;

/**
 * `TestingContract.sol` contract bytecode on Solo Network
 */
const TESTING_CONTRACT_BYTECODE = configData.TESTING_CONTRACT_BYTECODE;

/**
 * ABI of the `TestingContract` smart contract.
 */
const TESTING_CONTRACT_ABI = configData.TESTING_CONTRACT_ABI;

export {
    mainNetwork,
    testAccount,
    TESTNET_DELEGATE_URL,
    testNetwork,
    ZERO_ADDRESS,
    getUnusedAccount,
    getAllUsedAccounts,
    getUnusedBaseWallet,
    getUnusedBaseWalletWithGasPayer,
    TEST_ACCOUNTS,
    SOLO_GENESIS_ACCOUNTS,
    TESTING_CONTRACT_ADDRESS,
    TESTING_CONTRACT_BYTECODE,
    TESTING_CONTRACT_ABI
};
