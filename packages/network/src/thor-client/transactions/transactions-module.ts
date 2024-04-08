import { DelegationHandler } from './helpers';
import { assert, buildError, DATA, TRANSACTION } from '@vechain/sdk-errors';
import { assertTransactionCanBeSigned } from '../../assertions';
import { buildQuery, Poll, thorest } from '../../utils';
import { type ThorClient } from '../thor-client';
import {
    Hex0x,
    Transaction,
    TransactionHandler,
    addressUtils,
    assertIsSignedTransaction,
    assertValidTransactionHead,
    assertValidTransactionID,
    revisionUtils,
    secp256k1,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    type GetTransactionInputOptions,
    type GetTransactionReceiptInputOptions,
    type SendTransactionResult,
    type SignTransactionOptions,
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type TransactionBodyOptions,
    type TransactionDetail,
    type TransactionReceipt,
    type TransactionSimulationResult,
    type WaitForTransactionOptions
} from './types';

/**
 * Represents a module for interacting with VeChain transactions.
 * The class provides convenient methods for sending transactions and waiting for transaction confirmation.
 */
class TransactionsModule {
    /**
     * Creates a new instance.
     *
     * @param {ThorClient} thor - The ThorClient instance to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Signs a transaction where the gas fee is paid by a delegator.
     *
     * @param unsignedTransactionBody - The unsigned transaction body to sign.
     * @param originPrivateKey - The private key of the origin account.
     * @param delegatorPrivateKey - (Optional) The private key of the delegator account.
     * @param delegatorUrl - (Optional) The URL of the endpoint of the delegator.
     *
     * @returns A promise that resolves to the signed transaction.
     *
     * @throws an error if the delegation fails.
     */
    private async _signWithDelegator(
        unsignedTransactionBody: TransactionBody,
        originPrivateKey: Buffer,
        delegatorPrivateKey?: string,
        delegatorUrl?: string
    ): Promise<Transaction> {
        // Only one of the `SignTransactionOptions` options can be specified
        assert(
            'TransactionModule._signWithDelegator',
            !(delegatorUrl !== undefined && delegatorPrivateKey !== undefined),
            TRANSACTION.INVALID_DELEGATION,
            'Only one of the following options can be specified: delegatorUrl, delegatorPrivateKey'
        );

        // Address of the origin account
        const originAddress = addressUtils.fromPublicKey(
            secp256k1.derivePublicKey(originPrivateKey)
        );

        const unsignedTx = new Transaction(unsignedTransactionBody);

        // Sign transaction with origin private key and delegator private key
        if (delegatorPrivateKey !== undefined)
            return TransactionHandler.signWithDelegator(
                unsignedTransactionBody,
                originPrivateKey,
                Buffer.from(delegatorPrivateKey, 'hex')
            );

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await DelegationHandler({
            delegatorUrl: delegatorUrl as string
        }).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            this.thor.httpClient
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
        const blockRef =
            options?.blockRef ?? (await this.thor.blocks.getBestBlockRef());
        if (blockRef === null)
            throw buildError(
                'TransactionsModule.buildTransactionBody',
                TRANSACTION.INVALID_TRANSACTION_BODY,
                'Error while building transaction body: Cannot get latest block.',
                { clauses, options }
            );

        let chainTag: number;
        if (options?.chainTag != null) {
            chainTag = options.chainTag;
        } else {
            // Get the genesis block to get the chainTag
            const genesisBlock = await this.thor.blocks.getBlockCompressed(0);
            if (genesisBlock === null)
                throw buildError(
                    'TransactionsModule.buildTransactionBody',
                    TRANSACTION.INVALID_TRANSACTION_BODY,
                    'Error while building transaction body: Cannot get genesis block.',
                    { clauses, options }
                );
            chainTag = Number(`0x${genesisBlock.id.slice(64)}`);
        }
        return {
            blockRef,
            chainTag,
            clauses,
            dependsOn: options?.dependsOn ?? null,
            expiration: options?.expiration ?? 32,
            gas,
            gasPriceCoef: options?.gasPriceCoef ?? 0,
            nonce: options?.nonce ?? Hex0x.of(secp256k1.randomBytes(8)),
            reserved:
                options?.isDelegated === true ? { features: 1 } : undefined
        };
    }

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
        assertValidTransactionID('getTransaction', id);

        // Invalid head
        assertValidTransactionHead('getTransaction', options?.head);

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
        assertValidTransactionID('getTransactionReceipt', id);

        // Invalid head
        assertValidTransactionHead('getTransactionReceipt', options?.head);

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
    ): Promise<SendTransactionResult> {
        // Validate raw transaction
        assert(
            'TransactionModule.sendRawTransaction',
            Hex0x.isValid(raw),
            DATA.INVALID_DATA_TYPE,
            'Sending failed: Input must be a valid raw transaction in hex format.',
            { raw }
        );

        // Decode raw transaction to check if raw is ok
        try {
            TransactionHandler.decode(Buffer.from(raw.slice(2), 'hex'), true);
        } catch (error) {
            throw buildError(
                'TransactionsModule.sendRawTransaction',
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
        )) as SendTransactionResult;
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
        // Assert transaction is signed or not
        assertIsSignedTransaction('sendTransaction', signedTx);

        const rawTx = Hex0x.of(signedTx.encoded);

        return await this.sendRawTransaction(rawTx);
    }

    /**
     * Signs a transaction with the given private key and handles the delegation if the transaction is delegated.
     * If the transaction is delegated, the signature of the delegator is retrieved from the delegator endpoint or from the delegator private key.
     *
     * @see [Simple Gas Payer Standard](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/fee-delegation/designated-gas-payer-vip-191) - Designated Gas Payer (VIP-191)
     *
     * @param txBody - The transaction body to sign.
     * @param privateKey - The private key of the origin account.
     * @param delegatorOptions - Optional parameters for the request. Includes the `delegatorUrl` and `delegatorPrivateKey` fields.
     *                  Only one of the following options can be specified: `delegatorUrl`, `delegatorPrivateKey`.
     *
     * @returns A promise that resolves to the signed transaction.
     */
    public async signTransaction(
        txBody: TransactionBody,
        privateKey: string,
        delegatorOptions?: SignTransactionOptions
    ): Promise<Transaction> {
        const originPrivateKey = Buffer.from(privateKey, 'hex');

        // Check if the transaction can be signed
        assertTransactionCanBeSigned(
            'signTransaction',
            originPrivateKey,
            txBody
        );

        // Check if the transaction is delegated
        return DelegationHandler(delegatorOptions).isDelegated()
            ? await this._signWithDelegator(
                  txBody,
                  originPrivateKey,
                  delegatorOptions?.delegatorPrivateKey,
                  delegatorOptions?.delegatorUrl
              )
            : TransactionHandler.sign(txBody, originPrivateKey);
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
            'TransactionsModule.simulateTransaction',
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

    /**
     * Waits for a transaction to be included in a block.
     *
     * @param txID - The transaction ID of the transaction to wait for.
     * @param options - Optional parameters for the request. Includes the timeout and interval between requests.
     *                  Both parameters are in milliseconds. If the timeout is not specified, the request will not time out!
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
        assertValidTransactionID('waitForTransaction', txID);

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
}

export { TransactionsModule };
