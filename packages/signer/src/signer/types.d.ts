interface Addressable {
    /**
     *  Get the object address.
     */
    getAddress: () => Promise<string>;
}

/**
 *  A **ContractRunner** is a generic interface which defines an object
 *  capable of interacting with a Contract on the network.
 *
 *  The more operations supported, the more utility it is capable of.
 *
 *  The most common ContractRunners are [Providers](Provider) which enable
 *  read-only access and [Signers](Signer) which enable write-access.
 */
export interface ContractRunner {
    /**
     *  The provider used for necessary state querying operations.
     *
     *  This can also point to the **ContractRunner** itself, in the
     *  case of an [[AbstractProvider]].
     */
    // provider: null | Provider;

    /**
     *  Required to estimate gas.
     */
    estimateGas?: (tx: TransactionRequest) => Promise<bigint>;

    /**
     * Required for pure, view or static calls to contracts.
     */
    call?: (tx: TransactionRequest) => Promise<string>;

    /**
     *  Required to support ENS names
     */
    resolveName?: (name: string) => Promise<null | string>;

    /**
     *  Required for state mutating calls
     */
    sendTransaction?: (tx: TransactionRequest) => Promise<TransactionResponse>;
}

/**
 *  An interface for any object which can resolve an ENS name.
 */
export interface NameResolver {
    /**
     *  Resolve to the address for the ENS %%name%%.
     *
     *  Resolves to ``null`` if the name is unconfigued. Use
     *  [[resolveAddress]] (passing this object as %%resolver%%) to
     *  throw for names that are unconfigured.
     */
    resolveName: (name: string) => Promise<null | string>;
}

/**
 *  A Signer represents an account on the vechain Blockchain, and is most often
 *  backed by a private key represented by a mnemonic or residing on a Hardware Wallet.
 *
 *  The API remains abstract though, so that it can deal with more advanced exotic
 *  Signing entities, such as Smart Contract Wallets or Virtual Wallets (where the
 *  private key may not be known).
 */
interface Signer {
    /**
     *  Signs %%tx%%, returning the fully signed transaction.
     */
    signTransaction: (tx: TransactionRequest) => Promise<string>;

    /**
     *  Sends %%tx%% to the Network.
     */
    sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
}

export type { Signer };
