import {
    AccountDispatcher,
    type ThorSoloAccount
} from '@vechain/sdk-solo-setup';

const dispatcher = AccountDispatcher.getInstance();
const getUnusedAccount = (): ThorSoloAccount => dispatcher.getNextAccount();

/**
 * Test accounts fixture
 */
const TEST_ACCOUNTS: {
    TRANSACTION: {
        TRANSACTION_SENDER: ThorSoloAccount;
        TRANSACTION_RECEIVER: ThorSoloAccount;
    };
} = {
    /**
     * Accounts dedicated for testing transaction related operations.
     */
    TRANSACTION: {
        TRANSACTION_SENDER: getUnusedAccount(),
        TRANSACTION_RECEIVER: getUnusedAccount()
    }
};

export { getUnusedAccount, TEST_ACCOUNTS };
