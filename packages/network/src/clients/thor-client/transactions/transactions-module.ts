import {
    type Transaction,
    assertIsSignedTransaction,
    assertValidTransactionID,
    type TransactionClause,
    dataUtils,
    type TransactionBody
} from '@vechainfoundation/vechain-sdk-core';
import { Poll } from '../../../utils';
import { type TransactionReceipt } from '../../thorest-client';
import {
    type TransactionBodyOptions,
    type SendTransactionResult,
    type WaitForTransactionOptions
} from './types';
import { randomBytes } from 'crypto';
import { TRANSACTION, buildError } from '@vechainfoundation/vechain-sdk-errors';
import { type ThorClient } from '../thor-client';

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

        return await this.thor.thorest.transactions.sendTransaction(rawTx);
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
                await this.thor.thorest.transactions.getTransactionReceipt(
                    txID
                ),
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
}

export { TransactionsModule };
