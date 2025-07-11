import { ALL_ACCOUNTS } from './accounts';
import { ThorSoloAccount } from './accounts';

// Export the class directly rather than through a named export
export class AccountDispatcher {
    private static instance: AccountDispatcher;
    nextAddressToDispatch: number = 0;

    private constructor() {}

    public static getInstance(): AccountDispatcher {
        if (!AccountDispatcher.instance) {
            AccountDispatcher.instance = new AccountDispatcher();
        }
        return AccountDispatcher.instance;
    }

    getNextAccount(): ThorSoloAccount {
        if (this.nextAddressToDispatch >= ALL_ACCOUNTS.length) {
            throw new Error('No more accounts available');
        }
        const account = ALL_ACCOUNTS[this.nextAddressToDispatch];
        this.nextAddressToDispatch++;
        return account;
    }

    getAllUsedAccounts(): ThorSoloAccount[] {
        return ALL_ACCOUNTS.slice(0, this.nextAddressToDispatch);
    }
}

// Re-export the ThorSoloAccount type for it to be used in the tests
export type { ThorSoloAccount };
