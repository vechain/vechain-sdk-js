import { type ABIFunction, Clause, type ContractClause, Transaction, type TransactionBody, type TransactionClause } from '@vechain/sdk-core';
import type { VeChainSigner } from '../../signer';
import { type BlocksModule } from '../blocks';
import type { ContractCallOptions, ContractCallResult, ContractTransactionOptions } from '../contracts';
import { type DebugModule } from '../debug';
import { type ForkDetector } from '../fork';
import { type GasModule } from '../gas';
import type { EstimateGasOptions, EstimateGasResult } from '../gas/types';
import { type LogsModule } from '../logs';
import { type GetTransactionInputOptions, type GetTransactionReceiptInputOptions, type SendTransactionResult, type SimulateTransactionClause, type SimulateTransactionOptions, type TransactionBodyOptions, type TransactionDetailNoRaw, type TransactionDetailRaw, type TransactionReceipt, type TransactionSimulationResult, type WaitForTransactionOptions } from './types';
/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
declare class TransactionsModule {
    readonly blocksModule: BlocksModule;
    readonly debugModule: DebugModule;
    readonly logsModule: LogsModule;
    readonly gasModule: GasModule;
    readonly forkDetector: ForkDetector;
    constructor(blocksModule: BlocksModule, debugModule: DebugModule, logsModule: LogsModule, gasModule: GasModule, forkDetector: ForkDetector);
    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     * @throws {InvalidDataType}
     */
    getTransaction(id: string, options?: GetTransactionInputOptions): Promise<TransactionDetailNoRaw | null>;
    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     * @throws {InvalidDataType}
     */
    getTransactionRaw(id: string, options?: GetTransactionInputOptions): Promise<TransactionDetailRaw | null>;
    /**
     * Retrieves the receipt of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     *                  If `head` is not specified, the receipt of the transaction at the best block is returned.
     * @returns A promise that resolves to the receipt of the transaction.
     * @throws {InvalidDataType}
     */
    getTransactionReceipt(id: string, options?: GetTransactionReceiptInputOptions): Promise<TransactionReceipt | null>;
    /**
     * Retrieves the receipt of a transaction.
     *
     * @param raw - The raw transaction.
     * @returns The transaction id of send transaction.
     * @throws {InvalidDataType}
     */
    sendRawTransaction(raw: string): Promise<SendTransactionResult>;
    /**
     * Sends a signed transaction to the network.
     *
     * @param signedTx - the transaction to send. It must be signed.
     * @returns A promise that resolves to the transaction ID of the sent transaction.
     * @throws {InvalidDataType}
     */
    sendTransaction(signedTx: Transaction): Promise<SendTransactionResult>;
    /**
     * Waits for a transaction to be included in a block.
     *
     * @param txID - The transaction ID of the transaction to wait for.
     * @param options - Optional parameters for the request. Includes the timeout and interval between requests.
     *                  Both parameters are in milliseconds. If the timeout is not specified, the request will not time out!
     * @returns A promise that resolves to the transaction receipt of the transaction. If the transaction is not included in a block before the timeout,
     *          the promise will resolve to `null`.
     * @throws {InvalidDataType}
     */
    waitForTransaction(txID: string, options?: WaitForTransactionOptions): Promise<TransactionReceipt | null>;
    /**
     * Builds a transaction body with the given clauses without having to
     * specify the chainTag, expiration, gasPriceCoef, gas, dependsOn and reserved fields.
     *
     * @param clauses - The clauses of the transaction.
     * @param gas - The gas to be used to perform the transaction.
     * @param options - Optional parameters for the request. Includes the expiration, gasPriceCoef, maxFeePerGas, maxPriorityFeePerGas, gas, dependsOn and isDelegated fields.
     *                  If the `expiration` is not specified, the transaction will expire after 32 blocks.
     *                  If the `gasPriceCoef` is not specified & galactica fork didn't happen yet, the transaction will use the default gas price coef of 0.
     *                  If the `gasPriceCoef` is not specified & galactica fork happened, the transaction will use the default maxFeePerGas and maxPriorityFeePerGas.
     *                  If the `gas` is specified in options, it will override the gas parameter.
     *                  If the `dependsOn` is not specified, the transaction will not depend on any other transaction.
     *                  If the `isDelegated` is not specified, the transaction will not be delegated.
     *
     * @returns A promise that resolves to the transaction body.
     *
     * @throws an error if the genesis block or the latest block cannot be retrieved.
     */
    buildTransactionBody(clauses: TransactionClause[] | Clause[] | ContractClause['clause'], gas: number, options?: TransactionBodyOptions): Promise<TransactionBody>;
    /**
     * Fills the transaction body with the default options.
     *
     * @param body - The transaction body to fill.
     * @returns A promise that resolves to the filled transaction body.
     * @throws {InvalidDataType}
     */
    fillTransactionBody(body: TransactionBody): Promise<TransactionBody>;
    /**
     * Fills the default body options for a transaction.
     *
     * @param options - The transaction body options to fill.
     * @returns A promise that resolves to the filled transaction body options.
     * @throws {InvalidDataType}
     */
    fillDefaultBodyOptions(options?: TransactionBodyOptions): Promise<TransactionBodyOptions>;
    /**
     * Calculates the default max priority fee per gas based on the current base fee
     * and historical 75th percentile rewards.
     *
     * Uses the FAST (HIGH) speed threshold: min(0.046*baseFee, 75_percentile)
     *
     * @param baseFee - The current base fee per gas
     * @returns A promise that resolves to the default max priority fee per gas as a hex string
     */
    private calculateDefaultMaxPriorityFeePerGas;
    /**
     * Ensures that names in clauses are resolved to addresses
     *
     * @param clauses - The clauses of the transaction.
     * @returns A promise that resolves to clauses with resolved addresses
     */
    resolveNamesInClauses(clauses: TransactionClause[]): Promise<TransactionClause[]>;
    /**
     * Simulates the execution of a transaction.
     * Allows to estimate the gas cost of a transaction without sending it, as well as to retrieve the return value(s) of the transaction.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param options - (Optional) The options for simulating the transaction.
     * @returns A promise that resolves to an array of simulation results.
     *          Each element of the array represents the result of simulating a clause.
     * @throws {InvalidDataType}
     */
    simulateTransaction(clauses: SimulateTransactionClause[], options?: SimulateTransactionOptions): Promise<TransactionSimulationResult[]>;
    /**
     * Decode the revert reason from the encoded revert reason into a transaction.
     *
     * @param encodedRevertReason - The encoded revert reason to decode.
     * @param errorFragment - (Optional) The error fragment to use to decode the revert reason (For Solidity custom errors).
     * @returns A promise that resolves to the decoded revert reason.
     * Revert reason can be a string error or Panic(error_code)
     */
    decodeRevertReason(encodedRevertReason: string, errorFragment?: string): string;
    /**
     * Get the revert reason of an existing transaction.
     *
     * @param transactionHash - The hash of the transaction to get the revert reason for.
     * @param errorFragment - (Optional) The error fragment to use to decode the revert reason (For Solidity custom errors).
     * @returns A promise that resolves to the revert reason of the transaction.
     */
    getRevertReason(transactionHash: string, errorFragment?: string): Promise<string | null>;
    /**
     * Estimates the amount of gas required to execute a set of transaction clauses.
     *
     * @param {SimulateTransactionClause[]} clauses - An array of clauses to be simulated. Must contain at least one clause.
     * @param {string} [caller] - The address initiating the transaction. Optional.
     * @param {EstimateGasOptions} [options] - Additional options for the estimation, including gas padding.
     * @return {Promise<EstimateGasResult>} - The estimated gas result, including total gas required, whether the transaction reverted, revert reasons, and any VM errors.
     * @throws {InvalidDataType} - If clauses array is empty or if gas padding is not within the range (0, 1].
     *
     * @see {@link TransactionsModule#simulateTransaction}
     */
    estimateGas(clauses: (SimulateTransactionClause | ContractClause)[], caller?: string, options?: EstimateGasOptions): Promise<EstimateGasResult>;
    /**
     * Executes a read-only call to a smart contract function, simulating the transaction to obtain the result.
     *
     * The method simulates a transaction using the provided parameters
     * without submitting it to the blockchain, allowing read-only operations
     * to be tested without incurring gas costs or modifying the blockchain state.
     *
     * @param {string} contractAddress - The address of the smart contract.
     * @param {ABIFunction} functionAbi - The ABI definition of the smart contract function to be called.
     * @param {unknown[]} functionData - The arguments to be passed to the smart contract function.
     * @param {ContractCallOptions} [contractCallOptions] - Optional parameters for the contract call execution.
     * @return {Promise<ContractCallResult>} The result of the contract call.
     */
    executeCall(contractAddress: string, functionAbi: ABIFunction, functionData: unknown[], contractCallOptions?: ContractCallOptions): Promise<ContractCallResult>;
    /**
     * Executes and simulates multiple read-only smart-contract clause calls,
     * simulating the transaction to obtain the results.
     *
     * @param {ContractClause[]} clauses - The array of contract clauses to be executed.
     * @param {SimulateTransactionOptions} [options] - Optional simulation transaction settings.
     * @return {Promise<ContractCallResult[]>} - The decoded results of the contract calls.
     */
    executeMultipleClausesCall(clauses: ContractClause[], options?: SimulateTransactionOptions): Promise<ContractCallResult[]>;
    /**
     * Executes a transaction with a smart-contract on the VeChain blockchain.
     *
     * @param {VeChainSigner} signer - The signer instance to sign the transaction.
     * @param {string} contractAddress - The address of the smart contract.
     * @param {ABIFunction} functionAbi - The ABI of the contract function to be called.
     * @param {unknown[]} functionData - The input parameters for the contract function.
     * @param {ContractTransactionOptions} [options] - Optional transaction parameters.
     * @return {Promise<SendTransactionResult>} - A promise that resolves to the result of the transaction.
     *
     * @see {@link TransactionsModule.buildTransactionBody}
     */
    executeTransaction(signer: VeChainSigner, contractAddress: string, functionAbi: ABIFunction, functionData: unknown[], options?: ContractTransactionOptions): Promise<SendTransactionResult>;
    /**
     * Executes a transaction with multiple clauses on the VeChain blockchain.
     *
     * @param {ContractClause[]} clauses - Array of contract clauses to be included in the transaction.
     * @param {VeChainSigner} signer - A VeChain signer instance used to sign and send the transaction.
     * @param {ContractTransactionOptions} [options] - Optional parameters to customize the transaction.
     * @return {Promise<SendTransactionResult>} The result of the transaction, including transaction ID and a wait function.
     */
    executeMultipleClausesTransaction(clauses: ContractClause[] | TransactionClause[], signer: VeChainSigner, options?: ContractTransactionOptions): Promise<SendTransactionResult>;
    /**
     * Retrieves the base gas price from the blockchain parameters.
     *
     * This method sends a call to the blockchain parameters contract to fetch the current base gas price.
     * The base gas price is the minimum gas price that can be used for a transaction.
     * It is used to obtain the VTHO (energy) cost of a transaction.
     * @link [Total Gas Price](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#total-gas-price)
     *
     * @return {Promise<ContractCallResult>} A promise that resolves to the result of the contract call, containing the base gas price.
     */
    getLegacyBaseGasPrice(): Promise<ContractCallResult>;
    /**
     * Decode the result of a contract call from the result of a simulated transaction.
     *
     * @param {string} encodedData - The encoded data received from the contract call.
     * @param {ABIFunction} functionAbi - The ABI function definition used for decoding the result.
     * @param {boolean} reverted - Indicates if the contract call reverted.
     * @return {ContractCallResult} An object containing the success status and the decoded result.
     */
    private getContractCallResult;
}
export { TransactionsModule };
//# sourceMappingURL=transactions-module.d.ts.map