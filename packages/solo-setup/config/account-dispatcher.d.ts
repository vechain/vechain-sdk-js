import { ThorSoloAccount } from './accounts';
export declare class AccountDispatcher {
    private static instance;
    nextAddressToDispatch: number;
    private constructor();
    static getInstance(): AccountDispatcher;
    getNextAccount(): ThorSoloAccount;
    getAllUsedAccounts(): ThorSoloAccount[];
}
export type { ThorSoloAccount };
//# sourceMappingURL=account-dispatcher.d.ts.map