/**
 * Test account interface
 */
export interface TestAccount {
    privateKey: string;
    address: string;
}
export declare const randomAccount: () => TestAccount;
/**
 * Fund a random account with VET, VTHO and TestToken
 */
export declare const fundRandomAccount: () => Promise<void>;
//# sourceMappingURL=accounts.d.ts.map