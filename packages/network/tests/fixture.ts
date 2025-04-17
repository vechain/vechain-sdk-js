import { HexUInt, Secp256k1 } from '@vechain/sdk-core';
import {
    MAINNET_URL,
    ProviderInternalBaseWallet,
    type SignTransactionOptions
} from '../src';
import { SimpleHttpClient } from '../src/http';
import {
    THOR_SOLO_SEEDED_ACCOUNTS,
    THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS,
    soloConfig
} from '@vechain/sdk-solo-setup';

/**
 * Main network instance fixture
 */
const mainNetwork = new SimpleHttpClient(MAINNET_URL);

/**
 * Zero address fixture
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Test accounts into wallet fixture
 */
const THOR_SOLO_ACCOUNTS_BASE_WALLET: ProviderInternalBaseWallet =
    new ProviderInternalBaseWallet(
        THOR_SOLO_SEEDED_ACCOUNTS.map((account) => ({
            privateKey: HexUInt.of(account.privateKey).bytes,
            publicKey: Secp256k1.derivePublicKey(
                HexUInt.of(account.privateKey).bytes
            ),
            address: account.address
        }))
    );

/**
 * Test accounts into wallet fixture with gasPayer
 */
const THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_GAS_PAYER = (
    gasPayer: SignTransactionOptions
): ProviderInternalBaseWallet =>
    new ProviderInternalBaseWallet(
        THOR_SOLO_SEEDED_ACCOUNTS.map((account) => ({
            privateKey: HexUInt.of(account.privateKey).bytes,
            publicKey: Secp256k1.derivePublicKey(
                HexUInt.of(account.privateKey).bytes
            ),
            address: account.address
        })),
        {
            gasPayer
        }
    );

/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
const TESTNET_DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/299';

/**
 * Test accounts fixture
 */
const TEST_ACCOUNTS = {
    /**
     * Accounts dedicated for testing account related operations.
     */
    ACCOUNT: {
        SIMPLE_ACCOUNT: THOR_SOLO_SEEDED_ACCOUNTS[0]
    },

    /**
     * Accounts dedicated for testing transaction related operations.
     */
    TRANSACTION: {
        TRANSACTION_SENDER: THOR_SOLO_SEEDED_ACCOUNTS[1],
        TRANSACTION_RECEIVER: THOR_SOLO_SEEDED_ACCOUNTS[2],
        GAS_PAYER: THOR_SOLO_SEEDED_ACCOUNTS[3],
        CONTRACT_MANAGER: THOR_SOLO_SEEDED_ACCOUNTS[4]
    },

    /**
     * Accounts dedicated for testing subscription related operations.
     */
    SUBSCRIPTION: {
        EVENT_SUBSCRIPTION: THOR_SOLO_SEEDED_ACCOUNTS[5],
        VET_TRANSFERS_SUBSCRIPTION: THOR_SOLO_SEEDED_ACCOUNTS[6]
    }
};

const SOLO_GENESIS_ACCOUNTS = {
    TRANSACTION: {
        TRANSACTION_SENDER: THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS[0],
        TRANSACTION_RECEIVER: THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS[0],
        GAS_PAYER: THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS[0]
    }
};

/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const TESTING_CONTRACT_ADDRESS: string = soloConfig.TESTING_CONTRACT_ADDRESS;

/**
 * `TestingContract.sol` contract bytecode on Solo Network
 */
const TESTING_CONTRACT_BYTECODE = soloConfig.TESTING_CONTRACT_BYTECODE;

/**
 * ABI of the `TestingContract` smart contract.
 */
const TESTING_CONTRACT_ABI = soloConfig.TESTING_CONTRACT_ABI;

export {
    mainNetwork,
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    TESTING_CONTRACT_BYTECODE,
    TESTNET_DELEGATE_URL,
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_GAS_PAYER,
    ZERO_ADDRESS,
    SOLO_GENESIS_ACCOUNTS
};
