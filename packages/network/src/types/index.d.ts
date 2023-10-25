/** The VeChain Connex interface */
declare interface Connex {
    /** the module for accessing VeChain accounts/blocks/txs/logs etc. */
    readonly thor: Connex.Thor;
    /** the module for interacting with wallets */
    // readonly vendor: Connex.Vendor;
}
