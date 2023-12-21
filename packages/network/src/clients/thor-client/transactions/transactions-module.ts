import {
    Transaction,
    assertIsSignedTransaction,
    assertValidTransactionID,
    type TransactionClause,
    dataUtils,
    type TransactionBody,
    addressUtils,
    secp256k1,
    TransactionHandler
} from '@vechainfoundation/vechain-sdk-core';
import { Poll } from '../../../utils';
import {
    type ThorestClient,
    type TransactionReceipt
} from '../../thorest-client';
import {
    type TransactionBodyOptions,
    type SendTransactionResult,
    type WaitForTransactionOptions,
    type SignTransactionOptions
} from './types';
import { randomBytes } from 'crypto';
import {
    TRANSACTION,
    assert,
    buildError
} from '@vechainfoundation/vechain-sdk-errors';
import { getDelegationSignature } from './helpers/delegation-handler';
import { assertTransactionCanBeSigned } from './helpers/assertions';

/**
 * The `TransactionsModule` handles transaction related operations and provides
 * convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Initializes a new instance of the `Thorest` class.
     * @param thorest - The Thorest instance used to interact with the vechain Thorest blockchain API.
     */
    constructor(readonly thorest: ThorestClient) {}

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

        return await this.thorest.transactions.sendTransaction(rawTx);
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
                await this.thorest.transactions.getTransactionReceipt(txID),
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
        const genesisBlock = await this.thorest.blocks.getBlock(0);

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

        const latestBlock = await this.thorest.blocks.getBestBlock();

        if (latestBlock === null)
            throw buildError(
                TRANSACTION.INVALID_TRANSACTION_BODY,
                "Error while building transaction body: can't get latest block",
                { clauses, options }
            );

        return {
            ...constTxBody,
            chainTag: Number(`0x${genesisBlock.id.slice(64)}`), // Last byte of the genesis block ID which is used to identify a network (chainTag)
            blockRef: latestBlock.id.slice(0, 18)
        };
    }

    /**
     * Signs a transaction with the given private key and handles the delegation if the transaction is delegated.
     * If the transaction is delegated, the signature of the delegator is retrieved from the delegator endpoint or from the delegator private key.
     *
     * @see [Simple Gas Payer Standard](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/fee-delegation/designated-gas-payer-vip-191) - Designated Gas Payer (VIP-191)
     *
     * @param txBody - The transaction body to sign.
     * @param privateKey - The private key of the origin account.
     * @param options - Optional parameters for the request. Includes the `delegatorUrl` and `delegatorPrivateKey` fields.
     *                  Only one of the following options can be specified: `delegatorUrl`, `delegatorPrivateKey`.
     *
     * @returns A promise that resolves to the signed transaction.
     */
    public async signTransaction(
        txBody: TransactionBody,
        privateKey: string,
        options?: SignTransactionOptions
    ): Promise<Transaction> {
        const originPrivateKey = Buffer.from(privateKey, 'hex');

        // Check if the transaction can be signed
        assertTransactionCanBeSigned(originPrivateKey, txBody);

        const unsignedTx = new Transaction(txBody);

        // Check if the transaction is delegated
        const isDelegated =
            options?.delegatorPrivatekey !== undefined ||
            options?.delegatorUrl !== undefined;

        return isDelegated
            ? await this._signWithDelegator(
                  unsignedTx,
                  originPrivateKey,
                  options?.delegatorPrivatekey,
                  options?.delegatorUrl
              )
            : TransactionHandler.sign(unsignedTx, originPrivateKey);
    }

    /**
     * Signs a transaction where the gas fee is paid by a delegator.
     *
     * @param unsignedTx - The unsigned transaction to sign.
     * @param originPrivateKey - The private key of the origin account.
     * @param delegatorPrivateKey - (Optional) The private key of the delegator account.
     * @param delegatorUrl - (Optional) The URL of the endpoint of the delegator.
     *
     * @returns A promise that resolves to the signed transaction.
     *
     * @throws an error if the delegation fails.
     */
    private async _signWithDelegator(
        unsignedTx: Transaction,
        originPrivateKey: Buffer,
        delegatorPrivateKey?: string,
        delegatorUrl?: string
    ): Promise<Transaction> {
        // Only one of the `SignTransactionOptions` options can be specified
        assert(
            !(delegatorUrl !== undefined && delegatorPrivateKey !== undefined),
            TRANSACTION.INVALID_DELEGATION,
            'Only one of the following options can be specified: delegatorUrl, delegatorPrivateKey'
        );

        // Address of the origin account
        const originAddress = addressUtils.fromPublicKey(
            secp256k1.derivePublicKey(originPrivateKey)
        );

        if (delegatorPrivateKey !== undefined)
            // Sign transaction with origin private key and delegator private key
            return TransactionHandler.signWithDelegator(
                unsignedTx,
                originPrivateKey,
                Buffer.from(delegatorPrivateKey, 'hex')
            );

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await getDelegationSignature(
            unsignedTx,
            delegatorUrl as string,
            originAddress,
            this.thorest.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = secp256k1.sign(
            unsignedTx.getSignatureHash(),
            originPrivateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([originSignature, delegatorSignature]);

        // Return new signed transaction
        return new Transaction(unsignedTx.body, signature);
    }
}

export { TransactionsModule };
