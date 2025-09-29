/**
 * Basic VeChain signer interface
 * This is a simplified version for the contracts module integration
 */
export interface VeChainSigner {
    /**
     * Gets the address of the signer
     */
    getAddress(): Promise<string>;
    
    /**
     * Signs a transaction
     */
    signTransaction(transaction: unknown): Promise<string>;
}
