import { Hex } from '@vcdm';
import { Secp256k1 } from '@secp256k1';
import {
    AccountDispatcher,
    type ThorSoloAccount
} from '@vechain/sdk-solo-setup';

/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = (): string => {
    return Hex.of(Secp256k1.randomBytes(20)).toString();
};

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

export { generateRandomValidAddress, getUnusedAccount, TEST_ACCOUNTS };
