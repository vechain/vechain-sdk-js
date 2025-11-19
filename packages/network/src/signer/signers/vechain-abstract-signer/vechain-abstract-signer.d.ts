import { Revision, type TransactionBody, type TransactionClause } from '@vechain/sdk-core';
import { type AvailableVeChainProviders, type TransactionRequestInput, type TypedDataDomain, type TypedDataParameter, type VeChainSigner } from '../types';
/**
 * Abstract VeChain signer.
 * This abstract class avoids people every time implementing standard signer
 * methods.
 * By implementing this abstract class, it will be easier to create new signers
 */
declare abstract class VeChainAbstractSigner implements VeChainSigner {
    protected readonly MESSAGE_PREFIX: Uint8Array<ArrayBufferLike>;
    /**
     * The provider attached to this Signer (if any).
     */
    provider?: AvailableVeChainProviders;
    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param provider - The provider to connect to
     */
    protected constructor(provider?: AvailableVeChainProviders);
    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if undefined.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    abstract connect(provider: AvailableVeChainProviders): this;
    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    abstract getAddress(): Promise<string>;
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
     * @throws {InvalidDataType}
     */
    populateCall(transactionToPopulate: TransactionRequestInput): Promise<TransactionRequestInput>;
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
     *  @throws {JSONRPCInvalidParams}
     */
    populateTransaction(transactionToPopulate: TransactionRequestInput): Promise<TransactionBody>;
    /**
     * Estimates the gas required to execute //tx// on the Blockchain. This
     * will be the expected amount a transaction will need
     * to successfully run all the necessary computations and store the changed state
     * that the transaction intends.
     *
     * @param transactionToEstimate - The transaction to estimate gas for
     * @returns the total estimated gas required
     * @throws {JSONRPCInvalidParams}
     */
    estimateGas(transactionToEstimate: TransactionRequestInput): Promise<number>;
    /**
     * Evaluates the //tx// by running it against the current Blockchain state. This
     * cannot change state and has no cost, as it is effectively simulating
     * execution.
     *
     * This can be used to have the Blockchain perform computations based on its state
     * (e.g. running a Contract's getters) or to simulate the effect of a transaction
     * before actually performing an operation.
     *
     * @param transactionToEvaluate - The transaction to evaluate
     * @param revision - The block number or block ID of which the transaction simulation is based on
     * @returns the result of the evaluation
     * @throws {JSONRPCInvalidParams}
     */
    call(transactionToEvaluate: TransactionRequestInput, revision?: Revision): Promise<string>;
    /**
     *  Gets the next nonce required for this Signer to send a transaction.
     *
     *  @param blockTag - The blocktag to base the transaction count on, keep in mind
     *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
     *
     *  @NOTE: This method generates a random number as nonce. It is because the nonce in VeChain is a 6-byte number.
     */
    getNonce(blockTag?: string): Promise<string>;
    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties with eth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    abstract signTransaction(transactionToSign: TransactionRequestInput): Promise<string>;
    /**
     *  Sends %%transactionToSend%% to the Network. The ``signer.populateTransaction(transactionToSend)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been populated first.
     *
     *  @param transactionToSend - The transaction to send
     *  @returns The transaction response
     */
    abstract sendTransaction(transactionToSend: TransactionRequestInput): Promise<string>;
    /**
     * Signs a bytes payload returning the VeChain signature in hexadecimal format.
     * @param {Uint8Array} payload in bytes to sign.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    abstract signPayload(payload: Uint8Array): Promise<string>;
    /**
     * Signs an [[link-eip-191]] prefixed a personal message.
     *
     * @param {string|Uint8Array} message - The message to be signed.
     *                                      If the %%message%% is a string, it is signed as UTF-8 encoded bytes.
     *                                      It is **not** interpreted as a [[BytesLike]];
     *                                      so the string ``"0x1234"`` is signed as six characters, **not** two bytes.
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    signMessage(message: string | Uint8Array): Promise<string>;
    /**
     * Deduces the primary from the types if not given.
     * The primary type will be the only type that is not used in any other type.
     * @param {Record<string, TypedDataParameter[]>} types - The types used for EIP712.
     * @returns {string} The primary type.
     */
    private deducePrimaryType;
    /**
     * Signs the [[link-eip-712]] typed data.
     *
     * @param {TypedDataDomain} domain - The domain parameters used for signing.
     * @param {Record<string, TypedDataParameter[]>} types - The types used for signing.
     * @param {Record<string, unknown>} message - The message data to be signed.
     * @param {string} primaryType - The primary type used for signing.
     *
     * @return {Promise<string>} - A promise that resolves with the signature string.
     */
    signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataParameter[]>, message: Record<string, unknown>, primaryType?: string): Promise<string>;
    /**
     * Use vet.domains to resolve name to address
     * @param vnsName - The name to resolve
     * @returns the address for a name or null
     */
    resolveName(vnsName: string): Promise<null | string>;
    /**
     * Build the transaction clauses
     * form a transaction given as input
     *
     * @param transaction - The transaction to sign
     * @returns The transaction clauses
     */
    protected _buildClauses(transaction: TransactionRequestInput): TransactionClause[];
}
export { VeChainAbstractSigner };
//# sourceMappingURL=vechain-abstract-signer.d.ts.map