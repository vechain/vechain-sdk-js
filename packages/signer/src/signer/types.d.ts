import { type vechain_sdk_core_ethers } from '../../../core/src';

/**
 * A signer for vechain, adding specific methods for vechain to the ethers signer
 */
interface VechainSigner extends vechain_sdk_core_ethers.Signer {
    /**
     * Sign a transaction with the delegator
     * @returns the fully signed transaction
     */
    signWithDelegator: () => Promise<string>;
}

export type { VechainSigner };
