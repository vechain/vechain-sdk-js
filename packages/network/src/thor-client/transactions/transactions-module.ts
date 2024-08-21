import { InvalidDataType, InvalidTransactionField } from '@vechain/sdk-errors';
import { blocksFormatter, getTransactionIndexIntoBlock } from '../../provider';
import {
    buildQuery,
    ERROR_SELECTOR,
    PANIC_SELECTOR,
    Poll,
    thorest,
    vnsUtils
} from '../../utils';
import {
    Hex,
    ThorId,
    TransactionHandler,
    abi,
    Revision,
    vechain_sdk_core_ethers,
    type Transaction,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
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
import { type ThorClient } from '../thor-client';
import { type ExpandedBlockDetail } from '../blocks';
import { type CallNameReturnType } from '../debug';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

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

        return (await this.thor.httpClient.http(
            'GET',
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

        return (await this.thor.httpClient.http(
            'GET',
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

        return (await this.thor.httpClient.http(
            'GET',
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
            TransactionHandler.decode(Buffer.from(raw.slice(2), 'hex'), true);
        } catch (error) {
            throw new InvalidDataType(
                'TransactionsModule.sendRawTransaction()',
                'Sending failed: Input must be a valid raw transaction in hex format. Decoding error encountered.',
                { raw },
                error
            );
        }

        const transactionResult = (await this.thor.httpClient.http(
            'POST',
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
            async () =>
                await this.thor.transactions.getTransactionReceipt(txID),
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
        const genesisBlock = await this.thor.blocks.getBlockCompressed(0);
        if (genesisBlock === null)
            throw new InvalidTransactionField(
                'TransactionsModule.buildTransactionBody()',
                'Error while building transaction body: Cannot get genesis block.',
                { fieldName: 'genesisBlock', genesisBlock, clauses, options }
            );

        const blockRef =
            options?.blockRef ?? (await this.thor.blocks.getBestBlockRef());
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
        const addresses = await vnsUtils.resolveNames(this.thor, nameList);

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

        return (await this.thor.httpClient.http(
            'POST',
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
            return abi.decode<string>(
                'string',
                `0x${encodedRevertReason.slice(ERROR_SELECTOR.length)}`
            );
        // Panic selector
        else if (encodedRevertReason.startsWith(PANIC_SELECTOR)) {
            const decoded = abi.decode<string>(
                'uint256',
                `0x${encodedRevertReason.slice(PANIC_SELECTOR.length)}`
            );
            return `Panic(0x${parseInt(decoded).toString(16).padStart(2, '0')})`;
        }

        // Solidity error
        else {
            // An error fragment is provided, so decode the revert reason using solidity error
            if (errorFragment !== undefined) {
                const errorInterface = new vechain_sdk_core_ethers.Interface([
                    vechain_sdk_core_ethers.ErrorFragment.from(errorFragment)
                ]);
                return errorInterface
                    .decodeErrorResult(
                        vechain_sdk_core_ethers.ErrorFragment.from(
                            errorFragment
                        ),
                        encodedRevertReason
                    )
                    .toArray()[0] as string;
            }
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
        const blocksModule = this.thor.blocks;
        const debugModule = this.thor.debug;

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
                        blockID: block.id,
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
}

export { TransactionsModule };
