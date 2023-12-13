/**
 * An `EventEmitterable` interface is akin to an EventEmitter,
 * but with asynchronous access to its methods.
 *
 * It follows the observer pattern, facilitating event-driven programming.
 *
 * ----- TEMPORARY COMMENT -----
 * These methods will be implemented by the abstract provider.
 * Each subscribe type will be handled by a dedicated subscriber class (e.g, PollingBlockSubscriber, PollingEventSubscriber (polls an event for its logs), etc.)
 *
 * See hardhat-ethers-plugin and ethers implementations for more details.
 * -----------------------------
 */
interface EventEmitterable<T> {
    /**
     * Registers a listener that gets invoked whenever the
     * specified event occurs, until it's unregistered.
     */
    on: (event: T, listener: Listener) => Promise<this>;

    /**
     * Registers a listener that gets invoked the next time
     * the specified event occurs.
     */
    once: (event: T, listener: Listener) => Promise<this>;

    /**
     * Triggers each listener for the specified event with the provided arguments.
     */
    emit: (event: T, ...args: unknown[]) => Promise<boolean>;

    /**
     * Resolves to the number of listeners for a specified event.
     */
    listenerCount: (event?: T) => Promise<number>;

    /**
     * Resolves to the array of listeners for a specified event.
     */
    listeners: (event?: T) => Promise<Listener[]>;

    /**
     * Resolves to the array of listeners for a specified event.
     */
    off: (event: T, listener?: Listener) => Promise<this>;

    /**
     * Resolves to the array of listeners for a specified event.
     */
    removeAllListeners: (event?: T) => Promise<this>;

    /**
     * An alias for the `on` method.
     */
    addListener: (event: T, listener: Listener) => Promise<this>;

    /**
     * An alias for the `off` method.
     */
    removeListener: (event: T, listener: Listener) => Promise<this>;
}

/**
 *  ----- TEMPORARY COMMENT -----
 * ContractRunner is an ethers interface which is used by ether's Provider.
 * We can change the naming if needed.
 * -----------------------------
 */
interface ContractRunner {
    /**
     * Required to estimate gas.
     *
     * ----- TEMPORARY COMMENT -----
     * estimateGas will call `estimateGas` method which will be defined by the driver.
     * estimateGas will use Transaction.intrinsicGas() + the explainer functionality of driver-no-vendor.
     *
     * @param tx - TransactionRequest can be refactored to our `TransactionBody` (core/src/transaction/types.d.ts)
     *             and then internally we perform all operations needed (e.g., creation of `Transaction` object and calculation of estimateGas)
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    estimateGas?: (tx: TransactionRequest) => Promise<bigint>;

    /**
     * Required for pure, view or static calls to contracts
     *
     * ----- TEMPORARY COMMENT -----
     * call can be implemented by using call() of account-visitor.ts or compat.ts
     * This depends on driver-no-vendor that uses httpPost and creates a query for Simple net's `query` NetParam
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    call?: (tx: TransactionRequest) => Promise<string>;

    /**
     *  Required to support ENS names
     *
     * ----- TEMPORARY COMMENT -----
     * resolveName will not be used in first release.
     * Maybe we can consider it in the future when VNS is supported.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    resolveName?: (name: string) => Promise<null | string>;

    /**
     *  Required for state mutating calls
     *
     * ----- TEMPORARY COMMENT -----
     * sendTransaction will call `sendTransaction` method which will be implemented in driver.
     * Internally we will get the raw tx needed to `sendTransaction`.
     *
     * @param tx - TransactionRequest can be refactored to our `Transaction` (core/src/transaction/types.d.ts)
     *             in this case we need to create a `Transaction` object that is signed.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    sendTransaction?: (tx: TransactionRequest) => Promise<TransactionResponse>;
}

/**
 * ----- TEMPORARY COMMENT -----
 * This is the Provider interface that needs to be implemented to adhere with Hardhat's standard with ether's Provider.
 * -----------------------------
 */
interface Provider extends ContractRunner, EventEmitterable<ProviderEvent> {
    /**
     * Shutdown any resources this provider is using. No additional
     * calls should be made to this provider after calling this.
     *
     * ----- TEMPORARY COMMENT -----
     * destroy needs to be implemented by the hardhat plugin or any other class that implements the Provider interface.
     * -----------------------------
     */
    destroy: () => void;

    /* ---------------------- STATE ---------------------- */

    /**
     *  Get the current block number.
     *
     * ----- TEMPORARY COMMENT -----
     * getBlockNumber will call `getBlockNumber` method which will be implemented in driver.
     * to retrieve the latest block there is the blocks/best endpoint.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getBlockNumber: () => Promise<number>;

    /**
     * ----- TEMPORARY COMMENT -----
     * Get the connected Network (Mainnet, Testnet, Solo)
     *
     * We should return a Network object that contains at least the chainTag & network name
     * This must be looked into detail as we need to understand what hardhat requires exactly.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getNetwork: () => Promise<Network>;

    /**
     * Get the best guess at the recommended [[FeeData]].
     *
     * ----- TEMPORARY COMMENT -----
     * FeeData in ethers contains gasPrice, maxFeePerGas, maxPriorityFeePerGas
     * In vechain we need to understand if these are the same or if we need to return something else.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getFeeData: () => Promise<FeeData>;

    /* ---------------------- ACCOUNTS ---------------------- */

    /**
     *  Get the account balance of VET and VTHO for the given address
     *
     * ----- TEMPORARY COMMENT -----
     * getBalance will call `getBalance` method which will be implemented in driver-no-vendor.
     * This methods does not exist in connex. It will need to call the /accounts/{address} endpoint.
     * The endpoint also allows to specify the revision which is the block number to get the balance for.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getBalance: (address: AddressLike, blockTag?: BlockTag) => Promise<bigint>;

    /**
     * Get the number of transactions ever sent for %%address%%, which
     * is used as the ``nonce`` when sending a transaction. If
     * %%blockTag%% is specified and the node supports archive access
     * for that %%blockTag%%, the transaction count is as of that
     * [[BlockTag]].
     *
     * ----- TEMPORARY COMMENT -----
     * This method is not needed as we do not have the incremental nonce logic as per Ethereum.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getTransactionCount: (
        address: AddressLike,
        blockTag?: BlockTag
    ) => Promise<number>;

    /**
     * Get the bytecode for a given address
     *
     * ----- TEMPORARY COMMENT -----
     * getCode will call `getCode` method which will be implemented in driver-no-vendor.
     * This methods does not exist in connex. It will need to call the /accounts/{address}/code endpoint
     * which returns the bytecode for the given address. You can also specify the revision which is the block number.
     * We will have to change the getCode signature with appropriate parameters.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getCode: (address: AddressLike, blockTag?: BlockTag) => Promise<string>;

    /**
     *  Get the storage slot value for %%address%% at slot %%position%%.
     *
     * ----- TEMPORARY COMMENT -----
     * getStorage will call `getStorage` method which will be implemented in driver-no-vendor.
     * This methods does not exist in connex. It will need to call the /accounts/{address}/storage/{key} endpoint
     * which returns the storage value for the given address and key. You can also specify the revision which is the block number.
     * We will have to change the getStorage signature with appropriate parameters.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getStorage: (
        address: AddressLike,
        position: BigNumberish,
        blockTag?: BlockTag
    ) => Promise<string>;

    /* ---------------------- EXECUTION ---------------------- */

    /**
     * ----- TEMPORARY COMMENT -----
     * See `ContractRunner` interface for details
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    estimateGas: (tx: TransactionRequest) => Promise<bigint>;

    /**
     * ----- TEMPORARY COMMENT -----
     * See `ContractRunner` interface for details
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    call: (tx: TransactionRequest) => Promise<string>;

    /**
     *  Broadcasts the %%signedTx%% to the network, adding it to the
     *  memory pool of any node for which the transaction meets the
     *  rebroadcast requirements.
     *
     * ----- TEMPORARY COMMENT -----
     * broadcastTransaction is the same as sendTransaction as it does eth_sendRawTransaction in hardhat ethers plugin but returns a TransactionResponse.
     * This time we are receiving a raw tx instead of the TransactionBody object. Which means we are broadcasting the tx already signed and encoded.
     *
     * can use sendTx of connex's driver
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    broadcastTransaction: (signedTx: string) => Promise<TransactionResponse>;

    /* ---------------------- QUERIES ---------------------- */

    /**
     * Resolves to the block for %%blockHashOrBlockTag%%.
     *
     * ----- TEMPORARY COMMENT -----
     * getBlock will call `getBlock` method which will be implemented in driver-no-vendor.
     * This methods does not exist in connex. It will need to call the /blocks/{revision} endpoint
     *
     * We will need to change the signature in order to specify blockId or blockNumber to get the block.
     * Also, prefetchTxs is a boolean to specify whether to show transactions of the block or not.
     * In thorest, the query param is 'expanded' which expands information about the transaction of the block.
     *
     * Note that transactions of the block are always present, if expanded is true then the transaction details are also present.
     * Otherwise only the transaction hashes are present.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    getBlock: (
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        blockHashOrBlockTag: BlockTag | string,
        prefetchTxs?: boolea
        // TO_MODIFY Remove when typesafety is added
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    ) => Promise<null | Block>;

    /**
     *  Resolves to the transaction for %%hash%%.
     *
     * ----- TEMPORARY COMMENT -----
     * getTransaction will call `getTransaction` method which will be implemented in driver-no-vendor.
     * This methods exists in driver.
     * We can add the 'allowPending' parameter to specify whether to allow pending transactions or not.
     * A pending transaction might have meta attribute null.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    // TO_MODIFY Remove when typesafety is added
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    getTransaction: (hash: string) => Promise<null | TransactionResponse>;

    /**
     * Resolves to the transaction receipt for %%hash%%, if mined.
     *
     * ----- TEMPORARY COMMENT -----
     * getTransactionReceipt will call `getReceipt` method which will be implemented in driver-no-vendor.
     * This method will call the /transactions/{id}/receipt endpoint.
     *
     * TO_MODIFY - typesafety
     */
    // TO_MODIFY Remove when typesafety is added
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    getTransactionReceipt: (hash: string) => Promise<null | TransactionReceipt>;

    /**
     *  Resolves to the result returned by the executions of %%hash%%.
     *
     * ----- TEMPORARY COMMENT -----
     * This method is not implemented by hardhat ethers plugin. And it's about tracing transactions and is not supported by vechain as far as I know.
     * -----------------------------
     */
    getTransactionResult: (hash: string) => Promise<null | string>;

    /* ---------------------- BLOOM ---------------------- */

    /**
     *  Resolves to the list of Logs that match %%filter%%
     *
     * ----- TEMPORARY COMMENT -----
     * We do not use bloom for event logs.
     * -----------------------------
     */
    // TO_MODIFY Remove when typesafety is added
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    getLogs: (filter: Filter | FilterByBlockHash) => Promise<Log[]>;

    /* ---------------------- VNS ---------------------- */

    /**
     *  Resolves to the address configured for the %%ensName%% or
     *  ``null`` if unconfigured.
     *
     * ----- TEMPORARY COMMENT -----
     * We do not use ENS (will be VNS) for now.
     * -----------------------------
     */
    resolveName: (ensName: string) => Promise<null | string>;

    /**
     *  Resolves to the ENS name associated for the %%address%% or
     *  ``null`` if the //primary name// is not configured.
     *
     *  Users must perform additional steps to configure a //primary name//,
     *  which is not currently common.
     *
     * ----- TEMPORARY COMMENT -----
     * We do not use ENS (will be VNS) for now.
     * -----------------------------
     */
    lookupAddress: (address: string) => Promise<null | string>;

    /**
     *  Waits until the transaction %%hash%% is mined and has %%confirms%%
     *  confirmations.
     *
     * ----- TEMPORARY COMMENT -----
     * This method is not implemented by hardhat ethers plugin. We can make an improved implementation to the one in ethers' abstract-signer
     * -----------------------------
     */
    waitForTransaction: (
        hash: string,
        confirms?: number,
        timeout?: number
        // TO_MODIFY Remove when typesafety is added
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    ) => Promise<null | TransactionReceipt>;

    /**
     *  Resolves to the block at %%blockTag%% once it has been mined.
     *
     *  This can be useful for waiting some number of blocks by using
     *  the ``currentBlockNumber + N``.
     *
     * ----- TEMPORARY COMMENT -----
     * This method is not implemented by hardhat ethers plugin. Nore is it implemented by ethers' abstract-provider.
     * -----------------------------
     */
    waitForBlock: (blockTag?: BlockTag) => Promise<Block>;
}

export { type EventEmitterable };
