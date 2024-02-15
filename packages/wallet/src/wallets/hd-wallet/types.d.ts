interface HDWallet extends Wallet {
    /**
     * Mnemonic of the wallet.
     */
    mnemonic: string[];

    /**
     * Derivation path of the wallet.
     */
    derivationPath: string;
}

export { type HDWallet };
