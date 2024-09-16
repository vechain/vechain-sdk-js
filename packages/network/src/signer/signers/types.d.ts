import {
    type TransactionClause,
    type vechain_sdk_core_ethers
} from '@vechain/sdk-core';
import {
    type HardhatVeChainProvider,
    type VeChainProvider
} from '../../provider';

/**
 * Available types for the VeChainProvider's
 *
 * @NOTE: We use our supported providers instead of ethers providers.
 * If you create a new provider, you need to add it here.
 */
type AvailableVeChainProviders = VeChainProvider | HardhatVeChainProvider;

/**
 * Type for transaction input
 *
 * @note Types of the properties can differ WRT ethers.TransactionRequest
 */
interface TransactionRequestInput {
    /**
     *  The target of the transaction.
     */
    to?: null | string;

    /**
     *  The sender of the transaction.
     */
    from?: null | string;

    /**
     * Nonce value for various purposes.
     * Basic is to prevent replay attack by make transaction unique.
     * Every transaction with same chainTag, blockRef, ... must have different nonce.
     */
    nonce?: string | number;

    /**
     * Transaction gas.
     */
    gas?: string | number;

    /**
     *  The maximum amount of gas to allow this transaction to consume.
     */
    gasLimit?: string;

    /**
     *  The gas price to use for legacy transactions or transactions on
     *  legacy networks.
     *
     *  Most of the time the ``max*FeePerGas`` is preferred.
     */
    gasPrice?: string;

    /**
     * Coefficient used to calculate the gas price for the transaction.
     * Value must be between 0 and 255.
     */
    gasPriceCoef?: number;

    /**
     *  The transaction data.
     */
    data?: string;

    /**
     *  The transaction value (in wei).
     */
    value?: string | number;

    /**
     *  When using ``call`` or ``estimateGas``, this allows a specific
     *  block to be queried. Many backends do not support this and when
     *  unsupported errors are silently squelched and ``"latest"`` is used.
     */
    blockTag?: string;

    /**
     * Add clauses to ethers.TransactionRequest
     */
    clauses?: TransactionClause[];

    /**
     * The ID of the transaction that this transaction depends on.
     */
    dependsOn?: string;

    /**
     * The expiration time of the transaction.
     * The transaction will expire after the number of blocks specified by this value.
     */
    expiration?: number;

    /**
     * 8 bytes prefix of some block's ID
     */
    blockRef?: string;

    /**
     * Last byte of genesis block ID
     */
    chainTag?: number;

    /**
     * A reserved field intended for features use.
     *
     * In standard EVM transactions, this reserved field typically is not present.
     * However, it's been designed to cater to VIP-191, which deals with fee delegation.
     *
     * If the `features` within the `reserved` field is set as `1111...111`, it indicates that the transaction has been delegated.
     * The method to check if the transaction is delegated is:
     *
     * ```typescript
     * reserved.features & 1 === 1
     * ```
     *
     * @example
     *
     * 1.
     * ```typescript
     * feature = 111101;
     * isDelegated = (111101 & 111111) === 111101; // false (not delegated)
     * ```
     *
     * 2.
     * ```typescript
     * feature = 111111;
     * isDelegated = (111111 & 111111) === 111111; // true (delegated)
     * ```
     *
     * @remarks
     * For more information on the subject, refer to {@link https://github.com/vechain/VIPs/blob/master/vips/VIP-191.md | VIP-191}.
     */
    reserved?: {
        /**
         * Tx feature bits
         */
        features?: number;
        /**
         * Unused
         */
        unused?: Buffer[];
    };

    /**
     * The VeChainThor blockchain allows for transaction-level proof of work (PoW) and converts the proved work into extra gas price that will be used by
     * the system to generate more reward to the block generator, the Authority Masternode, that validates the transaction.
     * In other words, users can utilize their local computational power to make their transactions more likely to be included in a new block.
     *
     * @link [VeChainThor Proof of Work](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#proof-of-work)
     */
    provedWork?: string;

    /**
     * The address that pays for the gas fee of the transaction simulation.
     * If different from the caller, then a delegated transaction is simulated.
     */
    gasPayer?: string;

    // START: NOT SUPPORTED FIELDS in VeChain BUT added to take compatibility with ethers

    /**
     *  The chain ID for the network this transaction is valid on.
     */
    chainId?: string;

    /**
     *  The [[link-eip-2930]] access list. Storage slots included in the access
     *  list are //warmed// by preloading them, so their initial cost to
     *  fetch is guaranteed, but then each additional access is cheaper.
     */
    accessList?: null | vechain_sdk_core_ethers.AccessListish;

    /**
     *  A custom object, which can be passed along for network-specific
     *  values.
     */
    customData?: unknown;

    /**
     *  The [[link-eip-1559]] maximum priority fee to pay per gas.
     */
    maxPriorityFeePerGas?: string;

    /**
     *  The [[link-eip-1559]] maximum total fee to pay per gas. The actual
     *  value used is protocol enforced to be the block's base fee.
     */
    maxFeePerGas?: string;

    /**
     *  The transaction type.
     */
    type?: null | number;

    /**
     *  When using ``call``, this enables CCIP-read, which permits the
     *  provider to be redirected to web-based content during execution,
     *  which is then further validated by the contract.
     *
     *  There are potential security implications allowing CCIP-read, as
     *  it could be used to expose the IP address or user activity during
     *  the fetch to unexpected parties.
     */
    enableCcipRead?: boolean;

    // END: NOT SUPPORTED FIELDS in VeChain BUT added to take compatibility with ethers
}

/**
 * A signer for VeChain, adding specific methods for VeChain to the ethers signer
 *
 * @NOTE: Su support completely our providers (that already support ethers provider format)
 * We use our supported providers instead of ethers providers
 */
interface VeChainSigner {
    /**
     * The provider attached to this Signer (if any).
     */
    provider: AvailableVeChainProviders | null;

    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    connect: (provider: AvailableVeChainProviders | null) => this;

    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    getAddress: () => Promise<string>;

    /**
     *  Gets the next nonce required for this Signer to send a transaction.
     *
     *  @param blockTag - The blocktag to base the transaction count on, keep in mind
     *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
     *
     *  @NOTE: This method generates a random number as nonce. It is because the nonce in VeChain is a 6-byte number.
     */
    getNonce: (blockTag?: string) => Promise<string>;

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
    populateCall: (
        transactionToPopulate: TransactionRequestInput
    ) => Promise<TransactionRequestInput>;

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
    populateTransaction: (
        transactionToPopulate: TransactionRequestInput
    ) => Promise<TransactionBody>;

    /**
     *  Estimates the required gas required to execute //tx// on the Blockchain. This
     *  will be the expected amount a transaction will require
     *  to successfully run all the necessary computations and store the needed state
     *  that the transaction intends.
     *
     *  @param transactionToEstimate - The transaction to estimate gas for
     *  @returns the total estimated gas required
     */
    estimateGas: (
        transactionToEstimate: TransactionRequestInput
    ) => Promise<number>;

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
     *  @param revision - The revision to evaluate the transaction against
     *  @returns the result of the evaluation
     */
    call: (
        transactionToEvaluate: TransactionRequestInput,
        revision?: string
    ) => Promise<string>;

    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties within the transaction.
     *
     * @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    signTransaction: (
        transactionToSign: TransactionRequestInput
    ) => Promise<string>;

    /**
     *  Sends %%transactionToSend%% to the Network. The ``signer.populateTransaction(transactionToSend)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been populated first.
     *
     *  @param transactionToSend - The transaction to send
     *  @returns The transaction response
     */
    sendTransaction: (
        transactionToSend: TransactionRequestInput
    ) => Promise<string>;

    /**
     *  Signs an [[link-eip-191]] prefixed a personal message.
     *
     *  If the %%message%% is a string, it is signed as UTF-8 encoded bytes. It is **not**
     *  interpreted as a [[BytesLike]]; so the string ``"0x1234"`` is signed as six
     *  characters, **not** two bytes.
     *
     *  To sign that example as two bytes, the Uint8Array should be used
     *  (i.e. ``new Uint8Array([ 0x12, 0x34 ])``).
     */
    signMessage: (message: string | Uint8Array) => Promise<string>;

    /**
     *  Signs the [[link-eip-712]] typed data.
     */
    signTypedData: (
        domain: vechain_sdk_core_ethers.TypedDataDomain,
        types: Record<string, vechain_sdk_core_ethers.TypedDataField[]>,
        value: Record<string, unknown>
    ) => Promise<string>;

    /**
     *  Resolves an VNS Name to an address.
     */
    resolveName: (vnsName: string) => Promise<null | string>;
}

export {
    type VeChainSigner,
    type AvailableVeChainProviders,
    type TransactionRequestInput
};
