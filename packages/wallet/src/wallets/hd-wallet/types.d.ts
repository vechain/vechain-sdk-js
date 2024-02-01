interface HDWallet extends Wallet {
    /**
     * Mnemonic of the wallet.
     */
    mnemonic: string[];

    /**
     * Derivation path of the wallet.
     */
    derivationPath: string;

    /**
     * ----- TEMPORARY COMMENT -----
     * Here we can add all useful methods for HDWallet.
     * This CURRENTLY is only an example.
     * -----------------------------
     */
    // ... e.g. fromMnemonic
}

export { type HDWallet };
