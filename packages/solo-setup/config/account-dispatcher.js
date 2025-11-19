"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDispatcher = void 0;
const accounts_1 = require("./accounts");
// Export the class directly rather than through a named export
class AccountDispatcher {
    static instance;
    nextAddressToDispatch = 0;
    constructor() { }
    static getInstance() {
        if (!AccountDispatcher.instance) {
            AccountDispatcher.instance = new AccountDispatcher();
        }
        return AccountDispatcher.instance;
    }
    getNextAccount() {
        if (this.nextAddressToDispatch >= accounts_1.ALL_ACCOUNTS.length) {
            throw new Error('No more accounts available');
        }
        const account = accounts_1.ALL_ACCOUNTS[this.nextAddressToDispatch];
        this.nextAddressToDispatch++;
        return account;
    }
    getAllUsedAccounts() {
        return accounts_1.ALL_ACCOUNTS.slice(0, this.nextAddressToDispatch);
    }
}
exports.AccountDispatcher = AccountDispatcher;
