import { ALL_ACCOUNTS } from './accounts';
import { ThorSoloAccount } from './accounts';

class AccountDispatcher {
    nextAddressToDispatch: number = 0;

    constructor() {}

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

export {
    // Re-exporting the ThorSoloAccount type for it to be used in the tests
    type ThorSoloAccount,
    AccountDispatcher
};
