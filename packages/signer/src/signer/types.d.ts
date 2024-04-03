import { type vechain_sdk_core_ethers } from '../../../core/src';
import { type SignTransactionOptions } from '@vechain/sdk-network';
import { type VechainProvider } from '@vechain/sdk-provider';

/**
 * A signer for vechain, adding specific methods for vechain to the ethers signer
 */
interface VechainSigner extends vechain_sdk_core_ethers.Signer {
    /**
     * The delegator attached to this Signer (if any)
     */
    delegator: null | SignTransactionOptions;

    /**
     * The provider attached to this Signer (if any)
     */
    provider: null | VechainProvider;

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
