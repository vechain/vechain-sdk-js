import {
    type Transaction,
    assertIsSignedTransaction,
    assertValidTransactionID,
    type TransactionClause,
    dataUtils,
    type TransactionBody
} from '@vechainfoundation/vechain-sdk-core';
import { Poll, buildQuery, thorest } from '../../utils';
import {
    type TransactionReceipt,
    type TransactionBodyOptions,
    type SendTransactionResult,
    type WaitForTransactionOptions,
    type GetTransactionInputOptions,
    type TransactionDetail,
    type GetTransactionReceiptInputOptions,
    type TransactionSendResult,
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type TransactionSimulationResult
} from './types';
import { randomBytes } from 'crypto';
import {
    TRANSACTION,
    buildError,
    DATA,
    assert
} from '@vechainfoundation/vechain-sdk-errors';
import { type ThorClient } from '../thor-client';
import {
    assertValidTransactionHead,
    TransactionHandler,
    revisionUtils
} from '@vechainfoundation/vechain-sdk-core';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Retrieves the details of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to the details of the transaction.
     */
    public async getTransaction(
        id: string,
        options?: GetTransactionInputOptions
    ): Promise<TransactionDetail | null> {
        // Invalid transaction ID
        assertValidTransactionID(id);

        // Invalid head
        assertValidTransactionHead(options?.head);

        return (await this.thor.httpClient.http(
            'GET',
            thorest.transactions.get.TRANSACTION(id),
            {
                query: buildQuery({
                    raw: options?.raw,
                    head: options?.head,
                    options: options?.pending
                })
            }
        )) as TransactionDetail | null;
    }

    /**
     * Retrieves the receipt of a transaction.
     *
     * @param id - Transaction ID of the transaction to retrieve.
     * @param options - (Optional) Other optional parameters for the request.
     *                  If `head` is not specified, the receipt of the transaction at the best block is returned.
     * @returns A promise that resolves to the receipt of the transaction.
     */
    public async getTransactionReceipt(
        id: string,
        options?: GetTransactionReceiptInputOptions
    ): Promise<TransactionReceipt | null> {
        // Invalid transaction ID
        assertValidTransactionID(id);

        // Invalid head
        assertValidTransactionHead(options?.head);

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
     */
    public async sendRawTransaction(
        raw: string
    ): Promise<TransactionSendResult> {
        // Validate raw transaction
        assert(
            dataUtils.isHexString(raw),
            DATA.INVALID_DATA_TYPE,
            'Sending failed: Input must be a valid raw transaction in hex format.',
            { raw }
        );

        // Decode raw transaction to check if raw is ok
        try {
            TransactionHandler.decode(Buffer.from(raw.slice(2), 'hex'), true);
        } catch (error) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Sending failed: Input must be a valid raw transaction in hex format. Decoding error encountered.',

                { raw },
                error
            );
        }

        return (await this.thor.httpClient.http(
            'POST',
            thorest.transactions.post.TRANSACTION(),
            {
                body: { raw }
            }
        )) as TransactionSendResult;
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

        return await this.sendRawTransaction(rawTx);
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
        const genesisBlock = await this.thor.blocks.getBlock(0);

        if (genesisBlock === null)
            throw buildError(
                TRANSACTION.INVALID_TRANSACTION_BODY,
                "Error while building transaction body: can't get genesis block",
                { clauses, options }
            );

        // The constant part of the transaction body
        const constTxBody = {
            nonce: `0x${dataUtils.toHexString(randomBytes(8))}`,
            expiration: options?.expiration ?? 32,
            clauses,
            gasPriceCoef: options?.gasPriceCoef ?? 127,
            gas,
            dependsOn: options?.dependsOn ?? null,
            reserved:
                options?.isDelegated === true ? { features: 1 } : undefined
        };

        const latestBlockRef = await this.thor.blocks.getBestBlockRef();

        if (latestBlockRef === null)
            throw buildError(
                TRANSACTION.INVALID_TRANSACTION_BODY,
                "Error while building transaction body: can't get latest block",
                { clauses, options }
            );

        return {
            ...constTxBody,
            chainTag: Number(`0x${genesisBlock.id.slice(64)}`), // Last byte of the genesis block ID which is used to identify a network (chainTag)
            blockRef: latestBlockRef
        };
    }

    /**
     * Simulates the execution of a transaction.
     * Allows to estimate the gas cost of a transaction without sending it, as well as to retrieve the return value(s) of the transaction.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param options - (Optional) The options for simulating the transaction.
     *
     * @returns A promise that resolves to an array of simulation results.
     *          Each element of the array represents the result of simulating a clause.
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
        assert(
            revision === undefined ||
                revision === null ||
                revisionUtils.isRevisionAccount(revision),
            DATA.INVALID_DATA_TYPE,
            'Invalid revision given as input. Input must be a valid revision (i.e., a block number or block ID).',
            { revision }
        );

        return (await this.thor.httpClient.http(
            'POST',
            thorest.accounts.post.SIMULATE_TRANSACTION(revision),
            {
                query: buildQuery({ revision }),
                body: {
                    clauses: clauses.map((clause) => {
                        return {
                            ...clause,
                            value: BigInt(clause.value).toString()
                        };
                    }),
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
}

export { TransactionsModule };
