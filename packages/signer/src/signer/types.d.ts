import { type vechain_sdk_core_ethers } from '../../../core/src';

/**
 * A signer for vechain, adding specific methods for vechain to the ethers signer
 */
interface VechainSigner extends vechain_sdk_core_ethers.Signer {
    // The delegator attached to this Signer
    delegator: Delegator;

    /**
     * Sign a transaction with the delegator
     * @returns the fully signed transaction
     */
    signWithDelegator: (tx: TransactionRequest, delegator) => Promise<string>;

    /**
     * Send a transaction with the delegator
     * @returns the transaction response
     */
    sendWithDelegator: (
        tx: TransactionRequest,
        delegator
    ) => Promise<TransactionResponse>;
}

export type { VechainSigner };
