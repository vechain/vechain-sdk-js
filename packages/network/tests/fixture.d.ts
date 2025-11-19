import { ProviderInternalBaseWallet, type SignTransactionOptions } from '../src';
import { SimpleHttpClient } from '../src/http';
import { type ThorSoloAccount, type ConfigData } from '@vechain/sdk-solo-setup';
/**
 * Main network instance fixture
 */
declare const mainNetwork: SimpleHttpClient;
/**
 * Network instance fixture
 */
declare const testNetwork: SimpleHttpClient;
/**
 * Simple test account fixture
 */
declare const testAccount = "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa";
/**
 * Zero address fixture
 */
declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const configData: ConfigData;
declare const getUnusedAccount: () => ThorSoloAccount;
declare const getAllUsedAccounts: () => ThorSoloAccount[];
declare const getUnusedBaseWallet: () => ProviderInternalBaseWallet;
declare const getUnusedBaseWalletWithGasPayer: (gasPayer: SignTransactionOptions) => ProviderInternalBaseWallet;
/**
 * Delegate url fixture to test signing transactions with delegation by URL
 */
declare const TESTNET_DELEGATE_URL = "https://sponsor-testnet.vechain.energy/by/883";
/**
 * Test accounts fixture
 */
declare const TEST_ACCOUNTS: {
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
};
declare const SOLO_GENESIS_ACCOUNTS: {
    TRANSACTION: {
        TRANSACTION_SENDER: ThorSoloAccount;
        TRANSACTION_RECEIVER: ThorSoloAccount;
        GAS_PAYER: ThorSoloAccount;
    };
};
/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
declare const TESTING_CONTRACT_ADDRESS: string;
/**
 * `TestingContract.sol` contract bytecode on Solo Network
 */
declare const TESTING_CONTRACT_BYTECODE: string;
/**
 * ABI of the `TestingContract` smart contract.
 */
declare const TESTING_CONTRACT_ABI: any[];
export { mainNetwork, testAccount, TESTNET_DELEGATE_URL, testNetwork, ZERO_ADDRESS, getUnusedAccount, getAllUsedAccounts, getUnusedBaseWallet, getUnusedBaseWalletWithGasPayer, TEST_ACCOUNTS, SOLO_GENESIS_ACCOUNTS, TESTING_CONTRACT_ADDRESS, TESTING_CONTRACT_BYTECODE, TESTING_CONTRACT_ABI };
//# sourceMappingURL=fixture.d.ts.map