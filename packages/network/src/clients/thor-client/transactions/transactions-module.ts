import {
    type Transaction,
    assertIsSignedTransaction,
    assertValidTransactionID,
    TransactionUtils,
    PARAMS_ADDRESS,
    contract,
    PARAMS_ABI,
    dataUtils
} from '@vechainfoundation/vechain-sdk-core';
import { Poll, type HttpClient } from '../../../utils';
import {
    type TransactionReceipt,
    TransactionsClient,
    type SimulateTransactionOptions,
    type SimulateTransactionClause
} from '../../thorest-client';
import {
    type SendTransactionResult,
    type EstimateGasResult,
    type WaitForTransactionOptions
} from './types';
import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { decodeRevertReason } from './helpers/decode-evm-error';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Reference to the `TransactionsClient` instance.
     */
    private readonly transactionsClient: TransactionsClient;

    /**
     * Initializes a new instance of the `TransactionsModule` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(readonly httpClient: HttpClient) {
        this.transactionsClient = new TransactionsClient(httpClient);
    }

    /**
     * Sends a signed transaction to the network.
     *
     * @param signedTx - the transaction to send. It must be signed.
     *
     * @returns A promise that resolves to the transaction ID of the sent transaction.
     *
     * @throws an error if the transaction is not signed or if the transaction object is invalid.
     */
    public async sendTransaction(
        signedTx: Transaction
    ): Promise<SendTransactionResult> {
        assertIsSignedTransaction(signedTx);

        const rawTx = `0x${signedTx.encoded.toString('hex')}`;

        return await this.transactionsClient.sendTransaction(rawTx);
    }

    /**
     * Waits for a transaction to be included in a block.
     *
     * @param txID - The transaction ID of the transaction to wait for.
     * @param options - Optional parameters for the request. Includes the timeout and interval between requests.
     *                  Both parameters are in milliseconds. If the timeout is not specified, the request will not timeout!
     *
     * @returns A promise that resolves to the transaction receipt of the transaction. If the transaction is not included in a block before the timeout,
     *          the promise will resolve to `null`.
     *
     * @throws an error if the transaction ID is invalid.
     */
    public async waitForTransaction(
        txID: string,
        options?: WaitForTransactionOptions
    ): Promise<TransactionReceipt | null> {
        assertValidTransactionID(txID);

        return await Poll.SyncPoll(
            async () =>
                await this.transactionsClient.getTransactionReceipt(txID),
            {
                requestIntervalInMilliseconds: options?.intervalMs,
                maximumWaitingTimeInMilliseconds: options?.timeoutMs
            }
        ).waitUntil((result) => {
            return result !== null;
        });
    }

    /**
     * Simulates a transaction and returns an object containing information regarding the gas used and whether the transaction reverted.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param options - Optional parameters for the request. Includes all options of the `simulateTransaction` method.
     *                  @see {@link TransactionsClient#simulateTransaction}
     *
     * @returns An object containing information regarding the gas used and whether the transaction reverted, together with the decoded revert reason and VM errors.
     *
     * @throws an error if the clauses are invalid or if an error occurs during the simulation.
     */
    public async estimateGas(
        clauses: SimulateTransactionClause[],
        options?: SimulateTransactionOptions
    ): Promise<EstimateGasResult> {
        // Clauses must be an array of clauses with at least one clause
        assert(
            clauses.length > 0,
            DATA.INVALID_DATA_TYPE,
            'Invalid clauses. Clauses must be an array of clauses with at least one clause.'
        );

        // Simulate the transaction to get the simulations of each clause
        const simulations = await this.transactionsClient.simulateTransaction(
            clauses,
            options
        );

        // If any of the clauses reverted, then the transaction reverted
        const isReverted = simulations.some((simulation) => {
            return simulation.reverted;
        });

        // The intrinsic gas of the transaction
        const instrinsicGas = TransactionUtils.intrinsicGas(clauses);

        // totalSimulatedGas represents the summation of all clauses' gasUsed
        const totalSimulatedGas = simulations.reduce((sum, simulation) => {
            return sum + simulation.gasUsed;
        }, 0);

        // The total gas of the transaction
        const totalGas = instrinsicGas + totalSimulatedGas;

        return isReverted
            ? {
                  totalGas,
                  reverted: true,
                  revertReasons: simulations.map((simulation) => {
                      /**
                       * The decoded revert reason of the transaction.
                       * Solidity may revert with Error(string) or Panic(uint256).
                       *
                       * @link see [Error handling: Assert, Require, Revert and Exceptions](https://docs.soliditylang.org/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions)
                       */
                      return decodeRevertReason(simulation.data) ?? '';
                  }),
                  vmErrors: simulations.map((simulation) => {
                      return simulation.vmError;
                  })
              }
            : {
                  totalGas,
                  reverted: false,
                  revertReasons: [],
                  vmErrors: []
              };
    }

    /**
     * Gets the base gas price in wei.
     * The base gas price is the minimum gas price that can be used for a transaction.
     * It is used to obtain the VTHO (energy) cost of a transaction.
     *
     * @link [Total Gas Price](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#total-gas-price)
     *
     * @returns The base gas price in wei.
     */
    public async getBaseGasPrice(): Promise<string> {
        const baseGasPrice = await this.transactionsClient.simulateTransaction([
            {
                to: PARAMS_ADDRESS,
                value: '0',
                data: contract.coder.encodeFunctionInput(PARAMS_ABI, 'get', [
                    dataUtils.encodeBytes32String('base-gas-price')
                ])
            }
        ]);

        return baseGasPrice[0].data;
    }
}

export { TransactionsModule };
