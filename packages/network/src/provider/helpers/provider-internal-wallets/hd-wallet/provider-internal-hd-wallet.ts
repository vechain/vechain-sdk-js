import { ProviderInternalBaseWallet } from '../base-wallet';
import {
    addressUtils,
    HDNode,
    secp256k1,
    VET_DERIVATION_PATH
} from '@vechain/sdk-core';
import { type SignTransactionOptions } from '../../../../thor-client';

class ProviderInternalHDWallet extends ProviderInternalBaseWallet {
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
     * @param options - Options for signing a transaction with delegator.
     */
    constructor(
        mnemonic: string[],
        count: number = 1,
        initialIndex: number = 0,
        derivationPath: string = VET_DERIVATION_PATH,
        options?: {
            delegator?: SignTransactionOptions;
        }
    ) {
        // Initialize the base wallet with the generated accounts
        super(
            [...Array(count).keys()].map((path: number) => {
                // Convert the private key to a buffer
                const privateKeyBuffer = HDNode.fromMnemonic(
                    mnemonic,
                    derivationPath
                ).deriveChild(path + initialIndex).privateKey as Buffer;

                // Derive the public key and address from the private key
                return {
                    privateKey: privateKeyBuffer,
                    publicKey: Buffer.from(
                        secp256k1.derivePublicKey(privateKeyBuffer)
                    ),
                    address: addressUtils.fromPrivateKey(privateKeyBuffer)
                };
            }),
            options
        );

        // Set the wallet properties
        this.mnemonic = mnemonic;
        this.derivationPath = derivationPath;
        this.count = count;
        this.initialIndex = initialIndex;
    }
}

export { ProviderInternalHDWallet };
