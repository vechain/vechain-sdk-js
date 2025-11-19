import { type SignTransactionOptions } from '../../../../thor-client';
import { ProviderInternalBaseWallet } from '../base-wallet';
declare class ProviderInternalHDWallet extends ProviderInternalBaseWallet {
    /**
     * Mnemonic of the wallet.
     */
    readonly mnemonic: string[];
    /**
     * Derivation path of the wallet.
     */
    readonly derivationPath: string;
    /**
     * Number of accounts to generate.
     */
    readonly count: number;
    /**
     * Initial index of the accounts to generate.
     */
    readonly initialIndex: number;
    /**
     * Create a new HD wallet.
     *
     * @param mnemonic - Mnemonic of the wallet as an array of words.
     * @param count - Number of accounts to generate.
     * @param initialIndex - Initial index of the accounts to generate.
     * @param derivationPath - Derivation path of the wallet.
     * @param options - Options for signing a transaction with gasPayer.
     */
    constructor(mnemonic: string[], count?: number, initialIndex?: number, derivationPath?: string, options?: {
        gasPayer?: SignTransactionOptions;
    });
}
export { ProviderInternalHDWallet };
//# sourceMappingURL=provider-internal-hd-wallet.d.ts.map