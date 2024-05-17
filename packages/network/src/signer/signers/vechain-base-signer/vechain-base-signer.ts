import {
    type AvailableVechainProviders,
    type TransactionRequestInput,
    type VechainSigner
} from '../types';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient,
    type TransactionSimulationResult
} from '../../../thor-client';
import {
    addressUtils,
    clauseBuilder,
    Hex0x,
    secp256k1,
    Transaction,
    type TransactionBody,
    type TransactionClause,
    TransactionHandler
} from '@vechain/sdk-core';
import { RPC_METHODS } from '../../../provider';
import { assert, DATA, JSONRPC, TRANSACTION } from '@vechain/sdk-errors';
import { assertTransactionCanBeSigned } from '../../../assertions';
import { vnsUtils } from '../../../utils';

/**
 * Basic vechain signer.
 * This signer can be initialized using a private key.
 */
class VechainBaseSigner implements VechainSigner {
    /**
     * The provider attached to this Signer (if any).
     */
    provider: AvailableVechainProviders | null;

    /**
     * Create a new VechainBaseSigner.
     * A signer can be initialized using a private key.
     *
     * @param privateKey - The private key of the signer
     * @param provider - The provider to connect to
     */
    constructor(
        private readonly privateKey: Buffer,
        provider: AvailableVechainProviders | null
    ) {
        // Store provider and delegator
        this.provider = provider;
    }

    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    connect(provider: AvailableVechainProviders | null): this {
        return new VechainBaseSigner(this.privateKey, provider) as this;
    }

    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    async getAddress(): Promise<string> {
        return addressUtils.toERC55Checksum(
            await Promise.resolve(addressUtils.fromPrivateKey(this.privateKey))
        );
    }

    /**
     *  Prepares a {@link TransactionRequestInput} for calling:
     *  - resolves ``to`` and ``from`` addresses
     *  - if ``from`` is specified, check that it matches this Signer
     *
     *  @note: Here the base support of multi-clause transaction is added.
     *  So, if clauses are provided in the transaction, it will be used as it is.
     *  Otherwise, standard transaction will be prepared.
     *
     *  @param transactionToPopulate - The call to prepare
     *  @returns the prepared call transaction
     */
    async populateCall(
        transactionToPopulate: TransactionRequestInput
    ): Promise<TransactionRequestInput> {
        // 1 - Add from field (if not provided)
        if (
            transactionToPopulate.from === undefined ||
            transactionToPopulate.from === null
        )
            transactionToPopulate.from = addressUtils.toERC55Checksum(
                await this.getAddress()
            );
        // Throw an error if the from address does not match the signer address
        // @note: this because we cannot sign a transaction with a different address
        else
            assert(
                'populateCall',
                addressUtils.toERC55Checksum(transactionToPopulate.from) ===
                    addressUtils.toERC55Checksum(await this.getAddress()),
                DATA.INVALID_DATA_TYPE,
                'From address does not match the signer address.',
                {
                    signerAddress: addressUtils.toERC55Checksum(
                        await this.getAddress()
                    ),
                    fromAddress: addressUtils.toERC55Checksum(
                        transactionToPopulate.from
                    )
                }
            );

        // 2 - Set to field
        if (transactionToPopulate.to === undefined)
            transactionToPopulate.to = null;

        // 3 - Use directly clauses, if they are provided
        if (
            transactionToPopulate.clauses !== undefined &&
            transactionToPopulate.clauses.length > 0
        ) {
            // 2.1 - Set to, value and data fields to be consistent
            transactionToPopulate.to = transactionToPopulate.clauses[0].to;
            transactionToPopulate.value =
                transactionToPopulate.clauses[0].value;
            transactionToPopulate.data = transactionToPopulate.clauses[0].data;
        }

        // Return the transaction
        return transactionToPopulate;
    }

    /**
     *  Prepares a {@link TransactionRequestInput} for sending to the network by
     *  populating any missing properties:
     *  - resolves ``to`` and ``from`` addresses
     *  - if ``from`` is specified , check that it matches this Signer
     *  - populates ``nonce`` via ``signer.getNonce("pending")``
     *  - populates gas parameters via ``signer.estimateGas(tx)``
     *  - ... and other necessary properties
     *
     *  @param transactionToPopulate - The call to prepare
     *  @returns the prepared transaction
     */
    async populateTransaction(
        transactionToPopulate: TransactionRequestInput
    ): Promise<TransactionBody> {
        // 1 - Get the thor client
        assert(
            'populateTransaction',
            (this.provider as AvailableVechainProviders).thorClient !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.'
        );
        const thorClient = (this.provider as AvailableVechainProviders)
            .thorClient;

        // 2 - Populate the call, to get proper 'from' and 'to' address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToPopulate
        );

        // 3 - Estimate gas
        const totalGasResult = await this.estimateGas(transactionToPopulate);

        // 4 - Build the transaction body
        return await thorClient.transactions.buildTransactionBody(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            totalGasResult,
            {
                isDelegated: this.provider?.enableDelegation as boolean,
                nonce:
                    populatedTransaction.nonce ??
                    (await this.getNonce('pending')),
                blockRef: populatedTransaction.blockRef ?? undefined,
                chainTag: populatedTransaction.chainTag ?? undefined,
                dependsOn: populatedTransaction.dependsOn ?? undefined,
                expiration: populatedTransaction.expiration,
                gasPriceCoef: populatedTransaction.gasPriceCoef ?? undefined
            }
        );
    }

    /**
     *  Estimates the required gas required to execute //tx// on the Blockchain. This
     *  will be the expected amount a transaction will require
     *  to successfully run all the necessary computations and store the needed state
     *  that the transaction intends.
     *
     *  @param transactionToEstimate - The transaction to estimate gas for
     *  @returns the total estimated gas required
     */
    async estimateGas(
        transactionToEstimate: TransactionRequestInput
    ): Promise<number> {
        // 1 - Get the thor client
        assert(
            'populateTransaction',
            (this.provider as AvailableVechainProviders).thorClient !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.'
        );
        const thorClient = (this.provider as AvailableVechainProviders)
            .thorClient;

        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToEstimate
        );

        // 3 - Estimate gas
        const gasEstimation = await thorClient.gas.estimateGas(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            populatedTransaction.from as string
        );

        // Return the gas estimation
        return gasEstimation.totalGas;
    }

    /**
     *  Evaluates the //tx// by running it against the current Blockchain state. This
     *  cannot change state and has no cost, as it is effectively simulating
     *  execution.
     *
     *  This can be used to have the Blockchain perform computations based on its state
     *  (e.g. running a Contract's getters) or to simulate the effect of a transaction
     *  before actually performing an operation.
     *
     *  @param transactionToEvaluate - The transaction to evaluate
     *  @param revision - The block number or block ID of which the transaction simulation is based on
     *  @returns the result of the evaluation
     */
    async call(
        transactionToEvaluate: TransactionRequestInput,
        revision?: string
    ): Promise<TransactionSimulationResult[]> {
        // 1 - Get the thor client
        assert(
            'call',
            (this.provider as AvailableVechainProviders).thorClient !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.'
        );
        const thorClient = (this.provider as AvailableVechainProviders)
            .thorClient;

        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToEvaluate
        );

        // 3 - Evaluate the transaction
        return await thorClient.transactions.simulateTransaction(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            {
                revision: revision ?? undefined,
                gas: (populatedTransaction.gas as number) ?? undefined,
                gasPrice: populatedTransaction.gasPrice ?? undefined,
                caller: populatedTransaction.from as string,
                provedWork: populatedTransaction.provedWork ?? undefined,
                gasPayer: populatedTransaction.gasPayer ?? undefined,
                expiration: populatedTransaction.expiration ?? undefined,
                blockRef: populatedTransaction.blockRef ?? undefined
            }
        );
    }

    /**
     *  Gets the next nonce required for this Signer to send a transaction.
     *
     *  @param blockTag - The blocktag to base the transaction count on, keep in mind
     *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
     *
     *  @NOTE: This method generates a random number as nonce. It is because the nonce in vechain is a 6-byte number.
     */
    async getNonce(blockTag?: string): Promise<string> {
        // If provider is available, get the nonce from the provider using eth_getTransactionCount
        if (this.provider !== null) {
            return (await this.provider.request({
                method: RPC_METHODS.eth_getTransactionCount,
                params: [await this.getAddress(), blockTag]
            })) as string;
        }

        // Otherwise return a random number
        return await Promise.resolve(Hex0x.of(secp256k1.randomBytes(6)));
    }

    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties witheth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        return await this._signFlow(
            transactionToSign,
            DelegationHandler(
                await this.provider?.wallet?.getDelegator()
            ).delegatorOrNull(),
            (this.provider as AvailableVechainProviders).thorClient,
            this.privateKey
        );
    }

    /**
     * --- START: TEMPORARY COMMENT ---
     * Probably add in the future with vechain_sdk_core_ethers.TransactionRequest as a return type
     * --- END: TEMPORARY COMMENT ---
     *
     *  Sends %%transactionToSend%% to the Network. The ``signer.populateTransaction(transactionToSend)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been populated first.
     *
     *  @param transactionToSend - The transaction to send
     *  @returns The transaction response
     */
    async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        // 1 - Get the provider (needed to send the raw transaction)
        assert(
            'sendTransaction',
            this.provider !== null,
            JSONRPC.INVALID_PARAMS,
            'Thor provider is not found into the signer. Please attach a Provider to your signer instance.'
        );
        const provider = this.provider as AvailableVechainProviders;

        // 2 - Sign the transaction
        const signedTransaction = await this.signTransaction(transactionToSend);

        // 3 - Send the signed transaction
        return (await provider.request({
            method: RPC_METHODS.eth_sendRawTransaction,
            params: [signedTransaction]
        })) as string;
    }

    /**
     * Signs a transaction internal method
     *
     * @param transaction - The transaction to sign
     * @param delegator - The delegator to use
     * @param thorClient - The ThorClient instance
     * @param privateKey - The private key of the signer
     * @returns The fully signed transaction
     */
    async _signFlow(
        transaction: TransactionRequestInput,
        delegator: SignTransactionOptions | null,
        thorClient: ThorClient,
        privateKey: Buffer
    ): Promise<string> {
        // // 1 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction =
            await this.populateTransaction(transaction);

        // Assert if the transaction can be signed
        assertTransactionCanBeSigned(
            'signTransaction',
            this.privateKey,
            populatedTransaction
        );

        // 6 - Sign the transaction
        return delegator !== null
            ? await this._signWithDelegator(
                  populatedTransaction,
                  privateKey,
                  thorClient,
                  delegator
              )
            : Hex0x.of(
                  TransactionHandler.sign(populatedTransaction, privateKey)
                      .encoded
              );
    }

    /**
     * Use vet.domains to resolve name to adress
     * @param vnsName - The name to resolve
     * @returns the address for a name or null
     */
    async resolveName(vnsName: string): Promise<null | string> {
        if (this.provider === null) {
            return null;
        }

        return await vnsUtils.resolveName(this.provider.thorClient, vnsName);
    }

    /**
     * Build the transaction clauses
     * form a transaction given as input
     *
     * @param transaction - The transaction to sign
     * @returns The transaction clauses
     */
    private _buildClauses(
        transaction: TransactionRequestInput
    ): TransactionClause[] {
        return transaction.to !== undefined && transaction.to !== null
            ? // Normal transaction
              [
                  {
                      to: transaction.to,
                      data: transaction.data ?? '0x',
                      value: transaction.value ?? '0x0'
                  } satisfies TransactionClause
              ]
            : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
              [clauseBuilder.deployContract(transaction.data ?? '0x')];
    }

    /**
     * Signs a transaction where the gas fee is paid by a delegator.
     *
     * @param unsignedTransactionBody - The unsigned transaction body to sign.
     * @param originPrivateKey - The private key of the origin account.
     * @param  - (Optional) The private key of the delegator account.
     * @param thorClient - The ThorClient instance.
     * @param delegatorOptions - Optional parameters for the request. Includes the `delegatorUrl` and `delegatorPrivateKey` fields.
     *                  Only one of the following options can be specified: `delegatorUrl`, `delegatorPrivateKey`.
     *
     * @returns A promise that resolves to the signed transaction.
     *
     * @throws an error if the delegation fails.
     */
    private async _signWithDelegator(
        unsignedTransactionBody: TransactionBody,
        originPrivateKey: Buffer,
        thorClient: ThorClient,
        delegatorOptions?: SignTransactionOptions
    ): Promise<string> {
        // Only one of the `SignTransactionOptions` options can be specified
        assert(
            '_signWithDelegator',
            !(
                delegatorOptions?.delegatorUrl !== undefined &&
                delegatorOptions?.delegatorPrivateKey !== undefined
            ),
            TRANSACTION.INVALID_DELEGATION,
            'Only one of the following options can be specified: delegatorUrl, delegatorPrivateKey'
        );

        // Address of the origin account
        const originAddress = addressUtils.fromPublicKey(
            Buffer.from(secp256k1.derivePublicKey(originPrivateKey))
        );

        const unsignedTx = new Transaction(unsignedTransactionBody);

        // Sign transaction with origin private key and delegator private key
        if (delegatorOptions?.delegatorPrivateKey !== undefined)
            return Hex0x.of(
                TransactionHandler.signWithDelegator(
                    unsignedTransactionBody,
                    originPrivateKey,
                    Buffer.from(delegatorOptions?.delegatorPrivateKey, 'hex')
                ).encoded
            );

        // Otherwise, get the signature of the delegator from the delegator endpoint
        const delegatorSignature = await DelegationHandler(
            delegatorOptions
        ).getDelegationSignatureUsingUrl(
            unsignedTx,
            originAddress,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = secp256k1.sign(
            unsignedTx.getSignatureHash(),
            originPrivateKey
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([originSignature, delegatorSignature]);

        // Return new signed transaction
        return Hex0x.of(new Transaction(unsignedTx.body, signature).encoded);
    }
}

export { VechainBaseSigner };
