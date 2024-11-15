import {
    ABI,
    ABIContract,
    type ABIFunction,
    Address,
    Clause,
    dataUtils,
    Hex,
    HexUInt,
    Revision,
    ThorId,
    Transaction,
    type TransactionBody,
    type TransactionClause,
    Units,
    VET
} from '@vechain/sdk-core';
import { InvalidDataType, InvalidTransactionField } from '@vechain/sdk-errors';
import { ErrorFragment, Interface } from 'ethers';
import { HttpMethod } from '../../http';
import { blocksFormatter, getTransactionIndexIntoBlock } from '../../provider';
import {
    buildQuery,
    BUILT_IN_CONTRACTS,
    ERROR_SELECTOR,
    PANIC_SELECTOR,
    Poll,
    thorest,
    vnsUtils
} from '../../utils';
import { type BlocksModule, type ExpandedBlockDetail } from '../blocks';
import { type CallNameReturnType, type DebugModule } from '../debug';
import {
    type GetTransactionInputOptions,
    type GetTransactionReceiptInputOptions,
    type SendTransactionResult,
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type TransactionBodyOptions,
    type TransactionDetailNoRaw,
    type TransactionDetailRaw,
    type TransactionReceipt,
    type TransactionSimulationResult,
    type WaitForTransactionOptions
} from './types';
import type { EstimateGasOptions, EstimateGasResult } from '../gas/types';
import { decodeRevertReason } from '../gas/helpers/decode-evm-error';
import type {
    ContractCallOptions,
    ContractCallResult,
    ContractClause,
    ContractTransactionOptions
} from '../contracts';
import type { VeChainSigner } from '../../signer';
import { type LogsModule } from '../logs';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    readonly blocksModule: BlocksModule;
    readonly debugModule: DebugModule;
    readonly logsModule: LogsModule;

    constructor(
        blocksModule: BlocksModule,
        debugModule: DebugModule,
        logsModule: LogsModule
    ) {
        this.blocksModule = blocksModule;
        this.debugModule = debugModule;
        this.logsModule = logsModule;
    }

    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     * @throws {InvalidDataType}
     */
    public async getTransaction(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetailNoRaw | null> {
        // Invalid transaction ID
        if (!ThorId.isValid(id)) {
            throw new InvalidDataType(
                'TransactionsModule.getTransaction()',
                'Invalid transaction ID given as input. Input must be an hex string of length 64.',
                { id }
            );
        }

        // Invalid head
        if (options?.head !== undefined && !ThorId.isValid(options.head))
            throw new InvalidDataType(
                'TransactionsModule.getTransaction()',
                'Invalid head given as input. Input must be an hex string of length 64.',
                { head: options?.head }
            );

        return (await this.blocksModule.httpClient.http(
            HttpMethod.GET,
            thorest.transactions.get.TRANSACTION(id),
            {
                query: buildQuery({
                    raw: false,
                    head: options?.head,
                    pending: options?.pending
                })
            }
        )) as TransactionDetailNoRaw | null;
    }

    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     * @throws {InvalidDataType}
     */
    public async getTransactionRaw(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetailRaw | null> {
        // Invalid transaction ID
        if (!ThorId.isValid(id)) {
            throw new InvalidDataType(
                'TransactionsModule.getTransactionRaw()',
                'Invalid transaction ID given as input. Input must be an hex string of length 64.',
                { id }
            );
        }

        // Invalid head
        if (options?.head !== undefined && !ThorId.isValid(options.head))
            throw new InvalidDataType(
                'TransactionsModule.getTransaction()',
                'Invalid head given as input. Input must be an hex string of length 64.',
                { head: options?.head }
            );

        return (await this.blocksModule.httpClient.http(
            HttpMethod.GET,
            thorest.transactions.get.TRANSACTION(id),
            {
                query: buildQuery({
                    raw: true,
                    head: options?.head,
                    pending: options?.pending
                })
            }
        )) as TransactionDetailRaw | null;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     *                  If `head` is not specified, the receipt of the transaction at the best block is returned.
     * @returns A promise that resolves to the receipt of the transaction.
     * @throws {InvalidDataType}
     */
    public async getTransactionReceipt(
        id: string,
        options?: GetTransactionReceiptInputOptions
    ): Promise<TransactionReceipt | null> {
        // Invalid transaction ID
        if (!ThorId.isValid(id)) {
            throw new InvalidDataType(
                'TransactionsModule.getTransactionReceipt()',
                'Invalid transaction ID given as input. Input must be an hex string of length 64.',
                { id }
            );
        }

        // Invalid head
        if (options?.head !== undefined && !ThorId.isValid(options.head))
            throw new InvalidDataType(
                'TransactionsModule.getTransaction()',
                'Invalid head given as input. Input must be an hex string of length 64.',
                { head: options?.head }
            );

        return (await this.blocksModule.httpClient.http(
            HttpMethod.GET,
            thorest.transactions.get.TRANSACTION_RECEIPT(id),
            {
                query: buildQuery({ head: options?.head })
            }
        )) as TransactionReceipt | null;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param raw - The raw transaction.
     * @returns The transaction id of send transaction.
     * @throws {InvalidDataType}
     */
    public async sendRawTransaction(
        raw: string
    ): Promise<SendTransactionResult> {
        // Validate raw transaction
        if (!Hex.isValid0x(raw)) {
            throw new InvalidDataType(
                'TransactionsModule.sendRawTransaction()',
                'Sending failed: Input must be a valid raw transaction in hex format.',
                { raw }
            );
        }

        // Decode raw transaction to check if raw is ok
        try {
            Transaction.decode(HexUInt.of(raw.slice(2)).bytes, true);
        } catch (error) {
            throw new InvalidDataType(
                'TransactionsModule.sendRawTransaction()',
                'Sending failed: Input must be a valid raw transaction in hex format. Decoding error encountered.',
                { raw },
                error
            );
        }

        const transactionResult = (await this.blocksModule.httpClient.http(
            HttpMethod.POST,
            thorest.transactions.post.TRANSACTION(),
            {
                body: { raw }
            }
        )) as SendTransactionResult;

        return {
            id: transactionResult.id,
            wait: async () =>
                await this.waitForTransaction(transactionResult.id)
        };
    }

    /**
     * Sends a signed transaction to the network.
     *
     * @param signedTx - the transaction to send. It must be signed.
     * @returns A promise that resolves to the transaction ID of the sent transaction.
     * @throws {InvalidDataType}
     */
    public async sendTransaction(
        signedTx: Transaction
    ): Promise<SendTransactionResult> {
        // Assert transaction is signed or not
        if (!signedTx.isSigned) {
            throw new InvalidDataType(
                'TransactionsModule.sendTransaction()',
                'Invalid transaction given as input. Transaction must be signed.',
                { signedTx }
            );
        }

        const rawTx = Hex.of(signedTx.encoded).toString();

        return await this.sendRawTransaction(rawTx);
    }

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
    public async waitForTransaction(
        txID: string,
        options?: WaitForTransactionOptions
    ): Promise<TransactionReceipt | null> {
        // Invalid transaction ID
        if (!ThorId.isValid(txID)) {
            throw new InvalidDataType(
                'TransactionsModule.waitForTransaction()',
                'Invalid transaction ID given as input. Input must be an hex string of length 64.',
                { txID }
            );
        }

        return await Poll.SyncPoll(
            async () => await this.getTransactionReceipt(txID),
            {
                requestIntervalInMilliseconds: options?.intervalMs,
                maximumWaitingTimeInMilliseconds: options?.timeoutMs
            }
        ).waitUntil((result) => {
            return result !== null;
        });
    }

    /**
     * Builds a transaction body with the given clauses without having to
     * specify the chainTag, expiration, gasPriceCoef, gas, dependsOn and reserved fields.
     *
     * @param clauses - The clauses of the transaction.
     * @param gas - The gas to be used to perform the transaction.
     * @param options - Optional parameters for the request. Includes the expiration, gasPriceCoef, dependsOn and isDelegated fields.
     *                  If the `expiration` is not specified, the transaction will expire after 32 blocks.
     *                  If the `gasPriceCoef` is not specified, the transaction will use the default gas price coef of 127.
     *                  If the `dependsOn is` not specified, the transaction will not depend on any other transaction.
     *                  If the `isDelegated` is not specified, the transaction will not be delegated.
     *
     * @returns A promise that resolves to the transaction body.
     *
     * @throws an error if the genesis block or the latest block cannot be retrieved.
     */
    public async buildTransactionBody(
        clauses: TransactionClause[],
        gas: number,
        options?: TransactionBodyOptions
    ): Promise<TransactionBody> {
        // Get the genesis block to get the chainTag
        const genesisBlock = await this.blocksModule.getBlockCompressed(0);
        if (genesisBlock === null)
            throw new InvalidTransactionField(
                'TransactionsModule.buildTransactionBody()',
                'Error while building transaction body: Cannot get genesis block.',
                { fieldName: 'genesisBlock', genesisBlock, clauses, options }
            );

        const blockRef =
            options?.blockRef ?? (await this.blocksModule.getBestBlockRef());
        if (blockRef === null)
            throw new InvalidTransactionField(
                'TransactionsModule.buildTransactionBody()',
                'Error while building transaction body: Cannot get blockRef.',
                { fieldName: 'blockRef', blockRef, clauses, options }
            );

        const chainTag =
            options?.chainTag ?? Number(`0x${genesisBlock.id.slice(64)}`);

        return {
            blockRef,
            chainTag,
            clauses: await this.resolveNamesInClauses(clauses),
            dependsOn: options?.dependsOn ?? null,
            expiration: options?.expiration ?? 32,
            gas,
            gasPriceCoef: options?.gasPriceCoef ?? 0,
            nonce: options?.nonce ?? Hex.random(8).toString(),
            reserved:
                options?.isDelegated === true ? { features: 1 } : undefined
        };
    }

    /**
     * Ensures that names in clauses are resolved to addresses
     *
     * @param clauses - The clauses of the transaction.
     * @returns A promise that resolves to clauses with resolved addresses
     */
    public async resolveNamesInClauses(
        clauses: TransactionClause[]
    ): Promise<TransactionClause[]> {
        // find unique names in the clause list
        const uniqueNames = clauses.reduce((map, clause) => {
            if (
                typeof clause.to === 'string' &&
                !map.has(clause.to) &&
                clause.to.includes('.')
            ) {
                map.set(clause.to, clause.to);
            }
            return map;
        }, new Map<string, string>());

        const nameList = [...uniqueNames.keys()];

        // no names, return the original clauses
        if (uniqueNames.size === 0) {
            return clauses;
        }

        // resolve the names to addresses
        const addresses = await vnsUtils.resolveNames(
            this.blocksModule,
            this,
            nameList
        );

        // map unique names with resolved addresses
        addresses.forEach((address, index) => {
            if (address !== null) {
                uniqueNames.set(nameList[index], address);
            }
        });

        // replace names with resolved addresses, or leave unchanged
        return clauses.map((clause) => {
            if (typeof clause.to !== 'string') {
                return clause;
            }

            return {
                to: uniqueNames.get(clause.to) ?? clause.to,
                data: clause.data,
                value: clause.value
            };
        });
    }

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
    public async simulateTransaction(
        clauses: SimulateTransactionClause[],
        options?: SimulateTransactionOptions
    ): Promise<TransactionSimulationResult[]> {
        const {
            revision,
            caller,
            gasPrice,
            gasPayer,
            gas,
            blockRef,
            expiration,
            provedWork
        } = options ?? {};
        if (
            revision !== undefined &&
            revision !== null &&
            !Revision.isValid(revision)
        ) {
            throw new InvalidDataType(
                'TransactionsModule.simulateTransaction()',
                'Invalid revision given as input. Input must be a valid revision (i.e., a block number or block ID).',
                { revision }
            );
        }

        return (await this.blocksModule.httpClient.http(
            HttpMethod.POST,
            thorest.accounts.post.SIMULATE_TRANSACTION(revision),
            {
                query: buildQuery({ revision }),
                body: {
                    clauses: await this.resolveNamesInClauses(
                        clauses.map((clause) => {
                            return {
                                to: clause.to,
                                data: clause.data,
                                value: BigInt(clause.value).toString()
                            };
                        })
                    ),
                    gas,
                    gasPrice,
                    caller,
                    provedWork,
                    gasPayer,
                    expiration,
                    blockRef
                }
            }
        )) as TransactionSimulationResult[];
    }

    /**
     * Decode the revert reason from the encoded revert reason into a transaction.
     *
     * @param encodedRevertReason - The encoded revert reason to decode.
     * @param errorFragment - (Optional) The error fragment to use to decode the revert reason (For Solidity custom errors).
     * @returns A promise that resolves to the decoded revert reason.
     * Revert reason can be a string error or Panic(error_code)
     */
    public decodeRevertReason(
        encodedRevertReason: string,
        errorFragment?: string
    ): string {
        // Error selector
        if (encodedRevertReason.startsWith(ERROR_SELECTOR))
            return ABI.ofEncoded(
                'string',
                `0x${encodedRevertReason.slice(ERROR_SELECTOR.length)}`
            ).getFirstDecodedValue();
        // Panic selector
        else if (encodedRevertReason.startsWith(PANIC_SELECTOR)) {
            const decoded = ABI.ofEncoded(
                'uint256',
                `0x${encodedRevertReason.slice(PANIC_SELECTOR.length)}`
            ).getFirstDecodedValue<string>();
            return `Panic(0x${parseInt(decoded).toString(16).padStart(2, '0')})`;
        }
        // Solidity error, an error fragment is provided, so decode the revert reason using solidity error
        else if (errorFragment !== undefined) {
            const errorInterface = new Interface([
                ErrorFragment.from(errorFragment)
            ]);
            return errorInterface
                .decodeErrorResult(
                    ErrorFragment.from(errorFragment),
                    encodedRevertReason
                )
                .toArray()[0] as string;
        }

        // Unknown revert reason (we know ONLY that transaction is reverted)
        return ``;
    }

    /**
     * Get the revert reason of an existing transaction.
     *
     * @param transactionHash - The hash of the transaction to get the revert reason for.
     * @param errorFragment - (Optional) The error fragment to use to decode the revert reason (For Solidity custom errors).
     * @returns A promise that resolves to the revert reason of the transaction.
     */
    public async getRevertReason(
        transactionHash: string,
        errorFragment?: string
    ): Promise<string | null> {
        // 1 - Init Blocks and Debug modules
        const blocksModule = this.blocksModule;
        const debugModule = this.debugModule;

        // 2 - Get the transaction details
        const transaction = await this.getTransaction(transactionHash);

        // 3 - Get the block details (to get the transaction index)
        const block =
            transaction !== null
                ? ((await blocksModule.getBlockExpanded(
                      transaction.meta.blockID
                  )) as ExpandedBlockDetail)
                : null;

        // Block or transaction not found
        if (block === null || transaction === null) return null;

        // 4 - Get the transaction index into the block (we know the transaction is in the block)
        const transactionIndex = getTransactionIndexIntoBlock(
            blocksFormatter.formatToRPCStandard(block, ''),
            transactionHash
        );

        // 5 - Get the error or panic reason. By iterating over the clauses of the transaction
        for (
            let transactionClauseIndex = 0;
            transactionClauseIndex < transaction.clauses.length;
            transactionClauseIndex++
        ) {
            // 5.1 - Debug the clause
            const debuggedClause = (await debugModule.traceTransactionClause(
                {
                    target: {
                        blockId: ThorId.of(block.id),
                        transaction: transactionIndex,
                        clauseIndex: transactionClauseIndex
                    },
                    // Optimized for top call
                    config: {
                        OnlyTopCall: true
                    }
                },
                'call'
            )) as CallNameReturnType;

            // 5.2 - Error or panic present, so decode the revert reason
            if (debuggedClause.output !== undefined) {
                return this.decodeRevertReason(
                    debuggedClause.output,
                    errorFragment
                );
            }
        }

        // No revert reason found
        return null;
    }

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
    public async estimateGas(
        clauses: SimulateTransactionClause[],
        caller?: string,
        options?: EstimateGasOptions
    ): Promise<EstimateGasResult> {
        // Clauses must be an array of clauses with at least one clause
        if (clauses.length <= 0) {
            throw new InvalidDataType(
                'GasModule.estimateGas()',
                'Invalid clauses. Clauses must be an array of clauses with at least one clause.',
                { clauses, caller, options }
            );
        }

        // gasPadding must be a number between (0, 1]
        if (
            options?.gasPadding !== undefined &&
            (options.gasPadding <= 0 || options.gasPadding > 1)
        ) {
            throw new InvalidDataType(
                'GasModule.estimateGas()',
                'Invalid gasPadding. gasPadding must be a number between (0, 1].',
                { gasPadding: options?.gasPadding }
            );
        }

        // Simulate the transaction to get the simulations of each clause
        const simulations = await this.simulateTransaction(clauses, {
            caller,
            ...options
        });

        // If any of the clauses reverted, then the transaction reverted
        const isReverted = simulations.some((simulation) => {
            return simulation.reverted;
        });

        // The intrinsic gas of the transaction
        const intrinsicGas = Number(Transaction.intrinsicGas(clauses).wei);

        // totalSimulatedGas represents the summation of all clauses' gasUsed
        const totalSimulatedGas = simulations.reduce((sum, simulation) => {
            return sum + simulation.gasUsed;
        }, 0);

        // The total gas of the transaction
        // If the transaction involves contract interaction, a constant 15000 gas is added to the total gas
        const totalGas =
            (intrinsicGas +
                (totalSimulatedGas !== 0 ? totalSimulatedGas + 15000 : 0)) *
            (1 + (options?.gasPadding ?? 0)); // Add gasPadding if it is defined

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
    public async executeCall(
        contractAddress: string,
        functionAbi: ABIFunction,
        functionData: unknown[],
        contractCallOptions?: ContractCallOptions
    ): Promise<ContractCallResult> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.simulateTransaction(
            [
                {
                    to: contractAddress,
                    value: '0',
                    data: functionAbi.encodeData(functionData).toString()
                }
            ],
            contractCallOptions
        );

        return this.getContractCallResult(
            response[0].data,
            functionAbi,
            response[0].reverted
        );
    }

    /**
     * Executes and simulates multiple read-only smart-contract clause calls,
     * simulating the transaction to obtain the results.
     *
     * @param {ContractClause[]} clauses - The array of contract clauses to be executed.
     * @param {SimulateTransactionOptions} [options] - Optional simulation transaction settings.
     * @return {Promise<ContractCallResult[]>} - The decoded results of the contract calls.
     */
    public async executeMultipleClausesCall(
        clauses: ContractClause[],
        options?: SimulateTransactionOptions
    ): Promise<ContractCallResult[]> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.simulateTransaction(
            clauses.map((clause) => clause.clause),
            options
        );
        // Returning the decoded results both as plain and array.
        return response.map((res, index) =>
            this.getContractCallResult(
                res.data,
                clauses[index].functionAbi,
                res.reverted
            )
        );
    }

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
    public async executeTransaction(
        signer: VeChainSigner,
        contractAddress: string,
        functionAbi: ABIFunction,
        functionData: unknown[],
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        // Sign the transaction
        const id = await signer.sendTransaction({
            clauses: [
                // Build a clause to interact with the contract function
                Clause.callFunction(
                    Address.of(contractAddress),
                    functionAbi,
                    functionData,
                    VET.of(options?.value ?? 0, Units.wei)
                )
            ],
            gas: options?.gas,
            gasLimit: options?.gasLimit,
            gasPrice: options?.gasPrice,
            gasPriceCoef: options?.gasPriceCoef,
            nonce: options?.nonce,
            value: options?.value,
            dependsOn: options?.dependsOn,
            expiration: options?.expiration,
            chainTag: options?.chainTag,
            blockRef: options?.blockRef
        });

        return {
            id,
            wait: async () => await this.waitForTransaction(id)
        };
    }

    /**
     * Executes a transaction with multiple clauses on the VeChain blockchain.
     *
     * @param {ContractClause[]} clauses - Array of contract clauses to be included in the transaction.
     * @param {VeChainSigner} signer - A VeChain signer instance used to sign and send the transaction.
     * @param {ContractTransactionOptions} [options] - Optional parameters to customize the transaction.
     * @return {Promise<SendTransactionResult>} The result of the transaction, including transaction ID and a wait function.
     */
    public async executeMultipleClausesTransaction(
        clauses: ContractClause[],
        signer: VeChainSigner,
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        const id = await signer.sendTransaction({
            clauses: clauses.map((clause) => clause.clause),
            gas: options?.gas,
            gasLimit: options?.gasLimit,
            gasPrice: options?.gasPrice,
            gasPriceCoef: options?.gasPriceCoef,
            nonce: options?.nonce,
            value: options?.value,
            dependsOn: options?.dependsOn,
            expiration: options?.expiration,
            chainTag: options?.chainTag,
            blockRef: options?.blockRef
        });

        return {
            id,
            wait: async () => await this.waitForTransaction(id)
        };
    }

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
    public async getBaseGasPrice(): Promise<ContractCallResult> {
        return await this.executeCall(
            BUILT_IN_CONTRACTS.PARAMS_ADDRESS,
            ABIContract.ofAbi(BUILT_IN_CONTRACTS.PARAMS_ABI).getFunction('get'),
            [dataUtils.encodeBytes32String('base-gas-price', 'left')]
        );
    }

    /**
     * Decode the result of a contract call from the result of a simulated transaction.
     *
     * @param {string} encodedData - The encoded data received from the contract call.
     * @param {ABIFunction} functionAbi - The ABI function definition used for decoding the result.
     * @param {boolean} reverted - Indicates if the contract call reverted.
     * @return {ContractCallResult} An object containing the success status and the decoded result.
     */
    private getContractCallResult(
        encodedData: string,
        functionAbi: ABIFunction,
        reverted: boolean
    ): ContractCallResult {
        if (reverted) {
            const errorMessage = decodeRevertReason(encodedData) ?? '';
            return {
                success: false,
                result: {
                    errorMessage
                }
            };
        }

        // Returning the decoded result both as plain and array.
        const encodedResult = Hex.of(encodedData);
        const plain = functionAbi.decodeResult(encodedResult);
        const array = functionAbi.decodeOutputAsArray(encodedResult);
        return {
            success: true,
            result: {
                plain,
                array
            }
        };
    }
}

export { TransactionsModule };
