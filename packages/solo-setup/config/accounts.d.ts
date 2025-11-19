/**
 * Seeded Thor solo accounts for testing purposes.
 * Every account has 10000 VET and 10000 VTHO.
 */
declare const THOR_SOLO_ACCOUNTS_TO_SEED: Array<{
    privateKey: string;
    address: string;
}>;
declare const THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS: Array<{
    privateKey: string;
    address: string;
}>;
/**
 * Interface representing a Thor solo account
 */
interface ThorSoloAccount {
    privateKey: string;
    address: string;
}
/**
 * Combined array of all available accounts
 */
declare const ALL_ACCOUNTS: {
    privateKey: string;
    address: string;
}[];
export { THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS, THOR_SOLO_ACCOUNTS_TO_SEED, ALL_ACCOUNTS, type ThorSoloAccount };
//# sourceMappingURL=accounts.d.ts.map