"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const ethers_1 = require("ethers");
const http_1 = require("../../http");
const provider_1 = require("../../provider");
const utils_1 = require("../../utils");
const decode_evm_error_1 = require("../gas/helpers/decode-evm-error");
/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    blocksModule;
    debugModule;
    logsModule;
    gasModule;
    forkDetector;
    constructor(blocksModule, debugModule, logsModule, gasModule, forkDetector) {
        this.blocksModule = blocksModule;
        this.debugModule = debugModule;
        this.logsModule = logsModule;
        this.gasModule = gasModule;
        this.forkDetector = forkDetector;
    }
    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     * @throws {InvalidDataType}
     */
    async getTransaction(id, options) {
        // Invalid transaction ID
        if (!sdk_core_1.ThorId.isValid(id)) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.getTransaction()', 'Invalid transaction ID given as input. Input must be an hex string of length 64.', { id });
        }
        // Invalid head
        if (options?.head !== undefined && !sdk_core_1.ThorId.isValid(options.head))
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.getTransaction()', 'Invalid head given as input. Input must be an hex string of length 64.', { head: options?.head });
        return (await this.blocksModule.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.transactions.get.TRANSACTION(id), {
            query: (0, utils_1.buildQuery)({
                raw: false,
                head: options?.head,
                pending: options?.pending
            })
        }));
    }
    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     * @throws {InvalidDataType}
     */
    async getTransactionRaw(id, options) {
        // Invalid transaction ID
        if (!sdk_core_1.ThorId.isValid(id)) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.getTransactionRaw()', 'Invalid transaction ID given as input. Input must be an hex string of length 64.', { id });
        }
        // Invalid head
        if (options?.head !== undefined && !sdk_core_1.ThorId.isValid(options.head))
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.getTransaction()', 'Invalid head given as input. Input must be an hex string of length 64.', { head: options?.head });
        return (await this.blocksModule.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.transactions.get.TRANSACTION(id), {
            query: (0, utils_1.buildQuery)({
                raw: true,
                head: options?.head,
                pending: options?.pending
            })
        }));
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
    async getTransactionReceipt(id, options) {
        // Invalid transaction ID
        if (!sdk_core_1.ThorId.isValid(id)) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.getTransactionReceipt()', 'Invalid transaction ID given as input. Input must be an hex string of length 64.', { id });
        }
        // Invalid head
        if (options?.head !== undefined && !sdk_core_1.ThorId.isValid(options.head))
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.getTransaction()', 'Invalid head given as input. Input must be an hex string of length 64.', { head: options?.head });
        try {
            return (await this.blocksModule.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.transactions.get.TRANSACTION_RECEIPT(id), {
                query: (0, utils_1.buildQuery)({ head: options?.head })
            }));
        }
        catch (error) {
            // Check if this is a network communication error
            if (error instanceof sdk_errors_1.HttpNetworkError) {
                // For network errors, return null instead of throwing
                // This allows the polling mechanism to continue
                return null;
            }
            throw error;
        }
    }
    /**
     * Retrieves the receipt of a transaction.
     *
     * @param raw - The raw transaction.
     * @returns The transaction id of send transaction.
     * @throws {InvalidDataType}
     */
    async sendRawTransaction(raw) {
        // Validate raw transaction
        if (!sdk_core_1.Hex.isValid0x(raw)) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.sendRawTransaction()', 'Sending failed: Input must be a valid raw transaction in hex format.', { raw });
        }
        // Decode raw transaction to check if raw is ok
        try {
            sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(raw.slice(2)).bytes, true);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.sendRawTransaction()', 'Sending failed: Input must be a valid raw transaction in hex format. Decoding error encountered.', { raw }, error);
        }
        const transactionResult = (await this.blocksModule.httpClient.http(http_1.HttpMethod.POST, utils_1.thorest.transactions.post.TRANSACTION(), {
            body: { raw }
        }));
        return {
            id: transactionResult.id,
            wait: async (options) => await this.waitForTransaction(transactionResult.id, options)
        };
    }
    /**
     * Sends a signed transaction to the network.
     *
     * @param signedTx - the transaction to send. It must be signed.
     * @returns A promise that resolves to the transaction ID of the sent transaction.
     * @throws {InvalidDataType}
     */
    async sendTransaction(signedTx) {
        // Assert transaction is signed or not
        if (!signedTx.isSigned) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.sendTransaction()', 'Invalid transaction given as input. Transaction must be signed.', { signedTx });
        }
        const rawTx = sdk_core_1.Hex.of(signedTx.encoded).toString();
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
    async waitForTransaction(txID, options) {
        // Invalid transaction ID
        if (!sdk_core_1.ThorId.isValid(txID)) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.waitForTransaction()', 'Invalid transaction ID given as input. Input must be an hex string of length 64.', { txID });
        }
        // If no timeout is specified, use default timeout of 30 seconds
        const timeoutMs = options?.timeoutMs ?? 30000;
        const intervalMs = options?.intervalMs ?? 1000;
        const startTime = Date.now();
        const deadline = startTime + timeoutMs;
        while (true) {
            // Check if timeout has been reached
            if (Date.now() >= deadline) {
                return null;
            }
            // Try to get the transaction receipt
            const receipt = await this.getTransactionReceipt(txID).catch(() => null);
            if (receipt !== null) {
                return receipt;
            }
            // Wait for the specified interval before trying again
            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }
    }
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
    async buildTransactionBody(clauses, gas, options) {
        // Get the genesis block to get the chainTag
        const genesisBlock = await this.blocksModule.getBlockCompressed(0);
        if (genesisBlock === null)
            throw new sdk_errors_1.InvalidTransactionField('TransactionsModule.buildTransactionBody()', 'Error while building transaction body: Cannot get genesis block.', { fieldName: 'genesisBlock', genesisBlock, clauses, options });
        const blockRef = options?.blockRef ?? (await this.blocksModule.getBestBlockRef());
        if (blockRef === null)
            throw new sdk_errors_1.InvalidTransactionField('TransactionsModule.buildTransactionBody()', 'Error while building transaction body: Cannot get blockRef.', { fieldName: 'blockRef', blockRef, clauses, options });
        const chainTag = options?.chainTag ?? Number(`0x${genesisBlock.id.slice(-2)}`);
        const filledOptions = await this.fillDefaultBodyOptions(options);
        // Process clauses - handle different clause types properly
        let processedClauses;
        if (Array.isArray(clauses)) {
            // This is a TransactionClause[] or Clause[] - convert to TransactionClause[]
            processedClauses = clauses.map((clause) => ({
                to: clause.to,
                data: clause.data,
                value: clause.value
            }));
        }
        else {
            // Single TransactionClause or Clause
            processedClauses = [
                {
                    to: clauses.to,
                    data: clauses.data,
                    value: clauses.value
                }
            ];
        }
        return {
            blockRef,
            chainTag,
            clauses: await this.resolveNamesInClauses(processedClauses),
            dependsOn: options?.dependsOn ?? null,
            expiration: options?.expiration ?? 32,
            gas: options?.gas !== undefined ? Number(options.gas) : gas,
            gasPriceCoef: filledOptions?.gasPriceCoef,
            maxFeePerGas: filledOptions?.maxFeePerGas,
            maxPriorityFeePerGas: filledOptions?.maxPriorityFeePerGas,
            nonce: options?.nonce ?? sdk_core_1.Hex.random(8).toString(),
            reserved: options?.isDelegated === true ? { features: 1 } : undefined
        };
    }
    /**
     * Fills the transaction body with the default options.
     *
     * @param body - The transaction body to fill.
     * @returns A promise that resolves to the filled transaction body.
     * @throws {InvalidDataType}
     */
    async fillTransactionBody(body) {
        const extractedOptions = {
            maxFeePerGas: body.maxFeePerGas,
            maxPriorityFeePerGas: body.maxPriorityFeePerGas,
            gasPriceCoef: body.gasPriceCoef
        };
        const filledOptions = await this.fillDefaultBodyOptions(extractedOptions);
        return {
            ...body,
            ...filledOptions
        };
    }
    /**
     * Fills the default body options for a transaction.
     *
     * @param options - The transaction body options to fill.
     * @returns A promise that resolves to the filled transaction body options.
     * @throws {InvalidDataType}
     */
    async fillDefaultBodyOptions(options) {
        options ??= {};
        // Check for invalid parameter combinations first
        const hasMaxFeePerGas = options.maxFeePerGas !== undefined;
        const hasMaxPriorityFeePerGas = options.maxPriorityFeePerGas !== undefined;
        const hasGasPriceCoef = options.gasPriceCoef !== undefined;
        // Case 3: maxPriorityFeePerGas + gasPriceCoef (error)
        if (hasMaxPriorityFeePerGas && hasGasPriceCoef && !hasMaxFeePerGas) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.fillDefaultBodyOptions()', 'Invalid parameter combination: maxPriorityFeePerGas and gasPriceCoef cannot be used together without maxFeePerGas.', { options });
        }
        // Case 4: maxFeePerGas + gasPriceCoef (error)
        if (hasMaxFeePerGas && hasGasPriceCoef && !hasMaxPriorityFeePerGas) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.fillDefaultBodyOptions()', 'Invalid parameter combination: maxFeePerGas and gasPriceCoef cannot be used together without maxPriorityFeePerGas.', { options });
        }
        // Case 1: maxPriorityFeePerGas + maxFeePerGas + gasPriceCoef (only 1 and 2 are used)
        if (hasMaxPriorityFeePerGas && hasMaxFeePerGas && hasGasPriceCoef) {
            options.gasPriceCoef = undefined;
            // Continue with dynamic fee processing below
        }
        else if (hasMaxPriorityFeePerGas && hasMaxFeePerGas) {
            // Case 2: maxPriorityFeePerGas + maxFeePerGas (1 and 2 are used)
            options.gasPriceCoef = undefined;
            // Continue with dynamic fee processing below
        }
        else if (hasGasPriceCoef &&
            !hasMaxPriorityFeePerGas &&
            !hasMaxFeePerGas) {
            // Case 5: gasPriceCoef only (3 is used - legacy transaction)
            options.maxFeePerGas = undefined;
            options.maxPriorityFeePerGas = undefined;
            return options;
        }
        // check if fork happened
        const galacticaHappened = await this.forkDetector.isGalacticaForked('best');
        if (!galacticaHappened &&
            (hasMaxFeePerGas || hasMaxPriorityFeePerGas)) {
            // user has specified dynamic fee tx, but fork didn't happen yet
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.fillDefaultBodyOptions()', 'Invalid transaction body options. Dynamic fee tx is not allowed before Galactica fork.', { options });
        }
        if (!galacticaHappened && !hasGasPriceCoef) {
            // galactica hasn't happened yet, default is legacy fee
            options.gasPriceCoef = 0;
            return options;
        }
        if (galacticaHappened && hasMaxFeePerGas && hasMaxPriorityFeePerGas) {
            // galactica happened, user specified new fee type
            return options;
        }
        // default to dynamic fee tx
        options.gasPriceCoef = undefined;
        // Get next block base fee per gas
        const biNextBlockBaseFeePerGas = await this.gasModule.getNextBlockBaseFeePerGas();
        if (biNextBlockBaseFeePerGas === null ||
            biNextBlockBaseFeePerGas === undefined) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.fillDefaultBodyOptions()', 'Invalid transaction body options. Unable to get next block base fee per gas.', { options });
        }
        // set maxPriorityFeePerGas if not specified already
        if (options.maxPriorityFeePerGas === undefined ||
            options.maxPriorityFeePerGas === null) {
            // Calculate maxPriorityFeePerGas based on fee history (75th percentile)
            // and the HIGH speed threshold (min(0.046*baseFee, 75_percentile))
            const defaultMaxPriorityFeePerGas = await this.calculateDefaultMaxPriorityFeePerGas(biNextBlockBaseFeePerGas);
            options.maxPriorityFeePerGas = defaultMaxPriorityFeePerGas;
        }
        // set maxFeePerGas if not specified already
        if (options.maxFeePerGas === undefined ||
            options.maxFeePerGas === null) {
            // compute maxFeePerGas
            const biMaxPriorityFeePerGas = sdk_core_1.HexUInt.of(options.maxPriorityFeePerGas).bi;
            // maxFeePerGas = 1.12 * baseFeePerGas + maxPriorityFeePerGas
            const biMaxFeePerGas = (112n * biNextBlockBaseFeePerGas) / 100n +
                biMaxPriorityFeePerGas;
            options.maxFeePerGas = sdk_core_1.HexUInt.of(biMaxFeePerGas).toString();
        }
        return options;
    }
    /**
     * Calculates the default max priority fee per gas based on the current base fee
     * and historical 75th percentile rewards.
     *
     * Uses the FAST (HIGH) speed threshold: min(0.046*baseFee, 75_percentile)
     *
     * @param baseFee - The current base fee per gas
     * @returns A promise that resolves to the default max priority fee per gas as a hex string
     */
    async calculateDefaultMaxPriorityFeePerGas(baseFee) {
        // Get fee history for recent blocks
        const feeHistory = await this.gasModule.getFeeHistory({
            blockCount: 10,
            newestBlock: 'best',
            rewardPercentiles: [25, 50, 75] // Get 25th, 50th and 75th percentiles
        });
        // Get the 75th percentile reward from the most recent block
        let percentile75;
        if (feeHistory.reward !== null &&
            feeHistory.reward !== undefined &&
            feeHistory.reward.length > 0) {
            const latestBlockRewards = feeHistory.reward[feeHistory.reward.length - 1];
            const equalRewardsOnLastBlock = new Set(latestBlockRewards).size === 3;
            // If rewards are equal in the last block, use the first one (75th percentile)
            // Otherwise, calculate the average of 75th percentiles across blocks
            if (equalRewardsOnLastBlock) {
                percentile75 = sdk_core_1.HexUInt.of(latestBlockRewards[2]).bi; // 75th percentile at index 2
            }
            else {
                // Calculate average of 75th percentiles across blocks
                let sum = 0n;
                let count = 0;
                for (const blockRewards of feeHistory.reward) {
                    if (blockRewards.length !== null &&
                        blockRewards.length > 2 &&
                        blockRewards[2] !== null &&
                        blockRewards[2] !== undefined) {
                        sum += sdk_core_1.HexUInt.of(blockRewards[2]).bi;
                        count++;
                    }
                }
                percentile75 = count > 0 ? sum / BigInt(count) : 0n;
            }
        }
        else {
            // Fallback to getMaxPriorityFeePerGas if fee history is not available
            percentile75 = sdk_core_1.HexUInt.of(await this.gasModule.getMaxPriorityFeePerGas()).bi;
        }
        // Calculate 4.6% of base fee (HIGH speed threshold)
        const baseFeeCap = (baseFee * 46n) / 1000n; // 0.046 * baseFee
        // Use the minimum of the two values
        const priorityFee = baseFeeCap < percentile75 ? baseFeeCap : percentile75;
        return sdk_core_1.HexUInt.of(priorityFee).toString();
    }
    /**
     * Ensures that names in clauses are resolved to addresses
     *
     * @param clauses - The clauses of the transaction.
     * @returns A promise that resolves to clauses with resolved addresses
     */
    async resolveNamesInClauses(clauses) {
        // find unique names in the clause list
        const uniqueNames = clauses.reduce((map, clause) => {
            if (typeof clause.to === 'string' &&
                !map.has(clause.to) &&
                clause.to.includes('.')) {
                map.set(clause.to, clause.to);
            }
            return map;
        }, new Map());
        const nameList = [...uniqueNames.keys()];
        // no names, return the original clauses
        if (uniqueNames.size === 0) {
            return clauses;
        }
        // resolve the names to addresses
        const addresses = await utils_1.vnsUtils.resolveNames(this.blocksModule, this, nameList);
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
    async simulateTransaction(clauses, options) {
        const { revision, caller, gasPrice, gasPayer, gas, blockRef, expiration, provedWork } = options ?? {};
        if (revision !== undefined &&
            revision !== null &&
            !sdk_core_1.Revision.isValid(revision.toString())) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.simulateTransaction()', 'Invalid revision given as input. Input must be a valid revision (i.e., a block number or block ID).', { revision });
        }
        return (await this.blocksModule.httpClient.http(http_1.HttpMethod.POST, utils_1.thorest.accounts.post.SIMULATE_TRANSACTION(revision?.toString()), {
            query: (0, utils_1.buildQuery)({ revision: revision?.toString() }),
            body: {
                clauses: await this.resolveNamesInClauses(clauses.map((clause) => {
                    return {
                        to: clause.to,
                        data: clause.data,
                        value: BigInt(clause.value).toString()
                    };
                })),
                gas,
                gasPrice,
                caller,
                provedWork,
                gasPayer,
                expiration,
                blockRef
            }
        }));
    }
    /**
     * Decode the revert reason from the encoded revert reason into a transaction.
     *
     * @param encodedRevertReason - The encoded revert reason to decode.
     * @param errorFragment - (Optional) The error fragment to use to decode the revert reason (For Solidity custom errors).
     * @returns A promise that resolves to the decoded revert reason.
     * Revert reason can be a string error or Panic(error_code)
     */
    decodeRevertReason(encodedRevertReason, errorFragment) {
        // Error selector
        if (encodedRevertReason.startsWith(utils_1.ERROR_SELECTOR))
            return sdk_core_1.ABI.ofEncoded('string', `0x${encodedRevertReason.slice(utils_1.ERROR_SELECTOR.length)}`).getFirstDecodedValue();
        // Panic selector
        else if (encodedRevertReason.startsWith(utils_1.PANIC_SELECTOR)) {
            const decoded = sdk_core_1.ABI.ofEncoded('uint256', `0x${encodedRevertReason.slice(utils_1.PANIC_SELECTOR.length)}`).getFirstDecodedValue();
            return `Panic(0x${parseInt(decoded).toString(16).padStart(2, '0')})`;
        }
        // Solidity error, an error fragment is provided, so decode the revert reason using solidity error
        else if (errorFragment !== undefined) {
            const errorInterface = new ethers_1.Interface([
                ethers_1.ErrorFragment.from(errorFragment)
            ]);
            return errorInterface
                .decodeErrorResult(ethers_1.ErrorFragment.from(errorFragment), encodedRevertReason)
                .toArray()[0];
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
    async getRevertReason(transactionHash, errorFragment) {
        // 1 - Init Blocks and Debug modules
        const blocksModule = this.blocksModule;
        const debugModule = this.debugModule;
        // 2 - Get the transaction details
        const transaction = await this.getTransaction(transactionHash);
        // 3 - Get the block details (to get the transaction index)
        const block = transaction !== null
            ? (await blocksModule.getBlockExpanded(transaction.meta.blockID))
            : null;
        // Block or transaction not found
        if (block === null || transaction === null)
            return null;
        // 4 - Get the transaction index into the block (we know the transaction is in the block)
        const transactionIndex = (0, provider_1.getTransactionIndexIntoBlock)(provider_1.blocksFormatter.formatToRPCStandard(block, ''), transactionHash);
        // 5 - Get the error or panic reason. By iterating over the clauses of the transaction
        for (let transactionClauseIndex = 0; transactionClauseIndex < transaction.clauses.length; transactionClauseIndex++) {
            // 5.1 - Debug the clause
            const debuggedClause = (await debugModule.traceTransactionClause({
                target: {
                    blockId: sdk_core_1.ThorId.of(block.id),
                    transaction: transactionIndex,
                    clauseIndex: transactionClauseIndex
                },
                // Optimized for top call
                config: {
                    OnlyTopCall: true
                }
            }, 'call'));
            // 5.2 - Error or panic present, so decode the revert reason
            if (debuggedClause.output !== undefined) {
                return this.decodeRevertReason(debuggedClause.output, errorFragment);
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
    async estimateGas(clauses, caller, options) {
        // Normalize to SimulateTransactionClause[]
        const clausesToEstimate = clauses.map((clause) => {
            if (clause === undefined) {
                throw new sdk_errors_1.InvalidDataType('TransactionsModule.estimateGas()', 'Invalid ContractClause provided: missing inner clause.', { clause });
            }
            if ('clause' in clause) {
                return clause.clause;
            }
            return clause;
        });
        // Validate the normalized set is non-empty
        if (clausesToEstimate.length === 0) {
            throw new sdk_errors_1.InvalidDataType('TransactionsModule.estimateGas()', 'Invalid clauses. Clauses must be an array with at least one clause.', { clauses, caller, options });
        }
        // gasPadding must be a number between (0, 1]
        if (options?.gasPadding !== undefined &&
            (options.gasPadding <= 0 || options.gasPadding > 1)) {
            throw new sdk_errors_1.InvalidDataType('GasModule.estimateGas()', 'Invalid gasPadding. gasPadding must be a number between (0, 1].', { gasPadding: options?.gasPadding });
        }
        // Simulate the transaction to get the simulations of each clause
        const simulations = await this.simulateTransaction(clausesToEstimate, {
            caller,
            ...options
        });
        // If any of the clauses reverted, then the transaction reverted
        const isReverted = simulations.some((simulation) => {
            return simulation.reverted;
        });
        // The intrinsic gas of the transaction
        const intrinsicGas = Number(sdk_core_1.Transaction.intrinsicGas(clausesToEstimate).wei);
        // totalSimulatedGas represents the summation of all clauses' gasUsed
        const totalSimulatedGas = simulations.reduce((sum, simulation) => {
            return sum + simulation.gasUsed;
        }, 0);
        // The total gas of the transaction
        // If the transaction involves contract interaction, a constant 15000 gas is added to the total gas
        const totalGas = Math.ceil((intrinsicGas +
            (totalSimulatedGas !== 0 ? totalSimulatedGas + 15000 : 0)) *
            (1 + (options?.gasPadding ?? 0))); // Add gasPadding if it is defined
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
                    return (0, decode_evm_error_1.decodeRevertReason)(simulation.data) ?? '';
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
    async executeCall(contractAddress, functionAbi, functionData, contractCallOptions) {
        // Simulate the transaction to get the result of the contract call
        const response = await this.simulateTransaction([
            {
                to: contractAddress,
                value: '0',
                data: functionAbi.encodeData(functionData).toString()
            }
        ], contractCallOptions);
        return this.getContractCallResult(response[0].data, functionAbi, response[0].reverted);
    }
    /**
     * Executes and simulates multiple read-only smart-contract clause calls,
     * simulating the transaction to obtain the results.
     *
     * @param {ContractClause[]} clauses - The array of contract clauses to be executed.
     * @param {SimulateTransactionOptions} [options] - Optional simulation transaction settings.
     * @return {Promise<ContractCallResult[]>} - The decoded results of the contract calls.
     */
    async executeMultipleClausesCall(clauses, options) {
        // Simulate the transaction to get the result of the contract call
        const response = await this.simulateTransaction(clauses.map((clause) => {
            if (clause.clause === undefined) {
                throw new sdk_errors_1.InvalidDataType('TransactionsModule.executeMultipleClausesCall()', 'Invalid ContractClause provided: missing inner clause.', { clause });
            }
            return clause.clause;
        }), options);
        // Returning the decoded results both as plain and array.
        return response.map((res, index) => this.getContractCallResult(res.data, clauses[index].functionAbi, res.reverted));
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
    async executeTransaction(signer, contractAddress, functionAbi, functionData, options) {
        // Sign the transaction
        const id = await signer.sendTransaction({
            clauses: [
                // Build a clause to interact with the contract function
                sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(contractAddress), functionAbi, functionData, sdk_core_1.VET.of(options?.value ?? 0, sdk_core_1.Units.wei))
            ],
            gas: options?.gas,
            gasLimit: options?.gasLimit,
            gasPrice: options?.gasPrice,
            gasPriceCoef: options?.gasPriceCoef,
            maxFeePerGas: options?.maxFeePerGas,
            maxPriorityFeePerGas: options?.maxPriorityFeePerGas,
            nonce: options?.nonce,
            value: options?.value,
            dependsOn: options?.dependsOn,
            expiration: options?.expiration,
            chainTag: options?.chainTag,
            blockRef: options?.blockRef,
            delegationUrl: options?.delegationUrl,
            comment: options?.comment
        });
        return {
            id,
            wait: async (options) => await this.waitForTransaction(id, options)
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
    async executeMultipleClausesTransaction(clauses, signer, options) {
        const id = await signer.sendTransaction({
            clauses: clauses.map((clause) => {
                if (clause === undefined) {
                    throw new sdk_errors_1.InvalidDataType('TransactionsModule.executeMultipleClausesTransaction()', 'Invalid ContractClause[] | TransactionClause[] provided: missing clause.', { clause });
                }
                if ('clause' in clause) {
                    return clause.clause;
                }
                return clause;
            }),
            gas: options?.gas,
            gasLimit: options?.gasLimit,
            gasPrice: options?.gasPrice,
            gasPriceCoef: options?.gasPriceCoef,
            maxFeePerGas: options?.maxFeePerGas,
            maxPriorityFeePerGas: options?.maxPriorityFeePerGas,
            nonce: options?.nonce,
            value: options?.value,
            dependsOn: options?.dependsOn,
            expiration: options?.expiration,
            chainTag: options?.chainTag,
            blockRef: options?.blockRef,
            delegationUrl: options?.delegationUrl,
            comment: options?.comment
        });
        return {
            id,
            wait: async (options) => await this.waitForTransaction(id, options)
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
    async getLegacyBaseGasPrice() {
        return await this.executeCall(utils_1.BUILT_IN_CONTRACTS.PARAMS_ADDRESS, sdk_core_1.ABIContract.ofAbi(utils_1.BUILT_IN_CONTRACTS.PARAMS_ABI).getFunction('get'), [sdk_core_1.dataUtils.encodeBytes32String('base-gas-price', 'left')]);
    }
    /**
     * Decode the result of a contract call from the result of a simulated transaction.
     *
     * @param {string} encodedData - The encoded data received from the contract call.
     * @param {ABIFunction} functionAbi - The ABI function definition used for decoding the result.
     * @param {boolean} reverted - Indicates if the contract call reverted.
     * @return {ContractCallResult} An object containing the success status and the decoded result.
     */
    getContractCallResult(encodedData, functionAbi, reverted) {
        if (reverted) {
            const errorMessage = (0, decode_evm_error_1.decodeRevertReason)(encodedData) ?? '';
            return {
                success: false,
                result: {
                    errorMessage
                }
            };
        }
        // Returning the decoded result both as plain and array.
        const encodedResult = sdk_core_1.Hex.of(encodedData);
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
exports.TransactionsModule = TransactionsModule;
