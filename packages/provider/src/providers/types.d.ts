import { type vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

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
 *
 * https://github.com/ethers-io/ethers.js/blob/6ee1a5f8bb38ec31fa84c00aae7f091e1d3d6837/src.ts/utils/events.ts#L21
 * -----------------------------
 */
type EventEmitterable<T> = vechain_sdk_core_ethers.EventEmitterable<T>;

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

export { type EventEmitterable };
