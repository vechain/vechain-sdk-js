import { type vechain_sdk_core_ethers } from '../../../core/src';
import { type SignTransactionOptions } from '@vechain/sdk-network';

/**
 * A signer for vechain, adding specific methods for vechain to the ethers signer
 */
interface VechainSigner extends vechain_sdk_core_ethers.Signer {
    // The delegator attached to this Signer
    delegator: SignTransactionOptions;

    /**
     * Sign a transaction with the delegator
     * @param tx - the transaction to sign
     * @param delegator - the delegator to sign the transaction with
     * @returns the fully signed transaction
     */
    signWithDelegator: (tx: TransactionRequest, delegator) => Promise<string>;

    /**
     * Send a transaction with the delegator
     * @param tx - the transaction to send
     * @param delegator - the delegator to send the transaction with
     * @returns the transaction response
     */
    sendWithDelegator: (
        tx: TransactionRequest,
        delegator
    ) => Promise<TransactionResponse>;
}

export type { VechainSigner };
