/**
 *  A Signer represents an account on the Ethereum Blockchain, and is most often
 *  backed by a private key represented by a mnemonic or residing on a Hardware Wallet.
 *
 *  The API remains abstract though, so that it can deal with more advanced exotic
 *  Signing entities, such as Smart Contract Wallets or Virtual Wallets (where the
 *  private key may not be known).
 */
interface Signer {
    /**
     *  Signs %%tx%%, returning the fully signed transaction. This does not
     *  populate any additional properties within the transaction.
     */
    signTransaction: (tx: TransactionRequest) => Promise<string>;

    /**
     *  Sends %%tx%% to the Network. The ``signer.populateTransaction(tx)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been popualted first.
     */
    sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
}

export type { Signer };
