import {
    AccountDispatcher,
    type ThorSoloAccount
} from '@vechain/sdk-solo-setup';

const dispatcher = new AccountDispatcher();
const getUnusedAccount = (): ThorSoloAccount => dispatcher.getNextAccount();

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

export { getUnusedAccount, TEST_ACCOUNTS, SOLO_GENESIS_ACCOUNTS };
